import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  late Dio _dio;
  
  // Use 10.0.2.2 for Android Emulator, localhost for Web/Desktop
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8000/api';
    return defaultTargetPlatform == TargetPlatform.android 
      ? 'http://10.0.2.2:8000/api' 
      : 'http://localhost:8000/api';
  }

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (e, handler) {
        if (e.response?.statusCode == 401) {
          // Handle unauthorized
        }
        return handler.next(e);
      },
    ));
  }

  Dio get dio => _dio;
}
