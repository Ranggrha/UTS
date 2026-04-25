class Chord {
  final int id;
  final String title;
  final String artist;
  final String chordsLyrics;

  Chord({
    required this.id,
    required this.title,
    required this.artist,
    required this.chordsLyrics,
  });

  factory Chord.fromJson(Map<String, dynamic> json) {
    return Chord(
      id: json['id'],
      title: json['title'],
      artist: json['artist'],
      chordsLyrics: json['chords_lyrics'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'artist': artist,
      'chords_lyrics': chordsLyrics,
    };
  }
}
