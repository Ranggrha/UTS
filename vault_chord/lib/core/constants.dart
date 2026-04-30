import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class AppConstants {
  // Gunakan 10.0.2.2 untuk Android Emulator (localhost di host machine)
  // Ganti dengan IP server jika menggunakan perangkat fisik
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://127.0.0.1:8000/api';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:8000/api';
    }
    return 'http://127.0.0.1:8000/api';
  }

  // Endpoints
  static const String loginEndpoint = '/login';
  static const String registerEndpoint = '/register';
  static const String logoutEndpoint = '/logout';
  static const String meEndpoint = '/me';
  static const String chordsEndpoint = '/chords';

  // SharedPreferences Key
  static const String tokenKey = 'auth_token';
  static const String userKey = 'auth_user';
}
