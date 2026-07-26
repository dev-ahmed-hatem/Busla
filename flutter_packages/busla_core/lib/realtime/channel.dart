import 'dart:convert';

import 'package:web_socket_channel/web_socket_channel.dart';

/// Minimal typed WebSocket subscription to a Channels topic. Phase 4 adds a shared
/// connection manager, reconnect/backoff, and batched GPS publishing (driver app).
class BuslaChannel {
  BuslaChannel(this.wsBaseUrl);

  final String wsBaseUrl;

  Stream<Map<String, dynamic>> subscribe(String path) {
    final channel = WebSocketChannel.connect(Uri.parse('$wsBaseUrl$path'));
    return channel.stream.map((event) {
      try {
        return jsonDecode(event as String) as Map<String, dynamic>;
      } catch (_) {
        return <String, dynamic>{};
      }
    });
  }
}
