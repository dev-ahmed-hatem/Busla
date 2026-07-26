import 'package:busla_core/busla_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'config.dart';
import 'features/track/track_screen.dart';

void main() {
  runApp(const ProviderScope(child: ParentApp()));
}

/// Provides the shared API client to the widget tree.
final apiProvider = Provider<BuslaApi>((ref) {
  return BuslaApi(baseUrl: AppConfig.apiBaseUrl);
});

class ParentApp extends StatelessWidget {
  const ParentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BUSLA Parent',
      theme: buslaTheme(),
      // EN + AR with RTL handled by Directionality per locale (Phase 0 defaults to system).
      home: const TrackScreen(),
    );
  }
}
