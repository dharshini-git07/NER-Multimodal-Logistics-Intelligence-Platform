# NER RouteGuard Mobile App Prototype
**SIH 2026 Problem Statement 26002: Field Driver & BRO Sentinel Companion**

## Overview
This Flutter application provides an offline-first, high-contrast mobile interface tailored for:
1. **Commercial Freight & Tanker Drivers**: Alerting them before entering vulnerable landslide or flash flood zones.
2. **BRO (Border Roads Organisation) Field Patrols**: Submitting geo-tagged photos and status updates for road washouts and rockfalls.

## Key Screens
- **Driver Home Dashboard**: Live telemetry, weather hazard warning, and active cutoff alerts.
- **Geo-Tagged Incident Report**: Crowdsourced reporting with GPS coordinates, photo capture, and severity classification.
- **Resilient Bypass Navigation**: Turn-by-turn guidance along safe alternate corridors (e.g., NH-27 Lumding-Haflong bypass instead of blocked NH-6).

## Running the App
Ensure Flutter SDK (3.2.0+) is installed:

```bash
cd mobile
flutter pub get
flutter run
```
