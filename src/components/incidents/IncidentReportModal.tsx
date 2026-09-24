import React, { useState } from 'react';
import { X, AlertTriangle, MapPin, Camera, User, ShieldCheck, CheckCircle } from 'lucide-react';
import { Incident } from '../../types';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Incident>) => Promise<void>;
  initialCoords?: { lat: number; lng: number } | null;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCoords
}) => {
  const [category, setCategory] = useState<'Landslide' | 'Mudslide' | 'Bridge Washout' | 'Road Subsidence' | 'Waterlogging' | 'Tree Fall'>('Landslide');
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'SEVERE' | 'CRITICAL_CUTOFF'>('CRITICAL_CUTOFF');
  const [locationName, setLocationName] = useState('Sonapur Tunnel North Approach, NH-6');
  const [lat, setLat] = useState(initialCoords?.lat || 25.1328);
  const [lng, setLng] = useState(initialCoords?.lng || 92.3582);
  const [description, setDescription] = useState('Major slope collapse following overnight rainfall. Both lanes obstructed by shale rockfall.');
  const [reportedBy, setReportedBy] = useState('BRO Patrol Unit 42');
  const [reporterRole, setReporterRole] = useState('BRO Officer');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80');
  const [submitting, setSubmitting] = useState(false);

  // Sync coords if clicked on map
  React.useEffect(() => {
    if (initialCoords) {
      setLat(initialCoords.lat);
      setLng(initialCoords.lng);
    }
  }, [initialCoords]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        category,
        severity,
        location_name: locationName,
        latitude: Number(lat),
        longitude: Number(lng),
        description,
        reported_by: reportedBy,
        reporter_role: reporterRole,
        photo_url: photoUrl
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Report Road Hazard / Cutoff</h3>
              <p className="text-xs text-slate-500">Crowdsourced & BRO Field Incident Dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Category & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Incident Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="Landslide">Landslide</option>
                <option value="Mudslide">Mudslide & Debris</option>
                <option value="Bridge Washout">Bridge Washout</option>
                <option value="Road Subsidence">Road Subsidence</option>
                <option value="Waterlogging">Flash Waterlogging</option>
                <option value="Tree Fall">Tree Fall & Boulders</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Impact Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="CRITICAL_CUTOFF">Critical (Total Highway Cutoff)</option>
                <option value="SEVERE">Severe (One-Lane Stoppage)</option>
                <option value="MEDIUM">Medium (Slow Crawl)</option>
                <option value="LOW">Low (Caution Required)</option>
              </select>
            </div>
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Location / Highway Chainage</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Sonapur Tunnel Approach, NH-6"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              required
            />
          </div>

          {/* GPS Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" /> Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" /> Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Situation Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              placeholder="Describe road blockage, estimated debris volume, stranded vehicles..."
            />
          </div>

          {/* Reporter & Verification */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" /> Reporter Name / Unit
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Designation</label>
              <select
                value={reporterRole}
                onChange={(e) => setReporterRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="BRO Officer">BRO Field Officer</option>
                <option value="Traffic Police">State Traffic Police</option>
                <option value="Truck Driver">Commercial Truck Driver</option>
                <option value="Citizen">Local Citizen / Resident</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'Broadcasting to Control Hub...' : 'Publish Geo-Tagged Incident'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
