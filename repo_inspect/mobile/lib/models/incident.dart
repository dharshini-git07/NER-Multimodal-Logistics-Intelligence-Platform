class IncidentReport {
  final String? id;
  final String category;
  final String severity;
  final String locationName;
  final double latitude;
  final double longitude;
  final String description;
  final String reportedBy;
  final String reporterRole;
  final String? photoUrl;

  IncidentReport({
    this.id,
    required this.category,
    required this.severity,
    required this.locationName,
    required this.latitude,
    required this.longitude,
    required this.description,
    required this.reportedBy,
    required this.reporterRole,
    this.photoUrl,
  });

  Map<String, dynamic> toJson() => {
    'category': category,
    'severity': severity,
    'location_name': locationName,
    'latitude': latitude,
    'longitude': longitude,
    'description': description,
    'reported_by': reportedBy,
    'reporter_role': reporterRole,
    'photo_url': photoUrl,
  };
}
