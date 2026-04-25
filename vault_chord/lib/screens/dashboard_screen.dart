import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/auth_provider.dart';
import '../providers/chord_provider.dart';
import '../widgets/app_background.dart';
import '../models/chord_model.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<ChordProvider>().fetchChords());
  }

  @override
  Widget build(BuildContext context) {
    final chordProvider = context.watch<ChordProvider>();
    final authProvider = context.read<AuthProvider>();

    return AppBackground(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hello, ${authProvider.user?.name ?? "User"}',
                      style: const TextStyle(color: Colors.white70, fontSize: 16),
                    ),
                    const Text(
                      'My Saved Chords',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () async {
                    await authProvider.logout();
                    if (mounted) Navigator.pushReplacementNamed(context, '/login');
                  },
                  icon: const Icon(Icons.logout, color: Colors.redAccent),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Expanded(
              child: chordProvider.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : chordProvider.chords.isEmpty
                      ? _buildEmptyState()
                      : _buildChordGrid(chordProvider.chords),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.music_note, size: 80, color: Colors.white.withOpacity(0.1)),
          const SizedBox(height: 16),
          const Text(
            'No chords saved yet.',
            style: TextStyle(color: Colors.white38, fontSize: 18),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/chords/create'),
            style: ElevatedButton.styleFrom(minimumSize: const Size(200, 50)),
            child: const Text('Add First Chord'),
          ),
        ],
      ),
    );
  }

  Widget _buildChordGrid(List<Chord> chords) {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.85,
      ),
      itemCount: chords.length,
      itemBuilder: (context, index) {
        final chord = chords[index];
        return _buildChordCard(chord, index);
      },
    );
  }

  Widget _buildChordCard(Chord chord, int index) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, '/chords/preview', arguments: chord.id),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              chord.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              chord.artist,
              style: const TextStyle(color: Colors.indigoAccent, fontSize: 14),
            ),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  onPressed: () => Navigator.pushNamed(context, '/chords/edit', arguments: chord.id),
                  icon: const Icon(Icons.edit, size: 20, color: Colors.white54),
                ),
                IconButton(
                  onPressed: () => _handleDelete(chord.id),
                  icon: const Icon(Icons.delete, size: 20, color: Colors.redAccent),
                ),
              ],
            )
          ],
        ),
      ).animate().fadeIn(delay: (100 * index).ms).moveY(begin: 20, end: 0),
    );
  }

  Future<void> _handleDelete(int id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Chord'),
        content: const Text('Are you sure you want to delete this masterpiece?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await context.read<ChordProvider>().deleteChord(id);
    }
  }
}
