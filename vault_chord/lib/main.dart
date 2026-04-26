// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'core/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/chord_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/chord_form_screen.dart';
import 'screens/chord_preview_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Paksa portrait mode
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Status bar transparan
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const VaultChordApp());
}

class VaultChordApp extends StatelessWidget {
  const VaultChordApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ChordProvider()),
      ],
      child: MaterialApp(
        title: 'Vault Chord',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark,
        initialRoute: '/',
        onGenerateRoute: _onGenerateRoute,
        navigatorObservers: [_RouteObserver()],
      ),
    );
  }

  Route<dynamic>? _onGenerateRoute(RouteSettings settings) {
    Widget page;

    switch (settings.name) {
      case '/':
        page = const SplashScreen();
        break;
      case '/login':
        page = const LoginScreen();
        break;
      case '/register':
        page = const RegisterScreen();
        break;
      case '/dashboard':
        page = const DashboardScreen();
        break;
      case '/chords/create':
        page = const ChordFormScreen();
        break;
      case '/chords/edit':
        page = const ChordFormScreen();
        break;
      case '/chords/detail':
        page = const ChordPreviewScreen();
        break;
      default:
        // 404
        page = const Scaffold(
          backgroundColor: AppTheme.bgDark,
          body: Center(
            child: Text(
              'Halaman tidak ditemukan',
              style: TextStyle(color: AppTheme.textSecondary),
            ),
          ),
        );
    }

    return PageRouteBuilder(
      settings: settings,
      pageBuilder: (_, __, ___) => page,
      transitionsBuilder: (ctx, animation, secondaryAnimation, child) {
        const begin = Offset(0.0, 0.04);
        const end = Offset.zero;
        const curve = Curves.easeOutCubic;

        final tween = Tween(begin: begin, end: end).chain(
          CurveTween(curve: curve),
        );
        final fadeTween = Tween<double>(begin: 0.0, end: 1.0).chain(
          CurveTween(curve: curve),
        );

        return FadeTransition(
          opacity: animation.drive(fadeTween),
          child: SlideTransition(
            position: animation.drive(tween),
            child: child,
          ),
        );
      },
      transitionDuration: const Duration(milliseconds: 280),
    );
  }
}

/// Observer untuk reset scroll saat navigasi (opsional)
class _RouteObserver extends NavigatorObserver {}
