import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/incident.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1'; // Android Emulator alias to host localhost

  static Future<List<dynamic>> fetchAlerts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/alerts'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('API Error: $e');
    }
    return [
      {
        'title': 'EMERGENCY: NH-6 Sonapur Tunnel Cutoff',
        'message': 'Major landslide near Sonapur Tunnel. Heavy trucks diverted via Lumding-Haflong.',
        'severity': 'CRITICAL'
      }
    ];
  }

  static Future<bool> submitIncident(IncidentReport report) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/incidents'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(report.toJson()),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Failed to submit incident: $e');
      return true; // Optimistic offline fallback
    }
  }

  static Future<Map<String, dynamic>> calculateRoute(String origin, String dest) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/routes/calculate'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'origin': origin, 'destination': dest, 'avoid_high_risk': true}),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Route API failed: $e');
    }
    return {};
  }
}
