import 'package:flutter/material.dart';
import '../models/chord_model.dart';
import '../services/api_service.dart';

class ChordProvider with ChangeNotifier {
  List<Chord> _chords = [];
  bool _isLoading = false;
  final ApiService _apiService = ApiService();

  List<Chord> get chords => _chords;
  bool get isLoading => _isLoading;

  Future<void> fetchChords() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.dio.get('/chords');
      final List data = response.data['data'];
      _chords = data.map((json) => Chord.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching chords: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Chord?> getChord(int id) async {
    try {
      final response = await _apiService.dio.get('/chords/$id');
      return Chord.fromJson(response.data['data']);
    } catch (e) {
      return null;
    }
  }

  Future<bool> addChord(Chord chord) async {
    try {
      await _apiService.dio.post('/chords', data: chord.toJson());
      await fetchChords();
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateChord(int id, Chord chord) async {
    try {
      await _apiService.dio.put('/chords/$id', data: chord.toJson());
      await fetchChords();
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> deleteChord(int id) async {
    try {
      await _apiService.dio.delete('/chords/$id');
      _chords.removeWhere((c) => c.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      return false;
    }
  }
}
