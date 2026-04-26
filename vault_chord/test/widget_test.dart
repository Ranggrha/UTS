// test/widget_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:vault_chord/main.dart';

void main() {
  testWidgets('VaultChordApp smoke test', (WidgetTester tester) async {
    // Build the app and verify it renders without crashing
    await tester.pumpWidget(const VaultChordApp());
    expect(find.byType(VaultChordApp), findsOneWidget);
  });
}
