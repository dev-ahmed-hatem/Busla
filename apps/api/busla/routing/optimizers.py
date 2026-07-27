"""Route optimization.

A capacitated vehicle-routing optimizer that assigns student stops to buses (respecting
seat capacity) and orders each bus's stops to minimize travel. Distances come from a
pluggable `DistanceProvider` (haversine now; a Google Distance Matrix provider can slot
in later). `OrToolsOptimizer` uses Google OR-Tools; `GreedyOptimizer` is a dependency-free
fallback so the feature keeps working if the ortools native libs are unavailable.
"""

from __future__ import annotations

import importlib
import math
from dataclasses import dataclass, field

from django.conf import settings

AVG_SPEED_KMH = 30.0


def haversine_km(a: tuple[float, float], b: tuple[float, float]) -> float:
    """Great-circle distance in km between (lat, lng) points."""
    lat1, lon1, lat2, lon2 = map(math.radians, [a[0], a[1], b[0], b[1]])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * 6371.0 * math.asin(math.sqrt(h))


@dataclass
class Stop:
    key: str  # student id
    lat: float
    lng: float


@dataclass
class PlannedRoute:
    stop_keys: list[str] = field(default_factory=list)  # ordered student ids
    distance_km: float = 0.0
    duration_min: int = 0


def _matrix(points: list[tuple[float, float]]) -> list[list[float]]:
    return [[haversine_km(p, q) for q in points] for p in points]


def _route_distance(depot: tuple[float, float], stops: list[Stop]) -> float:
    if not stops:
        return 0.0
    pts = [depot, *[(s.lat, s.lng) for s in stops], depot]
    return sum(haversine_km(pts[i], pts[i + 1]) for i in range(len(pts) - 1))


class BaseOptimizer:
    @classmethod
    def ensure_available(cls) -> None:  # pragma: no cover - trivial
        return None

    def plan(
        self, stops: list[Stop], depot: tuple[float, float], num_vehicles: int, capacity: int
    ) -> list[PlannedRoute]:
        raise NotImplementedError


class GreedyOptimizer(BaseOptimizer):
    """Nearest-neighbour fill: repeatedly build a bus load of up to `capacity` nearest stops."""

    def plan(self, stops, depot, num_vehicles, capacity):
        remaining = list(stops)
        routes: list[PlannedRoute] = []
        for _ in range(max(1, num_vehicles)):
            if not remaining:
                break
            load: list[Stop] = []
            current = depot
            while remaining and len(load) < capacity:
                nxt = min(remaining, key=lambda s: haversine_km(current, (s.lat, s.lng)))
                load.append(nxt)
                remaining.remove(nxt)
                current = (nxt.lat, nxt.lng)
            dist = _route_distance(depot, load)
            routes.append(
                PlannedRoute(
                    stop_keys=[s.key for s in load],
                    distance_km=round(dist, 1),
                    duration_min=round(dist / AVG_SPEED_KMH * 60),
                )
            )
        # Any overflow beyond num_vehicles*capacity gets appended to the last route.
        if remaining and routes:
            routes[-1].stop_keys.extend(s.key for s in remaining)
        return [r for r in routes if r.stop_keys]


class OrToolsOptimizer(BaseOptimizer):
    """Capacitated VRP via OR-Tools; minimizes total travel distance."""

    @classmethod
    def ensure_available(cls) -> None:
        # Raises (ImportError / OSError for broken native libs) if unusable → caller falls back.
        from ortools.constraint_solver import pywrapcp  # noqa: F401

    def plan(self, stops, depot, num_vehicles, capacity):
        from ortools.constraint_solver import pywrapcp, routing_enums_pb2

        if not stops:
            return []
        num_vehicles = max(1, num_vehicles)
        points = [depot, *[(s.lat, s.lng) for s in stops]]
        dist_m = [[int(d * 1000) for d in row] for row in _matrix(points)]

        manager = pywrapcp.RoutingIndexManager(len(points), num_vehicles, 0)
        model = pywrapcp.RoutingModel(manager)

        def distance_cb(i, j):
            return dist_m[manager.IndexToNode(i)][manager.IndexToNode(j)]

        transit = model.RegisterTransitCallback(distance_cb)
        model.SetArcCostEvaluatorOfAllVehicles(transit)

        def demand_cb(i):
            return 0 if manager.IndexToNode(i) == 0 else 1

        demand = model.RegisterUnaryTransitCallback(demand_cb)
        model.AddDimensionWithVehicleCapacity(demand, 0, [capacity] * num_vehicles, True, "Capacity")

        params = pywrapcp.DefaultRoutingSearchParameters()
        params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        params.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        params.time_limit.FromSeconds(int(getattr(settings, "OPTIMIZER_TIME_LIMIT_SEC", 10)))

        solution = model.SolveWithParameters(params)
        routes: list[PlannedRoute] = []
        if not solution:
            return GreedyOptimizer().plan(stops, depot, num_vehicles, capacity)

        for v in range(num_vehicles):
            index = model.Start(v)
            ordered: list[Stop] = []
            while not model.IsEnd(index):
                node = manager.IndexToNode(index)
                if node != 0:
                    ordered.append(stops[node - 1])
                index = solution.Value(model.NextVar(index))
            if ordered:
                dist = _route_distance(depot, ordered)
                routes.append(
                    PlannedRoute(
                        stop_keys=[s.key for s in ordered],
                        distance_km=round(dist, 1),
                        duration_min=round(dist / AVG_SPEED_KMH * 60),
                    )
                )
        return routes


def get_optimizer() -> BaseOptimizer:
    """Resolve settings.BUSLA_OPTIMIZER; fall back to greedy if the backend can't load."""
    try:
        module_path, cls_name = settings.BUSLA_OPTIMIZER.rsplit(".", 1)
        optimizer_cls = getattr(importlib.import_module(module_path), cls_name)
        optimizer_cls.ensure_available()
        return optimizer_cls()
    except Exception:
        return GreedyOptimizer()
