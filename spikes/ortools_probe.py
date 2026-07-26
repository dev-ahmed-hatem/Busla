"""OR-Tools VRP feasibility probe on a synthetic BUSLA-scale fleet.

Goal: confirm OR-Tools produces sane capacitated routes with an arrival deadline
in acceptable time before we build the real optimizer (routing slice, Phase 3).

Not production code. Run: `pip install ortools && python spikes/ortools_probe.py`
"""

from __future__ import annotations

import math
import random

try:
    from ortools.constraint_solver import pywrapcp, routing_enums_pb2
except ImportError:  # pragma: no cover
    raise SystemExit("pip install ortools to run this probe")

# --- Synthetic scenario (reference scale) ---
NUM_STUDENTS = 120  # a single zone slice of the ~625 total
NUM_BUSES = 6
SEATS = 25
SEED = 42


def build_scenario():
    rng = random.Random(SEED)
    # node 0 = school (depot); nodes 1..N = student stops around it
    coords = [(0.0, 0.0)]
    demands = [0]
    for _ in range(NUM_STUDENTS):
        coords.append((rng.uniform(-0.15, 0.15), rng.uniform(-0.15, 0.15)))
        demands.append(1)
    return coords, demands


def dist_matrix(coords):
    def d(a, b):
        return int(math.dist(coords[a], coords[b]) * 111_000)  # ~metres

    return [[d(i, j) for j in range(len(coords))] for i in range(len(coords))]


def main() -> None:
    coords, demands = build_scenario()
    matrix = dist_matrix(coords)
    n = len(coords)

    manager = pywrapcp.RoutingIndexManager(n, NUM_BUSES, 0)
    routing = pywrapcp.RoutingModel(manager)

    transit = routing.RegisterTransitCallback(
        lambda i, j: matrix[manager.IndexToNode(i)][manager.IndexToNode(j)]
    )
    routing.SetArcCostEvaluatorOfAllVehicles(transit)

    demand_cb = routing.RegisterUnaryTransitCallback(
        lambda i: demands[manager.IndexToNode(i)]
    )
    routing.AddDimensionWithVehicleCapacity(
        demand_cb, 0, [SEATS] * NUM_BUSES, True, "Capacity"
    )

    params = pywrapcp.DefaultRoutingSearchParameters()
    params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    params.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    params.time_limit.seconds = 10

    solution = routing.SolveWithParameters(params)
    if not solution:
        raise SystemExit("no solution")

    total = 0
    used = 0
    for v in range(NUM_BUSES):
        idx = routing.Start(v)
        load = stops = 0
        while not routing.IsEnd(idx):
            load += demands[manager.IndexToNode(idx)]
            nxt = solution.Value(routing.NextVar(idx))
            total += routing.GetArcCostForVehicle(idx, nxt, v)
            idx = nxt
            stops += 1
        if load:
            used += 1
            print(f"bus {v}: {load}/{SEATS} students, {stops} stops")
    print(f"\n{used}/{NUM_BUSES} buses used · total distance ~{total/1000:.1f} km")


if __name__ == "__main__":
    main()
