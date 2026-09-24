import 'package:flutter/material.dart';
import 'screens/driver_home_screen.dart';

void main() {
  runApp(const NERRouteGuardApp());
}

class NERRouteGuardApp extends StatelessWidget {
  const NERRouteGuardApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NER RouteGuard Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.cyan,
        scaffoldBackgroundColor: const Color(0xFF0B132B),
        fontFamily: 'Roboto',
      ),
      home: const DriverHomeScreen(),
    );
  }
}
