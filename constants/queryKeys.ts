export const queryKeys = {
  cars: {
    all: ["cars"] as const,
    list: () => [...queryKeys.cars.all, "list"] as const,
    detail: (id: string) => [...queryKeys.cars.all, "detail", id] as const,
  },
  maintenanceRecords: {
    all: ["maintenanceRecords"] as const,
    byCar: (carId: string) =>
      [...queryKeys.maintenanceRecords.all, carId] as const,
    detail: (id: string) =>
      [...queryKeys.maintenanceRecords.all, "detail", id] as const,
  },
  maintenanceTypes: {
    all: ["maintenanceTypes"] as const,
    list: () => [...queryKeys.maintenanceTypes.all, "list"] as const,
  },
  reminders: {
    all: ["reminders"] as const,
    byCar: (carId: string) => [...queryKeys.reminders.all, carId] as const,
    detail: (id: string) => [...queryKeys.reminders.all, "detail", id] as const,
  },
  documents: {
    all: ["documents"] as const,
    byCar: (carId: string) => [...queryKeys.documents.all, carId] as const,
  },
  odometerLogs: {
    all: ["odometerLogs"] as const,
    byCar: (carId: string) => [...queryKeys.odometerLogs.all, carId] as const,
  },
  profile: {
    all: ["profile"] as const,
    detail: () => [...queryKeys.profile.all, "detail"] as const,
  },
} as const;
