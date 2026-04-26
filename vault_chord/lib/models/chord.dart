// lib/models/chord.dart
class Chord {
  final int id;
  final String title;
  final String artist;
  final String chordsLyrics;
  final int? userId;
  final String? createdAt;
  final String? updatedAt;

  Chord({
    required this.id,
    required this.title,
    required this.artist,
    required this.chordsLyrics,
    this.userId,
    this.createdAt,
    this.updatedAt,
  });

  factory Chord.fromJson(Map<String, dynamic> json) {
    return Chord(
      id: json['id'] as int,
      title: json['title'] as String,
      artist: json['artist'] as String,
      chordsLyrics: json['chords_lyrics'] as String? ?? '',
      userId: json['user_id'] as int?,
      createdAt: json['created_at'] as String?,
      updatedAt: json['updated_at'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'artist': artist,
      'chords_lyrics': chordsLyrics,
    };
  }

  Chord copyWith({
    int? id,
    String? title,
    String? artist,
    String? chordsLyrics,
    int? userId,
    String? createdAt,
    String? updatedAt,
  }) {
    return Chord(
      id: id ?? this.id,
      title: title ?? this.title,
      artist: artist ?? this.artist,
      chordsLyrics: chordsLyrics ?? this.chordsLyrics,
      userId: userId ?? this.userId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
