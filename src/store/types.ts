export interface Child {
  id: string;
  name: string;
  birthDate: string;
  roomId: string;
  medicalNotes: string;
  guardians: Guardian[];
  braceletNumber: string | null;
  authorizedPickup: string | null; // pessoa autorizada a buscar (ex: "Avó - Dona Maria")
  status: 'present' | 'called' | 'left';
  checkedInAt: string;
}

export interface Guardian {
  id: string;
  name: string;
  phone: string;
}

export interface Bracelet {
  id: string;
  number: string;
  espId: string | null; // MAC address do ESP32 (ex: "A4:B2:C1:D3")
  status: 'available' | 'in-use' | 'charging' | 'offline';
  battery: number;
  guardianName: string | null;
  childId: string | null;
}

export interface Call {
  id: string;
  childId: string;
  braceletNumber: string;
  roomId: string; // sala de onde partiu a chamada
  reason: string;
  reasonIcon: string;
  status: 'open' | 'answered' | 'reactivated';
  answeredBy: 'reception' | 'tia' | null; // quem encerrou a chamada
  createdAt: string;
  answeredAt: string | null;
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
  ageRange: string;
}

export interface ServiceHistory {
  id: string;
  date: string;
  serviceName: string;
  childrenCount: number;
  callsCount: number;
}

export interface AppSettings {
  churchName: string;
  reactivateMinutes: number;
  dailyCode: string;
}
