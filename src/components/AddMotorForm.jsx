import { useState } from "react";
import { useMotoLog } from "../context/MotoLogContext";
import { getBrands, getModels } from "../data/motorTemplates";
import { X } from "lucide-react";

export default function AddMotorForm({ onClose, onSuccess }) {
  const { addMotor } = useMotoLog();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    currentOdometer: 0,
    nickname: "",
  });
  const [errors, setErrors] = useState({});

  const brands = getBrands();
  const models = formData.brand ? getModels(formData.brand) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset model jika brand berubah
      ...(name === "brand" ? { model: "" } : {}),
    }));
    // Clear error saat user mulai ketik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.brand) newErrors.brand = "Pilih brand motor";
    if (!formData.model) newErrors.model = "Pilih model motor";
    if (!formData.year) newErrors.year = "Masukkan tahun pembuatan";
    if (formData.currentOdometer < 0)
      newErrors.currentOdometer = "Odometer tidak valid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const motorId = addMotor({
      ...formData,
      year: parseInt(formData.year),
      currentOdometer: parseInt(formData.currentOdometer),
    });

    if (onSuccess) onSuccess(motorId);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Tambah Motor</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Motor *
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.brand ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Motor *
            </label>
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              disabled={!formData.brand}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                errors.model ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {errors.model && (
              <p className="text-red-500 text-xs mt-1">{errors.model}</p>
            )}
          </div>

          {/* Tahun */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Pembuatan *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              max={new Date().getFullYear() + 1}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.year ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year}</p>
            )}
          </div>

          {/* Odometer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Odometer Saat Ini (km) *
            </label>
            <input
              type="number"
              name="currentOdometer"
              value={formData.currentOdometer}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.currentOdometer ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.currentOdometer && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentOdometer}
              </p>
            )}
          </div>

          {/* Nickname (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Panggilan (Opsional)
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Misal: Si Biru"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              Tambah Motor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
