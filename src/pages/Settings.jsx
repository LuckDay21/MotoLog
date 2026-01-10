import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMotoLog } from "../context/MotoLogContext";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
} from "lucide-react";
import { getMotorTemplate } from "../data/motorTemplates";

export default function Settings() {
  const navigate = useNavigate();
  const { motors, selectedMotorId, updateMultipleComponentIntervals } =
    useMotoLog();
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [editedIntervals, setEditedIntervals] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Get selected motor
  useEffect(() => {
    if (selectedMotorId && motors.length > 0) {
      const motor = motors.find((m) => m.id === selectedMotorId);
      setSelectedMotor(motor);

      // Initialize edited intervals with current values
      if (motor) {
        const intervals = {};
        motor.components.forEach((comp) => {
          intervals[comp.id] = comp.customInterval;
        });
        setEditedIntervals(intervals);
      }
    }
  }, [selectedMotorId, motors]);

  // Handle interval change
  const handleIntervalChange = (componentId, value) => {
    const numValue = parseInt(value) || 0;
    setEditedIntervals((prev) => ({
      ...prev,
      [componentId]: numValue,
    }));
    setHasChanges(true);
  };

  // Reset to default template intervals
  const resetToDefault = (componentId) => {
    if (!selectedMotor) return;

    const template = getMotorTemplate(selectedMotor.brand, selectedMotor.model);
    const defaultComponent = template.components.find(
      (c) => c.id === componentId
    );

    if (defaultComponent) {
      setEditedIntervals((prev) => ({
        ...prev,
        [componentId]: defaultComponent.interval,
      }));
      setHasChanges(true);
    }
  };

  // Reset all to default
  const resetAllToDefault = () => {
    if (!selectedMotor) return;

    const template = getMotorTemplate(selectedMotor.brand, selectedMotor.model);
    const intervals = {};

    template.components.forEach((comp) => {
      intervals[comp.id] = comp.interval;
    });

    setEditedIntervals(intervals);
    setHasChanges(true);
  };

  // Save changes
  const handleSave = () => {
    if (!selectedMotor || !hasChanges) return;

    // Collect only changed intervals
    const changedIntervals = {};
    Object.entries(editedIntervals).forEach(([componentId, interval]) => {
      const currentComponent = selectedMotor.components.find(
        (c) => c.id === componentId
      );

      // Only include if interval has changed
      if (currentComponent && currentComponent.customInterval !== interval) {
        changedIntervals[componentId] = interval;
      }
    });

    // Update all changed intervals in one operation
    if (Object.keys(changedIntervals).length > 0) {
      updateMultipleComponentIntervals(selectedMotor.id, changedIntervals);
      setHasChanges(false);
      alert("✅ Interval servis berhasil diperbarui!");
    }
  };

  // Get default interval from template
  const getDefaultInterval = (componentId) => {
    if (!selectedMotor) return 0;

    const template = getMotorTemplate(selectedMotor.brand, selectedMotor.model);
    const defaultComponent = template.components.find(
      (c) => c.id === componentId
    );

    return defaultComponent ? defaultComponent.interval : 0;
  };

  if (!selectedMotor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tidak Ada Motor Dipilih
            </h2>
            <p className="text-gray-600 mb-6">
              Silakan pilih motor terlebih dahulu dari dashboard
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <SettingsIcon className="w-8 h-8 mr-3" />
                Pengaturan Interval Servis
              </h1>
            </div>
            <button
              onClick={resetAllToDefault}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Semua ke Default
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ℹ️ Cara Menggunakan
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Ubah nilai interval sesuai kebutuhan Anda (dalam kilometer)
            </li>
            <li>
              • Klik tombol "Reset" untuk mengembalikan ke nilai default
              template
            </li>
            <li>• Klik "Simpan Perubahan" untuk menyimpan pengaturan baru</li>
            <li>
              • Interval yang diubah akan memengaruhi perhitungan servis
              berikutnya
            </li>
          </ul>
        </div>

        {/* Components List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Komponen
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default Template
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interval Saat Ini
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedMotor.components.map((component) => {
                  const defaultInterval = getDefaultInterval(component.id);
                  const currentInterval =
                    editedIntervals[component.id] || component.customInterval;
                  const isModified = defaultInterval !== currentInterval;

                  return (
                    <tr key={component.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {component.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-600">
                          {defaultInterval.toLocaleString()} km
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={currentInterval}
                            onChange={(e) =>
                              handleIntervalChange(component.id, e.target.value)
                            }
                            className={`w-32 px-3 py-2 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isModified
                                ? "border-orange-400 bg-orange-50"
                                : "border-gray-300"
                            }`}
                            min="100"
                            step="100"
                          />
                          <span className="ml-2 text-sm text-gray-600">km</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => resetToDefault(component.id)}
                          disabled={!isModified}
                          className="inline-flex items-center px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg transform hover:scale-105 transition-all"
            >
              <Save className="w-5 h-5 mr-2" />
              Simpan Perubahan
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            💡 Tip: Sesuaikan interval berdasarkan kondisi pemakaian dan
            rekomendasi mekanik Anda
          </p>
        </div>
      </div>
    </div>
  );
}
