import 'package:firebase_messaging/firebase_messaging.dart';

/// FCM registration shared by both apps. Phase 1 posts the token to
/// POST /api/v1/devices; Phase 5 routes notification types to deep links.
class BuslaPush {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  Future<String?> register() async {
    await _messaging.requestPermission();
    return _messaging.getToken();
  }
}
