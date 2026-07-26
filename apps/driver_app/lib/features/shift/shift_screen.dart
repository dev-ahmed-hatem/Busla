import 'package:busla_core/busla_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../main.dart';

/// Phase-0 home: API connectivity check. Phase 1 adds shift check-in;
/// Phase 4 adds the route/roster + GPS foreground streaming.
class ShiftScreen extends ConsumerWidget {
  const ShiftScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final api = ref.watch(apiProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('BUSLA Driver')),
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
            return StatusPill(
              status: snap.data!['status'] == 'ok' ? 'on_time' : 'issue',
              label: 'All systems operational',
            );
          },
        ),
      ),
    );
  }
}
