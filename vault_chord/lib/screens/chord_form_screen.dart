// lib/screens/chord_form_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';
import '../providers/chord_provider.dart';
import '../widgets/glass_text_field.dart';
import '../widgets/gradient_button.dart';

class ChordFormScreen extends StatefulWidget {
  const ChordFormScreen({super.key});

  @override
  State<ChordFormScreen> createState() => _ChordFormScreenState();
}

class _ChordFormScreenState extends State<ChordFormScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _artistController = TextEditingController();
  final _lyricsController = TextEditingController();

  final _titleFocus = FocusNode();
  final _artistFocus = FocusNode();
  final _lyricsFocus = FocusNode();

  late AnimationController _animController;
  late Animation<double> _fadeAnimation;

  int? _editId;
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOut,
    );
    _animController.forward();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_isInitialized) {
      _isInitialized = true;
      final args = ModalRoute.of(context)?.settings.arguments;
      if (args is int) {
        _editId = args;
        _loadChordData(args);
      }
    }
  }

  Future<void> _loadChordData(int id) async {
    final chord = await context.read<ChordProvider>().getChord(id);
    if (chord != null && mounted) {
      setState(() {
        _titleController.text = chord.title;
        _artistController.text = chord.artist;
        _lyricsController.text = chord.chordsLyrics;
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();

    final chordProvider = context.read<ChordProvider>();
    bool success;

    if (_editId != null) {
      success = await chordProvider.updateChord(
        id: _editId!,
        title: _titleController.text.trim(),
        artist: _artistController.text.trim(),
        chordsLyrics: _lyricsController.text,
      );
    } else {
      success = await chordProvider.addChord(
        title: _titleController.text.trim(),
        artist: _artistController.text.trim(),
        chordsLyrics: _lyricsController.text,
      );
    }

    if (!mounted) return;

    if (success) {
      // Refresh list after save
      await chordProvider.fetchChords();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                _editId != null ? 'Chord berhasil diperbarui!' : 'Chord berhasil disimpan!'),
            backgroundColor: const Color(0xFF064E3B),
          ),
        );
        Navigator.of(context).pop();
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(chordProvider.errorMessage ?? 'Gagal menyimpan chord'),
          backgroundColor: const Color(0xFF7F1D1D),
        ),
      );
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    _titleController.dispose();
    _artistController.dispose();
    _lyricsController.dispose();
    _titleFocus.dispose();
    _artistFocus.dispose();
    _lyricsFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = _editId != null;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: Stack(
        children: [
          // Background blob
          Positioned(
            top: -100,
            right: -80,
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  AppTheme.secondary.withValues(alpha: 0.1),
                  Colors.transparent,
                ]),
              ),
            ),
          ),

          SafeArea(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: Column(
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.fromLTRB(8, 12, 20, 0),
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
                          child: Text(
                            isEditing ? '✏️ Edit Chord' : '✨ Tambah Chord',
                            style: GoogleFonts.outfit(
                              color: AppTheme.textPrimary,
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Form
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Info card
                            Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: AppTheme.primary.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: AppTheme.primary.withValues(alpha: 0.2),
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.info_outline_rounded,
                                    color: AppTheme.primary,
                                    size: 16,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      'Gunakan format [C], [Am], [G] untuk menandai chord dalam lirik.',
                                      style: GoogleFonts.outfit(
                                        color: AppTheme.primary,
                                        fontSize: 12,
                                        height: 1.4,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            const SizedBox(height: 20),

                            // Title & Artist row
                            Row(
                              children: [
                                Expanded(
                                  child: GlassTextField(
                                    label: 'Judul Lagu',
                                    hint: 'Bohemian Rhapsody',
                                    controller: _titleController,
                                    focusNode: _titleFocus,
                                    prefixIcon: const Icon(
                                      Icons.music_note_rounded,
                                      color: AppTheme.textMuted,
                                      size: 18,
                                    ),
                                    textInputAction: TextInputAction.next,
                                    onFieldSubmitted: (_) =>
                                        FocusScope.of(context)
                                            .requestFocus(_artistFocus),
                                    validator: (v) {
                                      if (v == null || v.trim().isEmpty) {
                                        return 'Judul wajib diisi';
                                      }
                                      return null;
                                    },
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 14),

                            GlassTextField(
                              label: 'Nama Artis',
                              hint: 'Queen',
                              controller: _artistController,
                              focusNode: _artistFocus,
                              prefixIcon: const Icon(
                                Icons.person_outline_rounded,
                                color: AppTheme.textMuted,
                                size: 18,
                              ),
                              textInputAction: TextInputAction.next,
                              onFieldSubmitted: (_) =>
                                  FocusScope.of(context)
                                      .requestFocus(_lyricsFocus),
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) {
                                  return 'Nama artis wajib diisi';
                                }
                                return null;
                              },
                            ),

                            const SizedBox(height: 14),

                            // Lyrics label
                            Text(
                              'Chord & Lirik',
                              style: GoogleFonts.outfit(
                                color: AppTheme.textSecondary,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 6),

                            // Lyrics textarea
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: TextFormField(
                                controller: _lyricsController,
                                focusNode: _lyricsFocus,
                                maxLines: 14,
                                style: GoogleFonts.sourceCodePro(
                                  color: AppTheme.textPrimary,
                                  fontSize: 13,
                                  height: 1.7,
                                ),
                                decoration: InputDecoration(
                                  hintText:
                                      '[C] Is this the real life?\n[Am] Is this just fantasy?\n[F] Caught in a landslide...',
                                  hintStyle: GoogleFonts.sourceCodePro(
                                    color: AppTheme.textMuted,
                                    fontSize: 12,
                                  ),
                                  filled: true,
                                  fillColor:
                                      Colors.white.withValues(alpha: 0.04),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: BorderSide(
                                        color:
                                            Colors.white.withValues(alpha: 0.15)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: BorderSide(
                                        color:
                                            Colors.white.withValues(alpha: 0.15)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    borderSide: const BorderSide(
                                        color: AppTheme.primary, width: 1.5),
                                  ),
                                  contentPadding: const EdgeInsets.all(14),
                                ),
                                validator: (v) {
                                  if (v == null || v.trim().isEmpty) {
                                    return 'Chord & lirik wajib diisi';
                                  }
                                  return null;
                                },
                              ),
                            ),

                            const SizedBox(height: 28),

                            // Buttons
                            Consumer<ChordProvider>(
                              builder: (_, cp, __) => Column(
                                children: [
                                  GradientButton(
                                    label: isEditing
                                        ? 'Perbarui Chord'
                                        : 'Simpan ke Vault',
                                    isLoading: cp.isLoading,
                                    onPressed: _handleSubmit,
                                    icon: isEditing
                                        ? Icons.save_rounded
                                        : Icons.lock_rounded,
                                  ),
                                  const SizedBox(height: 12),
                                  OutlineButton(
                                    label: 'Batal',
                                    onPressed: () =>
                                        Navigator.of(context).pop(),
                                    icon: Icons.close_rounded,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
