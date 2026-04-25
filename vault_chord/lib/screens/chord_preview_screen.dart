import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/chord_provider.dart';
import '../models/chord_model.dart';
import '../widgets/app_background.dart';

class ChordPreviewScreen extends StatefulWidget {
  const ChordPreviewScreen({super.key});

  @override
  State<ChordPreviewScreen> createState() => _ChordPreviewScreenState();
}

class _ChordPreviewScreenState extends State<ChordPreviewScreen> {
  final _scrollController = ScrollController();
  bool _isScrolling = false;
  double _scrollSpeed = 2.0;
  double _fontSize = 16.0;
  Timer? _timer;
  Chord? _chord;
  bool _isLoading = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is int && _chord == null) {
      _loadChord(args);
    }
  }

  Future<void> _loadChord(int id) async {
    final chord = await context.read<ChordProvider>().getChord(id);
    if (mounted) {
      setState(() {
        _chord = chord;
        _isLoading = false;
      });
    }
  }

  void _toggleAutoScroll() {
    setState(() {
      _isScrolling = !_isScrolling;
      if (_isScrolling) {
        _startScrolling();
      } else {
        _timer?.cancel();
      }
    });
  }

  void _startScrolling() {
    _timer?.cancel();
    _timer = Timer.periodic(Duration(milliseconds: (100 / _scrollSpeed).round()), (timer) {
      if (_scrollController.hasClients) {
        final maxScroll = _scrollController.position.maxScrollExtent;
        final currentScroll = _scrollController.offset;
        
        if (currentScroll >= maxScroll) {
          _toggleAutoScroll();
        } else {
          _scrollController.jumpTo(currentScroll + 1);
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _scrollController.dispose();
    super.dispose();
  }

  List<TextSpan> _formatContent(String text) {
    final List<TextSpan> spans = [];
    final regex = RegExp(r'(\[[^\]]+\])');
    final matches = regex.allMatches(text);
    
    int lastMatchEnd = 0;
    for (final match in matches) {
      if (match.start > lastMatchEnd) {
        spans.add(TextSpan(text: text.substring(lastMatchEnd, match.start)));
      }
      spans.add(TextSpan(
        text: text.substring(match.start + 1, match.end - 1),
        style: const TextStyle(
          color: Colors.yellowAccent,
          fontWeight: FontWeight.bold,
          backgroundColor: Colors.white10,
        ),
      ));
      lastMatchEnd = match.end;
    }
    if (lastMatchEnd < text.length) {
      spans.add(TextSpan(text: text.substring(lastMatchEnd)));
    }
    return spans;
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const AppBackground(child: Center(child: CircularProgressIndicator()));
    }

    if (_chord == null) {
      return const AppBackground(child: Center(child: Text('Chord not found')));
    }

    return AppBackground(
      child: Scaffold(
        appBar: AppBar(
          title: Text(_chord!.title),
          actions: [
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () => Navigator.pushNamed(context, '/chords/edit', arguments: _chord!.id),
            ),
          ],
        ),
        body: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                controller: _scrollController,
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _chord!.artist,
                      style: const TextStyle(fontSize: 24, color: Colors.indigoAccent, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    RichText(
                      text: TextSpan(
                        style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: _fontSize,
                          height: 1.8,
                          color: Colors.white,
                        ),
                        children: _formatContent(_chord!.chordsLyrics),
                      ),
                    ),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
            _buildControlDock(),
          ],
        ),
      ),
    );
  }

  Widget _buildControlDock() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.8),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              const Icon(Icons.speed, color: Colors.indigoAccent, size: 20),
              Expanded(
                child: Slider(
                  value: _scrollSpeed,
                  min: 1,
                  max: 10,
                  onChanged: (val) {
                    setState(() => _scrollSpeed = val);
                    if (_isScrolling) _startScrolling();
                  },
                ),
              ),
              const SizedBox(width: 10),
              _buildFontSizeButton(Icons.remove, () => setState(() => _fontSize = (_fontSize > 10) ? _fontSize - 2 : _fontSize)),
              const SizedBox(width: 5),
              _buildFontSizeButton(Icons.add, () => setState(() => _fontSize = (_fontSize < 30) ? _fontSize + 2 : _fontSize)),
            ],
          ),
          const SizedBox(height: 10),
          ElevatedButton.icon(
            onPressed: _toggleAutoScroll,
            icon: Icon(_isScrolling ? Icons.stop : Icons.play_arrow),
            label: Text(_isScrolling ? 'STOP' : 'SCROLL'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _isScrolling ? Colors.redAccent.withOpacity(0.2) : Colors.indigoAccent,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFontSizeButton(IconData icon, VoidCallback onPressed) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
      ),
      child: IconButton(
        icon: Icon(icon, size: 18),
        onPressed: onPressed,
        constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
        padding: EdgeInsets.zero,
      ),
    );
  }
}
