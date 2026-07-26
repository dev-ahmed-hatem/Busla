import 'package:busla_core/busla_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../main.dart';

/// Phase-0 home: proves the app talks to the API via busla_core.
/// Phase 4 replaces this with the live child-bus map + ETA.
class TrackScreen extends ConsumerWidget {
  const TrackScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final api = ref.watch(apiProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('BUSLA Parent')),
      body: Center(
        child: FutureBuilder<Map<String, dynamic>>(
          future: api.health(),
          builder: (context, snap) {
            if (snap.connectionState != ConnectionState.done) {
              return const CircularProgressIndicator();
            }
            if (snap.hasError || snap.data == null) {
              return const StatusPill(status: 'issue', label: 'API unreachable');
            }
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('System status'),
                const SizedBox(height: 8),
                StatusPill(
                  status: snap.data!['status'] == 'ok' ? 'on_time' : 'issue',
                  label: 'All systems operational',
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
