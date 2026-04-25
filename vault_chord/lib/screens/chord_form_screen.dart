import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/chord_provider.dart';
import '../models/chord_model.dart';
import '../widgets/app_background.dart';

class ChordFormScreen extends StatefulWidget {
  const ChordFormScreen({super.key});

  @override
  State<ChordFormScreen> createState() => _ChordFormScreenState();
}

class _ChordFormScreenState extends State<ChordFormScreen> {
  final _titleController = TextEditingController();
  final _artistController = TextEditingController();
  final _contentController = TextEditingController();
  int? _chordId;
  bool _isLoading = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is int && _chordId == null) {
      _chordId = args;
      _loadChord();
    }
  }

  Future<void> _loadChord() async {
    setState(() => _isLoading = true);
    final chord = await context.read<ChordProvider>().getChord(_chordId!);
    if (chord != null) {
      _titleController.text = chord.title;
      _artistController.text = chord.artist;
      _contentController.text = chord.chordsLyrics;
    }
    setState(() => _isLoading = false);
  }

  Future<void> _saveChord() async {
    final chord = Chord(
      id: _chordId ?? 0,
      title: _titleController.text,
      artist: _artistController.text,
      chordsLyrics: _contentController.text,
    );

    bool success;
    if (_chordId == null) {
      success = await context.read<ChordProvider>().addChord(chord);
    } else {
      success = await context.read<ChordProvider>().updateChord(_chordId!, chord);
    }

    if (mounted) {
      if (success) {
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to save chord')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppBackground(
      child: Scaffold(
        appBar: AppBar(
          title: Text(_chordId == null ? 'New Chord' : 'Edit Chord'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: _isLoading 
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  TextField(
                    controller: _titleController,
                    decoration: const InputDecoration(labelText: 'Song Title'),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _artistController,
                    decoration: const InputDecoration(labelText: 'Artist Name'),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _contentController,
                    maxLines: 15,
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
                    decoration: const InputDecoration(
                      labelText: 'Chords & Lyrics',
                      hintText: '[C] Example [G] Lyrics',
                      alignLabelWithHint: true,
                    ),
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: _saveChord,
                    child: Text(_chordId == null ? 'Save to Vault' : 'Update Chord'),
                  ),
                ],
              ),
            ),
      ),
    );
  }
}
