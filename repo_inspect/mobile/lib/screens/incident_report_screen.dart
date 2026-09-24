import 'package:flutter/material.dart';
import '../models/incident.dart';
import '../services/api_service.dart';

class IncidentReportScreen extends StatefulWidget {
  const IncidentReportScreen({Key? key}) : super(key: key);

  @override
  State<IncidentReportScreen> createState() => _IncidentReportScreenState();
}

class _IncidentReportScreenState extends State<IncidentReportScreen> {
  final _formKey = GlobalKey<FormState>();
  String category = 'Landslide';
  String severity = 'CRITICAL_CUTOFF';
  String location = 'Sonapur Tunnel Portal, NH-6';
  double lat = 25.1328;
  double lng = 92.3582;
  String description = 'Heavy fractured shale boulders blocking both lanes after continuous rainfall.';
  bool isSubmitting = false;

  void submitReport() async {
    if (_formKey.currentState!.validate()) {
      setState(() => isSubmitting = true);

      final report = IncidentReport(
        category: category,
        severity: severity,
        locationName: location,
        latitude: lat,
        longitude: lng,
        description: description,
        reportedBy: 'Driver Ramen Boro (AS-01-GC-4482)',
        reporterRole: 'Truck Driver',
        photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      );

      final success = await ApiService.submitIncident(report);

      setState(() => isSubmitting = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.green,
            content: Text('Incident reported successfully! BRO patrol notified.'),
          ),
        );
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B132B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1C2541),
        title: const Text('Geo-Tagged Incident Report', style: TextStyle(color: Colors.white, fontSize: 16)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category
              const Text('Disruption Category', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: category,
                dropdownColor: const Color(0xFF1E293B),
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                items: ['Landslide', 'Mudslide', 'Bridge Washout', 'Road Subsidence', 'Waterlogging']
                    .map((cat) => DropdownMenuItem(value: cat, child: Text(cat)))
                    .toList(),
                onChanged: (val) => setState(() => category = val!),
              ),
              const SizedBox(height: 16),

              // Severity
              const Text('Impact Severity', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: severity,
                dropdownColor: const Color(0xFF1E293B),
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                items: [
                  {'val': 'CRITICAL_CUTOFF', 'label': 'Critical (Highway Cut Off)'},
                  {'val': 'SEVERE', 'label': 'Severe (Single Lane Stoppage)'},
                  {'val': 'MEDIUM', 'label': 'Medium (Slow Movement)'},
                ]
                    .map((item) => DropdownMenuItem(value: item['val'], child: Text(item['label']!)))
                    .toList(),
                onChanged: (val) => setState(() => severity = val!),
              ),
              const SizedBox(height: 16),

              // Location
              const Text('Location / Highway Mile', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 6),
              TextFormField(
                initialValue: location,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.location_on, color: Colors.cyanAccent),
                ),
                onChanged: (val) => location = val,
              ),
              const SizedBox(height: 16),

              // GPS Coordinates
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Latitude', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text('$lat', style: const TextStyle(color: Colors.cyanAccent, fontFamily: 'monospace')),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Longitude', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text('$lng', style: const TextStyle(color: Colors.cyanAccent, fontFamily: 'monospace')),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Description
              const Text('Field Description', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 6),
              TextFormField(
                initialValue: description,
                maxLines: 3,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onChanged: (val) => description = val,
              ),
              const SizedBox(height: 24),

              // Submit Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: isSubmitting ? null : submitReport,
                  child: Text(
                    isSubmitting ? 'Transmitting Geo-Tag...' : 'Submit Incident to BRO Dispatch',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
