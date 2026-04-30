// lib/providers/auth_provider.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api_client.dart';
import '../core/constants.dart';
import '../models/user.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthProvider extends ChangeNotifier {
  AuthStatus _status = AuthStatus.unknown;
  User? _user;
  String? _errorMessage;
  bool _isLoading = false;

  AuthStatus get status => _status;
  User? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _status == AuthStatus.authenticated;

  /// Cek token saat startup
  Future<void> checkAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(AppConstants.tokenKey);

      if (token == null) {
        _status = AuthStatus.unauthenticated;
      } else if (token == 'dummy_token_for_local_testing') {
        _user = User(
          id: 999,
          name: 'Local Test User',
          email: 'local@gmail.com',
        );
        _status = AuthStatus.authenticated;
      } else {
        final response = await ApiClient.get(AppConstants.meEndpoint);
        _user = User.fromJson(response['user'] as Map<String, dynamic>);
        _status = AuthStatus.authenticated;
      }
    } catch (_) {
      // Token invalid atau expired
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(AppConstants.tokenKey);
      _status = AuthStatus.unauthenticated;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Login dengan email & password
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Dummy user for local testing
      if (email == 'local@gmail.com' && password == 'local123') {
        const token = 'dummy_token_for_local_testing';
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.tokenKey, token);

        _user = User(
          id: 999,
          name: 'Local Test User',
          email: 'local@gmail.com',
        );
        _status = AuthStatus.authenticated;
        notifyListeners();
        return true;
      }

      final response = await ApiClient.post(
        AppConstants.loginEndpoint,
        {'email': email, 'password': password},
        withAuth: false,
      );

      final token = response['authorisation']['token'] as String;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.tokenKey, token);

      _user = User.fromJson(response['user'] as Map<String, dynamic>);
      _status = AuthStatus.authenticated;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Gagal terhubung ke server. Periksa koneksi Anda.';
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Register akun baru
  Future<bool> register(
    String name,
    String email,
    String password,
    String passwordConfirmation,
  ) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.post(
        AppConstants.registerEndpoint,
        {
          'name': name,
          'email': email,
          'password': password,
          'password_confirmation': passwordConfirmation,
        },
        withAuth: false,
      );

      final token = response['authorisation']['token'] as String;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.tokenKey, token);

      _user = User.fromJson(response['user'] as Map<String, dynamic>);
      _status = AuthStatus.authenticated;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      // Coba ambil pesan error validasi pertama
      if (e.errors != null) {
        final firstError = e.errors!.values.first;
        if (firstError is List && firstError.isNotEmpty) {
          _errorMessage = firstError.first.toString();
        } else {
          _errorMessage = e.message;
        }
      } else {
        _errorMessage = e.message;
      }
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Gagal terhubung ke server. Periksa koneksi Anda.';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Logout
  Future<void> logout() async {
    try {
      await ApiClient.post(AppConstants.logoutEndpoint, {});
    } catch (_) {
      // Tetap logout meski request gagal
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.tokenKey);
    _user = null;
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
