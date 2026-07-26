# spikes/

Throwaway probes to burn down Phase-0 risk **before** the real slices commit to assumptions.
These are NOT production code — delete or graduate them into `apps/api` / apps once validated.

| Probe | Risk it de-risks | File |
|---|---|---|
| OR-Tools VRP on synthetic fleet | optimizer correctness + runtime on 625 students / 20 buses | `ortools_probe.py` |
| Driver GPS foreground streaming | battery + WS reliability while backgrounded (Flutter) | `gps_stream_probe/` (TODO) |
| Excel/CSV parse + validate | dirty address data feeding geocoding/optimizer | `import_probe.py` (TODO) |
| RTL chrome audit | catch RTL layout breakage early | tracked in web app via `ar` locale |

Run the OR-Tools probe: `python spikes/ortools_probe.py` (needs `pip install ortools`).
