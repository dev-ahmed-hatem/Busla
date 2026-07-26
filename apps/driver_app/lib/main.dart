import 'package:busla_core/busla_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'config.dart';
import 'features/shift/shift_screen.dart';

void main() {
  runApp(const ProviderScope(child: DriverApp()));
}

final apiProvider = Provider<BuslaApi>((ref) {
  return BuslaApi(baseUrl: AppConfig.apiBaseUrl);
});

class DriverApp extends StatelessWidget {
  const DriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BUSLA Driver',
      theme: buslaTheme(),
      home: const ShiftScreen(),
    );
  }
}
