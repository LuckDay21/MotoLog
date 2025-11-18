import { createContext, useContext, useEffect, useState } from "react";
import { ref, set, onValue, remove } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "./AuthContext";
import { getMotorTemplate } from "../data/motorTemplates";

const MotoLogContext = createContext();

export const useMotoLog = () => {
  const context = useContext(MotoLogContext);
  if (!context) {
    throw new Error("useMotoLog must be used within MotoLogProvider");
  }
  return context;
};

export const MotoLogProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Initialize state
  const [motors, setMotors] = useState([]);
  const [serviceLogs, setServiceLogs] = useState([]);
  const [selectedMotorId, setSelectedMotorId] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Load data dari Firebase saat user login, atau localStorage jika tidak
  useEffect(() => {
    if (!currentUser && !initialized) {
      // Jika tidak ada user, load dari localStorage sekali saja
      const savedMotors = localStorage.getItem("motolog_motors");
      const savedLogs = localStorage.getItem("motolog_service_logs");
      const savedSelectedId = localStorage.getItem("motolog_selected_motor");

      setMotors(savedMotors ? JSON.parse(savedMotors) : []);
      setServiceLogs(savedLogs ? JSON.parse(savedLogs) : []);
      setSelectedMotorId(savedSelectedId || null);
      setInitialized(true);
      return;
    }

    if (!currentUser) return;

    // Listen to Firebase realtime updates
    const motorsRef = ref(database, `users/${currentUser.uid}/motors`);
    const logsRef = ref(database, `users/${currentUser.uid}/serviceLogs`);
    const selectedRef = ref(
      database,
      `users/${currentUser.uid}/selectedMotorId`
    );

    const unsubscribeMotors = onValue(motorsRef, (snapshot) => {
      const data = snapshot.val();
      setMotors(data ? Object.values(data) : []);
      setInitialized(true);
    });

    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      setServiceLogs(data ? Object.values(data) : []);
    });

    const unsubscribeSelected = onValue(selectedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSelectedMotorId(data);
    });

    return () => {
      unsubscribeMotors();
      unsubscribeLogs();
      unsubscribeSelected();
    };
  }, [currentUser, initialized]);

  // Save to Firebase saat data berubah (jika user login)
  useEffect(() => {
    if (!initialized) return; // Jangan sync sebelum initialized

    if (currentUser) {
      const motorsRef = ref(database, `users/${currentUser.uid}/motors`);
      const motorsObj = {};
      motors.forEach((motor) => {
        motorsObj[motor.id] = motor;
      });
      set(motorsRef, motorsObj).catch((err) => {
        console.error("Error syncing motors:", err);
      });
    } else {
      // Save to localStorage jika tidak login
      localStorage.setItem("motolog_motors", JSON.stringify(motors));
    }
  }, [motors, currentUser, initialized]);

  useEffect(() => {
    if (!initialized) return;

    if (currentUser) {
      const logsRef = ref(database, `users/${currentUser.uid}/serviceLogs`);
      const logsObj = {};
      serviceLogs.forEach((log) => {
        logsObj[log.id] = log;
      });
      set(logsRef, logsObj).catch((err) => {
        console.error("Error syncing logs:", err);
      });
    } else {
      localStorage.setItem("motolog_service_logs", JSON.stringify(serviceLogs));
    }
  }, [serviceLogs, currentUser, initialized]);

  useEffect(() => {
    if (!initialized) return;

    if (currentUser && selectedMotorId) {
      const selectedRef = ref(
        database,
        `users/${currentUser.uid}/selectedMotorId`
      );
      set(selectedRef, selectedMotorId).catch((err) => {
        console.error("Error syncing selected motor:", err);
      });
    } else if (selectedMotorId) {
      localStorage.setItem("motolog_selected_motor", selectedMotorId);
    }
  }, [selectedMotorId, currentUser, initialized]);

  // Add motor to garage
  const addMotor = (motorData) => {
    const template = getMotorTemplate(motorData.brand, motorData.model);

    const newMotor = {
      id: Date.now().toString(),
      ...motorData,
      initialOdometer: motorData.currentOdometer, // Simpan odometer awal
      components: template.components.map((comp) => ({
        ...comp,
        customInterval: comp.interval, // Bisa dikustomisasi user nantinya
        lastServiceKm: 0, // Belum pernah servis
        nextServiceKm: motorData.currentOdometer + comp.interval,
      })),
      createdAt: new Date().toISOString(),
    };

    setMotors((prev) => [...prev, newMotor]);

    // Auto select jika motor pertama
    if (motors.length === 0) {
      setSelectedMotorId(newMotor.id);
    }

    return newMotor.id;
  };

  // Update motor
  const updateMotor = (motorId, updates) => {
    setMotors((prev) =>
      prev.map((motor) =>
        motor.id === motorId ? { ...motor, ...updates } : motor
      )
    );
  };

  // Delete motor
  const deleteMotor = (motorId) => {
    setMotors((prev) => prev.filter((motor) => motor.id !== motorId));
    setServiceLogs((prev) => prev.filter((log) => log.motorId !== motorId));

    if (selectedMotorId === motorId) {
      setSelectedMotorId(motors[0]?.id || null);
    }
  };

  // Add service log - INI LOGIC UTAMA ADAPTIVE
  const addServiceLog = (logData) => {
    const {
      motorId,
      odometerKm,
      serviceDate,
      servicedComponents,
      notes,
      cost,
      customComponents,
    } = logData;

    const newLog = {
      id: Date.now().toString(),
      motorId,
      odometerKm,
      serviceDate,
      servicedComponents, // Array of component IDs yang di-servis
      customComponents: customComponents || [], // Komponen custom
      notes,
      cost,
      createdAt: new Date().toISOString(),
    };

    setServiceLogs((prev) => [...prev, newLog]);

    // UPDATE MOTOR COMPONENTS - ADAPTIVE LOGIC
    setMotors((prev) =>
      prev.map((motor) => {
        if (motor.id !== motorId) return motor;

        return {
          ...motor,
          currentOdometer: odometerKm, // Update odometer
          components: motor.components.map((comp) => {
            // Jika komponen ini di-servis, reset timer
            if (servicedComponents.includes(comp.id)) {
              return {
                ...comp,
                lastServiceKm: odometerKm,
                nextServiceKm: odometerKm + comp.customInterval,
              };
            }
            // Jika tidak, biarkan jadwal tetap
            return comp;
          }),
        };
      })
    );

    return newLog.id;
  };

  // Update service log
  const updateServiceLog = (logId, updates) => {
    setServiceLogs((prev) =>
      prev.map((log) => (log.id === logId ? { ...log, ...updates } : log))
    );
  };

  // Delete service log - dengan recalculate
  const deleteServiceLog = (logId) => {
    // Dapatkan log yang akan dihapus untuk tahu motorId-nya
    const logToDelete = serviceLogs.find((log) => log.id === logId);
    if (!logToDelete) return;

    const motorId = logToDelete.motorId;

    // Hapus log dan rebuild dalam satu operasi
    setServiceLogs((prevLogs) => {
      const updatedLogs = prevLogs.filter((log) => log.id !== logId);

      // Rebuild motor menggunakan updated logs
      setMotors((prevMotors) => {
        const motor = prevMotors.find((m) => m.id === motorId);
        if (!motor) return prevMotors;

        // Dapatkan semua logs untuk motor ini, sorted by date (oldest first)
        const motorLogs = updatedLogs
          .filter((log) => log.motorId === motorId)
          .sort((a, b) => new Date(a.serviceDate) - new Date(b.serviceDate));

        // Reset components ke state awal (dari template)
        const template = getMotorTemplate(motor.brand, motor.model);

        // Gunakan initialOdometer yang tersimpan
        const initialOdometer = motor.initialOdometer || 0;

        let rebuiltComponents = template.components.map((comp) => ({
          ...comp,
          customInterval: comp.customInterval || comp.interval, // Preserve custom interval jika ada
          lastServiceKm: 0,
          nextServiceKm:
            initialOdometer + (comp.customInterval || comp.interval),
        }));

        let latestOdometer = initialOdometer;

        // Jika ada logs, replay untuk rebuild state
        if (motorLogs.length > 0) {
          // Ambil odometer dari log terakhir
          latestOdometer = motorLogs[motorLogs.length - 1].odometerKm;

          // Replay semua service logs untuk rebuild state
          motorLogs.forEach((log) => {
            rebuiltComponents = rebuiltComponents.map((comp) => {
              if (log.servicedComponents.includes(comp.id)) {
                return {
                  ...comp,
                  lastServiceKm: log.odometerKm,
                  nextServiceKm: log.odometerKm + comp.customInterval,
                };
              }
              return comp;
            });
          });
        }

        // Return updated motors
        return prevMotors.map((m) => {
          if (m.id !== motorId) return m;
          return {
            ...m,
            currentOdometer: latestOdometer,
            components: rebuiltComponents,
          };
        });
      });

      return updatedLogs;
    });
  };

  // Get selected motor
  const getSelectedMotor = () => {
    return motors.find((m) => m.id === selectedMotorId);
  };

  // Get service logs for a motor
  const getMotorServiceLogs = (motorId) => {
    return serviceLogs
      .filter((log) => log.motorId === motorId)
      .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
  };

  // Calculate next service (komponen paling urgent)
  const getNextService = (motorId) => {
    const motor = motors.find((m) => m.id === motorId);
    if (!motor) return null;

    const currentKm = motor.currentOdometer;

    // Cari komponen dengan sisa km paling sedikit
    let nextService = null;
    let minRemainingKm = Infinity;

    motor.components.forEach((comp) => {
      const remainingKm = comp.nextServiceKm - currentKm;
      if (remainingKm < minRemainingKm) {
        minRemainingKm = remainingKm;
        nextService = {
          ...comp,
          remainingKm,
          isOverdue: remainingKm < 0,
        };
      }
    });

    return nextService;
  };

  // Get all components status
  const getComponentsStatus = (motorId) => {
    const motor = motors.find((m) => m.id === motorId);
    if (!motor) return [];

    const currentKm = motor.currentOdometer;

    return motor.components
      .map((comp) => {
        const remainingKm = comp.nextServiceKm - currentKm;
        const progress =
          ((comp.customInterval - remainingKm) / comp.customInterval) * 100;

        return {
          ...comp,
          remainingKm,
          progress: Math.max(0, Math.min(100, progress)),
          isOverdue: remainingKm < 0,
          status:
            remainingKm < 0 ? "overdue" : remainingKm < 500 ? "warning" : "ok",
        };
      })
      .sort((a, b) => a.remainingKm - b.remainingKm);
  };

  // Update component custom interval
  const updateComponentInterval = (motorId, componentId, newInterval) => {
    setMotors((prev) =>
      prev.map((motor) => {
        if (motor.id !== motorId) return motor;

        return {
          ...motor,
          components: motor.components.map((comp) => {
            if (comp.id === componentId) {
              return {
                ...comp,
                customInterval: newInterval,
                nextServiceKm: comp.lastServiceKm + newInterval,
              };
            }
            return comp;
          }),
        };
      })
    );
  };

  const value = {
    motors,
    serviceLogs,
    selectedMotorId,
    setSelectedMotorId,
    addMotor,
    updateMotor,
    deleteMotor,
    addServiceLog,
    updateServiceLog,
    deleteServiceLog,
    getSelectedMotor,
    getMotorServiceLogs,
    getNextService,
    getComponentsStatus,
    updateComponentInterval,
  };

  return (
    <MotoLogContext.Provider value={value}>{children}</MotoLogContext.Provider>
  );
};
