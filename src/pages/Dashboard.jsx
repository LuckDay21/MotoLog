import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMotoLog } from "../context/MotoLogContext";
import { useAuth } from "../context/AuthContext";
import { Plus, Settings, Bell, History, Bike, LogOut } from "lucide-react";
import AddMotorForm from "../components/AddMotorForm";
import LogServiceForm from "../components/LogServiceForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const {
    motors,
    selectedMotorId,
    setSelectedMotorId,
    getSelectedMotor,
    getNextService,
    getComponentsStatus,
  } = useMotoLog();
  const [showAddMotor, setShowAddMotor] = useState(false);
  const [showLogService, setShowLogService] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const selectedMotor = getSelectedMotor();
  const nextService = selectedMotor ? getNextService(selectedMotor.id) : null;
  const componentsStatus = selectedMotor
    ? getComponentsStatus(selectedMotor.id)
    : [];

  // Tampilkan form add motor jika belum ada motor
  if (motors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bike size={40} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Selamat Datang di MotoLog!
          </h1>
          <p className="text-gray-600 mb-6">
            Asisten servis pribadi yang cerdas untuk motor Anda. Mulai dengan
            menambahkan motor pertama Anda.
          </p>
          <button
            onClick={() => setShowAddMotor(true)}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Tambah Motor Pertama
          </button>
        </div>

        {showAddMotor && (
          <AddMotorForm
            onClose={() => setShowAddMotor(false)}
            onSuccess={() => setShowAddMotor(false)}
          />
        )}
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800 border-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "overdue":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MotoLog</h1>
              {currentUser && (
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Motor Selector */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motor Aktif
          </label>
          <select
            value={selectedMotorId || ""}
            onChange={(e) => setSelectedMotorId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {motors.map((motor) => (
              <option key={motor.id} value={motor.id}>
                {motor.nickname ||
                  `${motor.brand} ${motor.model} ${motor.year}`}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddMotor(true)}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus size={16} />
            Tambah Motor Lain
          </button>
        </div>

        {/* Current Odometer */}
        {selectedMotor && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">
                Odometer Saat Ini
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {selectedMotor.currentOdometer.toLocaleString()}
                <span className="text-xl text-gray-500 ml-2">km</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Service Alert */}
        {nextService && (
          <div
            className={`rounded-lg shadow p-6 border-2 ${getStatusColor(
              nextService.status
            )}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  {nextService.isOverdue
                    ? "⚠️ SERVIS TERLAMBAT!"
                    : "Servis Terdekat"}
                </h3>
                <p className="text-2xl font-bold mb-2">{nextService.name}</p>
                <div className="space-y-1 text-sm">
                  {nextService.isOverdue ? (
                    <p className="font-medium">
                      Sudah melewati{" "}
                      {Math.abs(nextService.remainingKm).toLocaleString()} km
                      dari jadwal!
                    </p>
                  ) : (
                    <p>
                      Sisa{" "}
                      <span className="font-bold">
                        {nextService.remainingKm.toLocaleString()} km
                      </span>{" "}
                      lagi
                    </p>
                  )}
                  <p className="text-gray-600">
                    Jadwal servis di{" "}
                    {nextService.nextServiceKm.toLocaleString()} km
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Log Service Button */}
        <button
          onClick={() => setShowLogService(true)}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg font-medium text-lg"
        >
          <Plus size={24} />
          Log Servis Baru
        </button>

        {/* Components Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg">Kondisi Semua Komponen</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {componentsStatus.map((comp) => (
              <div key={comp.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{comp.name}</h4>
                    <p className="text-xs text-gray-500">
                      Interval: {comp.customInterval.toLocaleString()} km
                    </p>
                  </div>
                  <div className="text-right">
                    {comp.isOverdue ? (
                      <span className="text-red-600 font-bold text-sm">
                        Terlambat {Math.abs(comp.remainingKm).toLocaleString()}{" "}
                        km
                      </span>
                    ) : (
                      <span className="text-gray-600 text-sm">
                        Sisa {comp.remainingKm.toLocaleString()} km
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(
                      comp.status
                    )}`}
                    style={{ width: `${Math.min(100, comp.progress)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/history")}
            className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 flex items-center gap-3"
          >
            <History size={24} className="text-blue-600" />
            <span className="font-medium">Riwayat Servis</span>
          </button>
          <button className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 flex items-center gap-3">
            <Settings size={24} className="text-blue-600" />
            <span className="font-medium">Pengaturan</span>
          </button>
        </div>
      </main>

      {/* Modals */}
      {showAddMotor && (
        <AddMotorForm
          onClose={() => setShowAddMotor(false)}
          onSuccess={() => setShowAddMotor(false)}
        />
      )}

      {showLogService && (
        <LogServiceForm
          onClose={() => setShowLogService(false)}
          onSuccess={() => setShowLogService(false)}
        />
      )}
    </div>
  );
}
