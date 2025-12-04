
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
  responsibleName: string;
  vehiclePlate: string;
  mileage: number;
  returnMileage?: number;
  // FIX: Added missing checklistItems property to the Checklist interface.
  checklistItems: ChecklistItem[];
  photos: string[]; // array of base64 strings
  observations: string;
  timestamp: string;
}

export enum View {
  EMPLOYEE = 'EMPLOYEE',
  SUPERVISOR = 'SUPERVISOR',
}