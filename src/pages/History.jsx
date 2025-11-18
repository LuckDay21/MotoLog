import { useMotoLog } from "../context/MotoLogContext";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const { getSelectedMotor, getMotorServiceLogs, deleteServiceLog } =
    useMotoLog();
  const navigate = useNavigate();
  const selectedMotor = getSelectedMotor();

  if (!selectedMotor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pilih motor terlebih dahulu</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const serviceLogs = getMotorServiceLogs(selectedMotor.id);

  const handleDelete = (logId) => {
    if (window.confirm("Yakin ingin menghapus log servis ini?")) {
      deleteServiceLog(logId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getComponentName = (componentId) => {
    const component = selectedMotor.components.find(
      (c) => c.id === componentId
    );
    return component?.name || componentId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Servis</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Motor Info */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-bold text-lg">
            {selectedMotor.nickname ||
              `${selectedMotor.brand} ${selectedMotor.model} ${selectedMotor.year}`}
          </h2>
          <p className="text-gray-600 text-sm">
            {serviceLogs.length} servis tercatat
          </p>
        </div>

        {/* Service Logs */}
        {serviceLogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">Belum ada riwayat servis</p>
            <p className="text-sm text-gray-500">
              Log servis pertama Anda untuk mulai melacak perawatan motor
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {serviceLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <Calendar size={16} />
                      {formatDate(log.serviceDate)}
                    </div>
                    <div className="text-lg font-bold">
                      {log.odometerKm.toLocaleString()} km
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Components List */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Komponen yang Diservis:
                  </h4>
                  <ul className="space-y-1 mb-3">
                    {log.servicedComponents.map((compId) => (
                      <li
                        key={compId}
                        className="text-gray-700 text-sm flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        {getComponentName(compId)}
                      </li>
                    ))}
                    {log.customComponents &&
                      log.customComponents.map((comp, idx) => (
                        <li
                          key={`custom-${idx}`}
                          className="text-gray-700 text-sm flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          {comp}
                        </li>
                      ))}
                  </ul>

                  {/* Cost */}
                  {log.cost && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <DollarSign size={16} />
                      <span className="font-medium">
                        {formatCurrency(log.cost)}
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {log.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 italic">
                        "{log.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
