// lib/screens/chord_preview_screen.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';
import '../models/chord.dart';
import '../providers/chord_provider.dart';

class ChordPreviewScreen extends StatefulWidget {
  const ChordPreviewScreen({super.key});

  @override
  State<ChordPreviewScreen> createState() => _ChordPreviewScreenState();
}

class _ChordPreviewScreenState extends State<ChordPreviewScreen> {
  Chord? _chord;
  bool _loading = true;
  String? _error;

  // Controls
  bool _isScrolling = false;
  double _scrollSpeed = 2.0;
  double _fontSize = 16.0;
  double _scrollProgress = 0.0;

  final ScrollController _scrollController = ScrollController();
  Timer? _scrollTimer;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);

    // Enter immersive mode for better reading experience
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarBrightness: Brightness.dark,
        statusBarColor: Colors.transparent,
      ),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_chord == null && _loading) {
      final args = ModalRoute.of(context)?.settings.arguments;
      if (args is int) {
        _loadChord(args);
      }
    }
  }

  Future<void> _loadChord(int id) async {
    final chord = await context.read<ChordProvider>().getChord(id);
    if (mounted) {
      setState(() {
        _chord = chord;
        _error = chord == null ? 'Gagal memuat chord' : null;
        _loading = false;
      });
    }
  }

  void _onScroll() {
    if (_scrollController.hasClients) {
      final max = _scrollController.position.maxScrollExtent;
      if (max > 0) {
        final progress = _scrollController.offset / max;
        setState(() => _scrollProgress = progress.clamp(0.0, 1.0));
      }
      // Stop auto-scroll at bottom
      if (_scrollController.offset >=
          _scrollController.position.maxScrollExtent - 1) {
        _stopScroll();
      }
    }
  }

  void _startScroll() {
    setState(() => _isScrolling = true);
    _scrollTimer = Timer.periodic(const Duration(milliseconds: 16), (_) {
      if (_scrollController.hasClients && _isScrolling) {
        final newOffset =
            _scrollController.offset + (_scrollSpeed * 0.5);
        if (newOffset >= _scrollController.position.maxScrollExtent) {
          _stopScroll();
        } else {
          _scrollController.jumpTo(newOffset);
        }
      }
    });
  }

  void _stopScroll() {
    _scrollTimer?.cancel();
    if (mounted) setState(() => _isScrolling = false);
  }

  void _toggleScroll() {
    if (_isScrolling) {
      _stopScroll();
    } else {
      _startScroll();
    }
  }

  @override
  void dispose() {
    _scrollTimer?.cancel();
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  /// Parse teks dan highlight chord [C], [Am7] dll.
  List<InlineSpan> _buildRichText(String text) {
    final spans = <InlineSpan>[];
    final regex = RegExp(r'\[([^\]]+)\]');
    int lastEnd = 0;

    for (final match in regex.allMatches(text)) {
      // Text before chord
      if (match.start > lastEnd) {
        spans.add(TextSpan(
          text: text.substring(lastEnd, match.start),
          style: GoogleFonts.sourceCodePro(
            color: AppTheme.textPrimary,
            fontSize: _fontSize,
            height: 1.9,
          ),
        ));
      }
      // Chord highlight
      spans.add(WidgetSpan(
        alignment: PlaceholderAlignment.middle,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 2),
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
          decoration: BoxDecoration(
            color: AppTheme.accent.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(
                color: AppTheme.accent.withValues(alpha: 0.3), width: 1),
          ),
          child: Text(
            match.group(1)!,
            style: GoogleFonts.sourceCodePro(
              color: AppTheme.accent,
              fontWeight: FontWeight.w700,
              fontSize: _fontSize - 1,
            ),
          ),
        ),
      ));
      lastEnd = match.end;
    }

    if (lastEnd < text.length) {
      spans.add(TextSpan(
        text: text.substring(lastEnd),
        style: GoogleFonts.sourceCodePro(
          color: AppTheme.textPrimary,
          fontSize: _fontSize,
          height: 1.9,
        ),
      ));
    }

    return spans;
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: AppTheme.bgDark,
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                  color: AppTheme.primary, strokeWidth: 2.5),
              SizedBox(height: 16),
              Text(
                'Membuka vault...',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
              ),
            ],
          ),
        ),
      );
    }

    if (_error != null) {
      return Scaffold(
        backgroundColor: AppTheme.bgDark,
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded,
                  color: AppTheme.errorColor, size: 48),
              const SizedBox(height: 16),
              Text(
                _error!,
                style: GoogleFonts.outfit(
                    color: AppTheme.textSecondary, fontSize: 15),
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text(
                  'Kembali',
                  style: GoogleFonts.outfit(color: AppTheme.primary),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final chord = _chord!;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: Stack(
        children: [
          // Background decorative
          Positioned(
            top: -100,
            left: -80,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  AppTheme.primary.withValues(alpha: 0.08),
                  Colors.transparent,
                ]),
              ),
            ),
          ),

          // Main content
          SafeArea(
            bottom: false,
            child: Column(
              children: [
                // Top App Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 8, 16, 0),
                  child: Row(
                    children: [
                      IconButton(
                        onPressed: () => Navigator.of(context).pop(),
                        icon: const Icon(
                          Icons.arrow_back_ios_new_rounded,
                          color: AppTheme.textSecondary,
                          size: 20,
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              chord.title,
                              style: GoogleFonts.outfit(
                                color: AppTheme.textPrimary,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              chord.artist,
                              style: GoogleFonts.outfit(
                                color: AppTheme.primary,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () {
                          Navigator.of(context).pushReplacementNamed(
                            '/chords/edit',
                            arguments: chord.id,
                          );
                        },
                        tooltip: 'Edit',
                        icon: const Icon(
                          Icons.edit_outlined,
                          color: AppTheme.textSecondary,
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                ),

                // Progress bar
                LinearProgressIndicator(
                  value: _scrollProgress,
                  backgroundColor: Colors.white.withValues(alpha: 0.05),
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    AppTheme.primary,
                  ),
                  minHeight: 2,
                ),

                // Chord content
                Expanded(
                  child: SingleChildScrollView(
                    controller: _scrollController,
                    padding: const EdgeInsets.fromLTRB(20, 24, 20, 160),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Song header
                        Text(
                          chord.title,
                          style: GoogleFonts.outfit(
                            color: AppTheme.textPrimary,
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.5,
                            height: 1.1,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          chord.artist,
                          style: GoogleFonts.outfit(
                            color: AppTheme.primary,
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),

                        const SizedBox(height: 24),

                        // Chord separator line
                        Container(
                          height: 1,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                AppTheme.primary.withValues(alpha: 0.5),
                                Colors.transparent,
                              ],
                            ),
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Chord Lyrics with highlighted chords
                        RichText(
                          text: TextSpan(
                            children: _buildRichText(chord.chordsLyrics),
                          ),
                        ),

                        const SizedBox(height: 40),

                        // Footer
                        Center(
                          child: Text(
                            'Rock On! 🤘',
                            style: GoogleFonts.outfit(
                              color: AppTheme.textMuted,
                              fontSize: 12,
                              letterSpacing: 3,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Bottom control dock
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    AppTheme.bgDark.withValues(alpha: 0.95),
                  ],
                ),
              ),
              padding: EdgeInsets.fromLTRB(
                20,
                20,
                20,
                MediaQuery.of(context).padding.bottom + 16,
              ),
              child: Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A).withValues(alpha: 0.95),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                      color: Colors.white.withValues(alpha: 0.1)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.4),
                      blurRadius: 24,
                      spreadRadius: 0,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    // Font decrease
                    _ControlBtn(
                      child: Text(
                        'A-',
                        style: GoogleFonts.outfit(
                            color: AppTheme.textSecondary, fontSize: 13),
                      ),
                      onTap: () => setState(
                          () => _fontSize = (_fontSize - 2).clamp(10, 36)),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '${_fontSize.toInt()}',
                      style: GoogleFonts.outfit(
                        color: AppTheme.textMuted,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 6),
                    // Font increase
                    _ControlBtn(
                      child: Text(
                        'A+',
                        style: GoogleFonts.outfit(
                          color: AppTheme.textSecondary,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      onTap: () => setState(
                          () => _fontSize = (_fontSize + 2).clamp(10, 36)),
                    ),

                    const Spacer(),

                    // Speed label
                    const Icon(Icons.speed_rounded,
                        color: AppTheme.textMuted, size: 14),
                    const SizedBox(width: 6),

                    // Speed slider
                    SizedBox(
                      width: 80,
                      child: SliderTheme(
                        data: SliderTheme.of(context).copyWith(
                          trackHeight: 2,
                          thumbShape: const RoundSliderThumbShape(
                              enabledThumbRadius: 6),
                          overlayShape: const RoundSliderOverlayShape(
                              overlayRadius: 12),
                          activeTrackColor: AppTheme.primary,
                          inactiveTrackColor:
                              Colors.white.withValues(alpha: 0.1),
                          thumbColor: AppTheme.primary,
                          overlayColor:
                              AppTheme.primary.withValues(alpha: 0.2),
                        ),
                        child: Slider(
                          value: _scrollSpeed,
                          min: 1,
                          max: 10,
                          onChanged: (v) =>
                              setState(() => _scrollSpeed = v),
                        ),
                      ),
                    ),

                    const Spacer(),

                    // Scroll toggle button
                    GestureDetector(
                      onTap: _toggleScroll,
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          gradient: _isScrolling
                              ? null
                              : const LinearGradient(
                                  colors: [
                                    AppTheme.primary,
                                    AppTheme.secondary
                                  ],
                                ),
                          color: _isScrolling
                              ? const Color(0x33EF4444)
                              : null,
                          borderRadius: BorderRadius.circular(14),
                          border: _isScrolling
                              ? Border.all(
                                  color: const Color(0x4DEF4444))
                              : null,
                          boxShadow: _isScrolling
                              ? []
                              : [
                                  BoxShadow(
                                    color: AppTheme.primary
                                        .withValues(alpha: 0.35),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _isScrolling
                                  ? Icons.stop_rounded
                                  : Icons.play_arrow_rounded,
                              color: _isScrolling
                                  ? const Color(0xFFF87171)
                                  : Colors.white,
                              size: 16,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _isScrolling ? 'Stop' : 'Scroll',
                              style: GoogleFonts.outfit(
                                color: _isScrolling
                                    ? const Color(0xFFF87171)
                                    : Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ControlBtn extends StatelessWidget {
  final Widget child;
  final VoidCallback onTap;
  const _ControlBtn({required this.child, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.07),
          borderRadius: BorderRadius.circular(10),
        ),
        alignment: Alignment.center,
        child: child,
      ),
    );
  }
}
