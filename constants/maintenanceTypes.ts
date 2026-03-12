export type MaintenanceTypeId =
  | "oil-change"
  | "tires"
  | "battery"
  | "brakes"
  | "air-filter"
  | "fuel-filter"
  | "transmission"
  | "coolant"
  | "spark-plugs"
  | "wipers";

export interface MaintenanceTypeDef {
  id: MaintenanceTypeId | string;
  name: string;
  color: string;
  defaultIntervalDays: number;
  defaultIntervalKm: number;
  sortOrder: number;
}

export const MAINTENANCE_TYPES: MaintenanceTypeDef[] = [
  {
    id: "oil-change",
    name: "Oil Change",
    color: "#F59E0B",
    defaultIntervalDays: 90,
    defaultIntervalKm: 5000,
    sortOrder: 0,
  },
  {
    id: "tires",
    name: "Tires",
    color: "#6B7280",
    defaultIntervalDays: 365,
    defaultIntervalKm: 10000,
    sortOrder: 1,
  },
  {
    id: "battery",
    name: "Battery",
    color: "#3B82F6",
    defaultIntervalDays: 730,
    defaultIntervalKm: 30000,
    sortOrder: 2,
  },
  {
    id: "brakes",
    name: "Brakes",
    color: "#EF4444",
    defaultIntervalDays: 365,
    defaultIntervalKm: 20000,
    sortOrder: 3,
  },
  {
    id: "air-filter",
    name: "Air Filter",
    color: "#10B981",
    defaultIntervalDays: 365,
    defaultIntervalKm: 15000,
    sortOrder: 4,
  },
  {
    id: "fuel-filter",
    name: "Fuel Filter",
    color: "#8B5CF6",
    defaultIntervalDays: 730,
    defaultIntervalKm: 30000,
    sortOrder: 5,
  },
  {
    id: "transmission",
    name: "Transmission",
    color: "#EC4899",
    defaultIntervalDays: 730,
    defaultIntervalKm: 50000,
    sortOrder: 6,
  },
  {
    id: "coolant",
    name: "Coolant",
    color: "#06B6D4",
    defaultIntervalDays: 730,
    defaultIntervalKm: 40000,
    sortOrder: 7,
  },
  {
    id: "spark-plugs",
    name: "Spark Plugs",
    color: "#F97316",
    defaultIntervalDays: 730,
    defaultIntervalKm: 30000,
    sortOrder: 8,
  },
  {
    id: "wipers",
    name: "Wipers",
    color: "#6366F1",
    defaultIntervalDays: 365,
    defaultIntervalKm: 20000,
    sortOrder: 9,
  },
];
