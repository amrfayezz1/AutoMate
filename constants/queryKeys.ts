export const queryKeys = {
  cars: {
    all: ['cars'] as const,
    byId: (id: string) => ['cars', id] as const,
  },
  maintenanceRecords: {
    all: (carId: string) => ['maintenance', carId] as const,
    byId: (carId: string, id: string) => ['maintenance', carId, id] as const,
  },
  maintenanceTypes: {
    all: ['maintenanceTypes'] as const,
  },
  reminders: {
    all: (carId: string) => ['reminders', carId] as const,
  },
  documents: {
    all: (carId: string) => ['documents', carId] as const,
    byId: (carId: string, id: string) => ['documents', carId, id] as const,
  },
  odometer: {
    all: (carId: string) => ['odometer', carId] as const,
  },
  profile: {
    current: ['profile'] as const,
  },
} as const;
