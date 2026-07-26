import 'package:flutter/material.dart';

import '../generated/tokens.dart';

/// Builds the shared BUSLA ThemeData from the generated design tokens.
/// Both apps call `buslaTheme()` so web + mobile share one palette.
ThemeData buslaTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: BuslaTokens.color_brand_navy,
    primary: BuslaTokens.color_brand_navy,
    secondary: BuslaTokens.color_brand_amber,
    surface: BuslaTokens.color_surface,
    brightness: Brightness.light,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: BuslaTokens.color_background,
    cardTheme: CardTheme(
      color: BuslaTokens.color_surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(BuslaTokens.radius_lg),
        side: BorderSide(color: BuslaTokens.color_border),
      ),
    ),
  );
}

/// Domain status → semantic status colour (mirrors packages/ui StatusPill).
Color statusColor(String status) {
  switch (status.toLowerCase().replaceAll(RegExp(r'[\s-]'), '_')) {
    case 'on_time':
    case 'ready':
    case 'active':
    case 'completed':
    case 'attend':
    case 'in_service':
    case 'checked_in':
      return BuslaTokens.color_status_onTime;
    case 'delayed':
    case 'maintenance':
    case 'soon':
    case 'pending':
    case 'scheduled':
      return BuslaTokens.color_status_delayed;
    case 'broken_down':
    case 'off_route':
    case 'issue':
    case 'absent':
    case 'critical':
      return BuslaTokens.color_status_issue;
    default:
      return BuslaTokens.color_neutral_500;
  }
}
