
export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
}

export type ChecklistItemStatus = 'OK' | 'NOT_OK' | 'PENDING';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistItemStatus;
}

export interface Checklist {
  id: string;
  responsible_name: string;
  vehicle_plate: string;
  mileage: number;
  return_mileage?: number;
  checklist_items: ChecklistItem[];
  photos?: string[]; // array of base64 strings
  observations?: string;
  timestamp: string;
  vehicle_id?: string; // Foreign key
}

export enum View {
  EMPLOYEE = 'EMPLOYEE',
  SUPERVISOR = 'SUPERVISOR',
}