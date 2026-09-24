import 'package:flutter/material.dart';

class SafeRouteNavigationScreen extends StatelessWidget {
  const SafeRouteNavigationScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B132B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1C2541),
        title: const Text('Resilient Bypass Navigation', style: TextStyle(color: Colors.white, fontSize: 16)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Safe Alternate Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF064E3B),
                border: Border.all(color: Colors.emeraldAccent),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                children: [
                  Icon(Icons.check_circle_outline, color: Colors.emeraldAccent, size: 28),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('AI SAFE ALTERNATE ACTIVE', style: TextStyle(color: Colors.emeraldAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                        SizedBox(height: 2),
                        Text('NH-27 Lumding - Haflong Expressway selected. Bypasses Sonapur slide zone completely.', style: TextStyle(color: Colors.white, fontSize: 11)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Route Metrics
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      Text('399 km', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Safe Distance', style: TextStyle(color: Colors.white54, fontSize: 10)),
                    ],
                  ),
                  Column(
                    children: [
                      Text('10h 15m', style: TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Calculated ETA', style: TextStyle(color: Colors.white54, fontSize: 10)),
                    ],
                  ),
                  Column(
                    children: [
                      Text('LOW (0.18)', style: TextStyle(color: Colors.emeraldAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Landslide Risk', style: TextStyle(color: Colors.white54, fontSize: 10)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text('Turn-by-Turn Waypoint Guidance', style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),

            Expanded(
              child: ListView(
                children: [
                  _buildStepTile('Nagaon Bypass Junction', 'Continue onto NH-27 Eastbound. Passable roads, 0 active landslides.', Icons.turn_slight_right, Colors.cyanAccent),
                  _buildStepTile('Lumding Transit Point', 'Fuel depot available. Moderate drizzle, drainage clear.', Icons.straight, Colors.cyanAccent),
                  _buildStepTile('Haflong Hill Section', 'Mountain curves ahead. Maintain 35 km/h. BRO monitoring station active.', Icons.arrow_upward, Colors.amberAccent),
                  _buildStepTile('Silchar Destination Depot', 'Final approach. FCI Warehouses open for priority unloading.', Icons.pin_drop, Colors.emeraldAccent),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepTile(String title, String desc, IconData icon, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 2),
                Text(desc, style: const TextStyle(color: Colors.white70, fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
