// lib/providers/chord_provider.dart
import 'package:flutter/material.dart';
import '../core/api_client.dart';
import '../core/constants.dart';
import '../models/chord.dart';

class ChordProvider extends ChangeNotifier {
  List<Chord> _chords = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Chord> get chords => List.unmodifiable(_chords);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  /// Ambil semua chord milik user
  Future<void> fetchChords() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.get(AppConstants.chordsEndpoint);
      final data = response['data'] as List<dynamic>;
      _chords = data
          .map((item) => Chord.fromJson(item as Map<String, dynamic>))
          .toList();
    } on ApiException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = 'Gagal memuat chord. Periksa koneksi Anda.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Ambil detail satu chord
  Future<Chord?> getChord(int id) async {
    try {
      final response =
          await ApiClient.get('${AppConstants.chordsEndpoint}/$id');
      return Chord.fromJson(response['data'] as Map<String, dynamic>);
    } on ApiException catch (e) {
      _errorMessage = e.message;
      notifyListeners();
      return null;
    } catch (e) {
      _errorMessage = 'Gagal memuat detail chord.';
      notifyListeners();
      return null;
    }
  }

  /// Tambah chord baru
  Future<bool> addChord({
    required String title,
    required String artist,
    required String chordsLyrics,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.post(
        AppConstants.chordsEndpoint,
        {'title': title, 'artist': artist, 'chords_lyrics': chordsLyrics},
      );
      final newChord =
          Chord.fromJson(response['data'] as Map<String, dynamic>);
      _chords.insert(0, newChord);
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      return false;
    } catch (e) {
      _errorMessage = 'Gagal menyimpan chord.';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Update chord yang sudah ada
  Future<bool> updateChord({
    required int id,
    required String title,
    required String artist,
    required String chordsLyrics,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiClient.put(
        '${AppConstants.chordsEndpoint}/$id',
        {'title': title, 'artist': artist, 'chords_lyrics': chordsLyrics},
      );
      final updated =
          Chord.fromJson(response['data'] as Map<String, dynamic>);
      final index = _chords.indexWhere((c) => c.id == id);
      if (index != -1) {
        _chords[index] = updated;
      }
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      return false;
    } catch (e) {
      _errorMessage = 'Gagal memperbarui chord.';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Hapus chord
  Future<bool> deleteChord(int id) async {
    _errorMessage = null;
    try {
      await ApiClient.delete('${AppConstants.chordsEndpoint}/$id');
      _chords.removeWhere((c) => c.id == id);
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Gagal menghapus chord.';
      notifyListeners();
      return false;
    }
  }

  void clearChords() {
    _chords = [];
    _errorMessage = null;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
