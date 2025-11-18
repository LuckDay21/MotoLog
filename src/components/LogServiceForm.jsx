import { useState } from "react";
import { useMotoLog } from "../context/MotoLogContext";
import { X } from "lucide-react";

export default function LogServiceForm({ onClose, onSuccess }) {
  const { motors, selectedMotorId, addServiceLog, getSelectedMotor } =
    useMotoLog();
  const selectedMotor = getSelectedMotor();

  const [formData, setFormData] = useState({
    motorId: selectedMotorId || "",
    odometerKm: selectedMotor?.currentOdometer || 0,
    serviceDate: new Date().toISOString().split("T")[0],
    servicedComponents: [],
    customComponents: "",
    notes: "",
    cost: "",
  });
  const [errors, setErrors] = useState({});

  const currentMotor = motors.find((m) => m.id === formData.motorId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleComponentToggle = (componentId) => {
    setFormData((prev) => ({
      ...prev,
      servicedComponents: prev.servicedComponents.includes(componentId)
        ? prev.servicedComponents.filter((id) => id !== componentId)
        : [...prev.servicedComponents, componentId],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.motorId) newErrors.motorId = "Pilih motor";
    if (!formData.odometerKm || formData.odometerKm < 0)
      newErrors.odometerKm = "Odometer tidak valid";
    if (!formData.serviceDate)
      newErrors.serviceDate = "Tanggal servis wajib diisi";
    if (
      formData.servicedComponents.length === 0 &&
      !formData.customComponents
    ) {
      newErrors.components = "Pilih minimal satu komponen yang diservis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Parse custom components
    const customComps = formData.customComponents
      ? formData.customComponents
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const logId = addServiceLog({
      motorId: formData.motorId,
      odometerKm: parseInt(formData.odometerKm),
      serviceDate: formData.serviceDate,
      servicedComponents: formData.servicedComponents,
      customComponents: customComps,
      notes: formData.notes,
      cost: formData.cost ? parseFloat(formData.cost) : null,
    });

    if (onSuccess) onSuccess(logId);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Log Servis Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Motor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motor *
            </label>
            <select
              name="motorId"
              value={formData.motorId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.motorId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Motor</option>
              {motors.map((motor) => (
                <option key={motor.id} value={motor.id}>
                  {motor.nickname ||
                    `${motor.brand} ${motor.model} ${motor.year}`}
                </option>
              ))}
            </select>
            {errors.motorId && (
              <p className="text-red-500 text-xs mt-1">{errors.motorId}</p>
            )}
          </div>

          {/* Odometer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Odometer Saat Servis (km) *
            </label>
            <input
              type="number"
              name="odometerKm"
              value={formData.odometerKm}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.odometerKm ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.odometerKm && (
              <p className="text-red-500 text-xs mt-1">{errors.odometerKm}</p>
            )}
          </div>

          {/* Service Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Servis *
            </label>
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.serviceDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.serviceDate && (
              <p className="text-red-500 text-xs mt-1">{errors.serviceDate}</p>
            )}
          </div>

          {/* Components Checklist */}
          {currentMotor && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Komponen yang Diservis *
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                {currentMotor.components.map((comp) => (
                  <label
                    key={comp.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.servicedComponents.includes(comp.id)}
                      onChange={() => handleComponentToggle(comp.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="flex-1">{comp.name}</span>
                    <span className="text-xs text-gray-500">
                      Tiap {comp.customInterval.toLocaleString()} km
                    </span>
                  </label>
                ))}
              </div>
              {errors.components && (
                <p className="text-red-500 text-xs mt-1">{errors.components}</p>
              )}
            </div>
          )}

          {/* Custom Components */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Komponen Lain (Opsional)
            </label>
            <input
              type="text"
              name="customComponents"
              value={formData.customComponents}
              onChange={handleChange}
              placeholder="Misal: Ganti Baut Oli, Ganti Roller Velocraft 17g (pisahkan dengan koma)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Catatan tambahan tentang servis ini..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Biaya (Opsional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">Rp</span>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="1000"
                placeholder="0"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Simpan Log Servis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
