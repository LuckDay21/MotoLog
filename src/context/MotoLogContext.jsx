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

  // Load data dari Firebase saat user login
  useEffect(() => {
    if (!currentUser) {
      // Reset state jika tidak ada user
      setMotors([]);
      setServiceLogs([]);
      setSelectedMotorId(null);
      return;
    }

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
    });

    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array, preserve the Firebase key as id
        const logsArray = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: value.id || key, // Use existing id or fallback to Firebase key
        }));
        setServiceLogs(logsArray);
      } else {
        setServiceLogs([]);
      }
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
  }, [currentUser]);

  // REMOVE ALL useEffect SYNC - we'll save directly in functions instead

  // Add motor to garage
  const addMotor = (motorData) => {
    if (!currentUser) return;

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

    // Save to Firebase immediately
    const motorRef = ref(
      database,
      `users/${currentUser.uid}/motors/${newMotor.id}`
    );
    set(motorRef, newMotor).catch((err) => {
      console.error("Error saving motor:", err);
    });

    // Auto select jika motor pertama
    if (motors.length === 0) {
      const selectedRef = ref(
        database,
        `users/${currentUser.uid}/selectedMotorId`
      );
      set(selectedRef, newMotor.id).catch((err) => {
        console.error("Error saving selected motor:", err);
      });
    }

    return newMotor.id;
  };

  // Update motor
  const updateMotor = (motorId, updates) => {
    if (!currentUser) return;

    const motor = motors.find((m) => m.id === motorId);
    if (!motor) return;

    const updatedMotor = { ...motor, ...updates };
    const motorRef = ref(
      database,
      `users/${currentUser.uid}/motors/${motorId}`
    );
    set(motorRef, updatedMotor).catch((err) => {
      console.error("Error updating motor:", err);
    });
  };

  // Delete motor
  const deleteMotor = (motorId) => {
    if (!currentUser) return;

    // Delete motor from Firebase
    const motorRef = ref(
      database,
      `users/${currentUser.uid}/motors/${motorId}`
    );
    remove(motorRef).catch((err) => {
      console.error("Error deleting motor:", err);
    });

    // Delete all service logs for this motor
    const logsToDelete = serviceLogs.filter((log) => log.motorId === motorId);
    logsToDelete.forEach((log) => {
      const logRef = ref(
        database,
        `users/${currentUser.uid}/serviceLogs/${log.id}`
      );
      remove(logRef).catch((err) => {
        console.error("Error deleting service log:", err);
      });
    });

    // Update selected motor if needed
    if (selectedMotorId === motorId) {
      const remainingMotors = motors.filter((m) => m.id !== motorId);
      const newSelectedId = remainingMotors[0]?.id || null;
      if (newSelectedId) {
        const selectedRef = ref(
          database,
          `users/${currentUser.uid}/selectedMotorId`
        );
        set(selectedRef, newSelectedId).catch((err) => {
          console.error("Error updating selected motor:", err);
        });
      }
    }
  };

  // Add service log - INI LOGIC UTAMA ADAPTIVE
  const addServiceLog = (logData) => {
    if (!currentUser) return;

    const {
      motorId,
      odometerKm,
      serviceDate,
      servicedComponents,
      notes,
      cost,
      customComponents,
    } = logData;

    // Generate unique ID menggunakan timestamp + random untuk avoid collision
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newLog = {
      id: uniqueId,
      motorId,
      odometerKm,
      serviceDate,
      servicedComponents, // Array of component IDs yang di-servis
      customComponents: customComponents || [], // Komponen custom
      notes,
      cost,
      createdAt: new Date().toISOString(),
    };

    // Save log to Firebase immediately
    const logRef = ref(
      database,
      `users/${currentUser.uid}/serviceLogs/${uniqueId}`
    );
    set(logRef, newLog).catch((err) => {
      console.error("Error saving log to Firebase:", err);
    });

    // UPDATE MOTOR COMPONENTS - ADAPTIVE LOGIC and save to Firebase
    const motor = motors.find((m) => m.id === motorId);
    if (motor) {
      const updatedMotor = {
        ...motor,
        currentOdometer: odometerKm,
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

      // Save updated motor to Firebase
      const motorRef = ref(
        database,
        `users/${currentUser.uid}/motors/${motorId}`
      );
      set(motorRef, updatedMotor).catch((err) => {
        console.error("Error updating motor:", err);
      });
    }

    return newLog.id;
  };

  // Update service log
  const updateServiceLog = (logId, updates) => {
    if (!currentUser) return;

    const log = serviceLogs.find((l) => l.id === logId);
    if (!log) return;

    const updatedLog = { ...log, ...updates };
    const logRef = ref(
      database,
      `users/${currentUser.uid}/serviceLogs/${logId}`
    );
    set(logRef, updatedLog).catch((err) => {
      console.error("Error updating service log:", err);
    });
  };

  // Update selected motor
  const updateSelectedMotorId = (motorId) => {
    if (!currentUser || !motorId) return;

    const selectedRef = ref(
      database,
      `users/${currentUser.uid}/selectedMotorId`
    );
    set(selectedRef, motorId).catch((err) => {
      console.error("Error updating selected motor:", err);
    });
  };

  // Delete service log - dengan recalculate
  const deleteServiceLog = (logId) => {
    if (!currentUser) return;

    // Dapatkan log yang akan dihapus untuk tahu motorId-nya
    const logToDelete = serviceLogs.find((log) => log.id === logId);
    if (!logToDelete) return;

    const motorId = logToDelete.motorId;

    // Delete log dari Firebase
    const logRef = ref(
      database,
      `users/${currentUser.uid}/serviceLogs/${logId}`
    );
    remove(logRef).catch((err) => {
      console.error("Error deleting log from Firebase:", err);
    });

    // Rebuild motor state
    const motor = motors.find((m) => m.id === motorId);
    if (!motor) return;

    // Dapatkan semua logs untuk motor ini kecuali yang dihapus, sorted by date (oldest first)
    const motorLogs = serviceLogs
      .filter((log) => log.motorId === motorId && log.id !== logId)
      .sort((a, b) => new Date(a.serviceDate) - new Date(b.serviceDate));

    // Reset components ke state awal (dari template)
    const template = getMotorTemplate(motor.brand, motor.model);
    const initialOdometer = motor.initialOdometer || 0;

    let rebuiltComponents = template.components.map((comp) => ({
      ...comp,
      customInterval: comp.customInterval || comp.interval,
      lastServiceKm: 0,
      nextServiceKm: initialOdometer + (comp.customInterval || comp.interval),
    }));

    let latestOdometer = initialOdometer;

    // Replay semua service logs untuk rebuild state
    if (motorLogs.length > 0) {
      latestOdometer = motorLogs[motorLogs.length - 1].odometerKm;

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

    // Save rebuilt motor to Firebase
    const updatedMotor = {
      ...motor,
      currentOdometer: latestOdometer,
      components: rebuiltComponents,
    };

    const motorRef = ref(
      database,
      `users/${currentUser.uid}/motors/${motorId}`
    );
    set(motorRef, updatedMotor).catch((err) => {
      console.error("Error updating motor after delete:", err);
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
    if (!currentUser) return;

    const motor = motors.find((m) => m.id === motorId);
    if (!motor) return;

    const updatedMotor = {
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

    const motorRef = ref(
      database,
      `users/${currentUser.uid}/motors/${motorId}`
    );
    set(motorRef, updatedMotor).catch((err) => {
      console.error("Error updating component interval:", err);
    });
  };

  const value = {
    motors,
    serviceLogs,
    selectedMotorId,
    setSelectedMotorId: updateSelectedMotorId,
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
