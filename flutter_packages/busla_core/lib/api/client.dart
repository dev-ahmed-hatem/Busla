import 'package:dio/dio.dart';

/// Thin Dio wrapper for the BUSLA API. Once the Dart client is generated from
/// contracts/openapi.yaml (`make gen-dart` → lib/api/generated), typed services
/// are constructed against this Dio instance.
class BuslaApi {
  BuslaApi({required String baseUrl, String Function()? getToken})
      : dio = Dio(BaseOptions(baseUrl: baseUrl)) {
    if (getToken != null) {
      dio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            final token = getToken();
            if (token.isNotEmpty) {
              options.headers['Authorization'] = 'Bearer $token';
            }
            handler.next(options);
          },
        ),
      );
    }
  }

  final Dio dio;

  /// Phase-0 health probe (until the generated client lands).
  Future<Map<String, dynamic>> health() async {
    final res = await dio.get<Map<String, dynamic>>('/api/v1/health/');
    return res.data ?? <String, dynamic>{};
  }
}
