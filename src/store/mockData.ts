import { Child, Bracelet, Call, Room, ServiceHistory, AppSettings, Gateway } from './types';

const now = Date.now();

export const mockRooms: Room[] = [
  { id: 'r1', name: 'Berçário', emoji: '🍼', ageRange: '0-2 anos' },
  { id: 'r2', name: 'Maternal', emoji: '🌟', ageRange: '3-5 anos' },
  { id: 'r3', name: 'Infantil', emoji: '✨', ageRange: '6-10 anos' },
];

export const mockChildren: Child[] = [];

export const mockBracelets: Bracelet[] = [
  { id: 'b1',  number: '01', status: 'available', battery: 95, guardianName: null,              childId: null, espId: 'A4:B2:C1:D3', lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b2',  number: '02', status: 'available', battery: 88, guardianName: null,              childId: null, espId: 'A4:B2:C1:D4', lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b3',  number: '03', status: 'in-use',    battery: 72, guardianName: 'Ana Santos',      childId: 'c2', espId: 'A4:B2:C1:D5', lastHeartbeat: new Date(now - 15000).toISOString(),     connectivityStatus: 'online',      lastGatewayId: 'gateway-1' },
  { id: 'b4',  number: '04', status: 'available', battery: 100,guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b5',  number: '05', status: 'charging',  battery: 45, guardianName: null,              childId: null, espId: 'A4:B2:C1:D7', lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b6',  number: '06', status: 'available', battery: 91, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b7',  number: '07', status: 'in-use',    battery: 63, guardianName: 'Carlos Silva',    childId: 'c1', espId: 'A4:B2:C1:D9', lastHeartbeat: new Date(now - 25000).toISOString(),     connectivityStatus: 'online',      lastGatewayId: 'gateway-1' },
  { id: 'b8',  number: '08', status: 'available', battery: 85, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b9',  number: '09', status: 'offline',   battery: 12, guardianName: null,              childId: null, espId: 'A4:B2:C1:DB', lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b10', number: '10', status: 'available', battery: 97, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b11', number: '11', status: 'available', battery: 78, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b12', number: '12', status: 'in-use',    battery: 54, guardianName: 'Roberto Oliveira',childId: 'c3', espId: 'A4:B2:C1:DE', lastHeartbeat: new Date(now - 48000).toISOString(),     connectivityStatus: 'warning',     lastGatewayId: 'gateway-2' },
  { id: 'b13', number: '13', status: 'available', battery: 90, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b14', number: '14', status: 'charging',  battery: 30, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b15', number: '15', status: 'available', battery: 82, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b16', number: '16', status: 'available', battery: 99, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b17', number: '17', status: 'available', battery: 76, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b18', number: '18', status: 'offline',   battery: 5,  guardianName: null,              childId: null, espId: null,            lastHeartbeat: new Date(now - 120000).toISOString(),    connectivityStatus: 'unreachable', lastGatewayId: 'gateway-3' },
  { id: 'b19', number: '19', status: 'available', battery: 93, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
  { id: 'b20', number: '20', status: 'available', battery: 87, guardianName: null,              childId: null, espId: null,            lastHeartbeat: null,                                    connectivityStatus: 'online',      lastGatewayId: null },
];

export const mockCalls: Call[] = [];

export const mockGateways: Gateway[] = [
  { id: 'gateway-1', name: 'Ala principal',  location: 'Entrada do kids',     status: 'online',  lastSeenAt: new Date(now - 5000).toISOString(),   ipAddress: '192.168.1.101' },
  { id: 'gateway-2', name: 'Ala lateral',    location: 'Corredor das salas',  status: 'online',  lastSeenAt: new Date(now - 12000).toISOString(),  ipAddress: '192.168.1.102' },
  { id: 'gateway-3', name: 'Saída',          location: 'Corredor de saída',   status: 'offline', lastSeenAt: new Date(now - 300000).toISOString(), ipAddress: '192.168.1.103' },
];

export const mockHistory: ServiceHistory[] = [
  { id: 'h1', date: '2026-03-29', serviceName: 'Culto Domingo Manhã', childrenCount: 28, callsCount: 5 },
  { id: 'h2', date: '2026-03-29', serviceName: 'Culto Domingo Noite', childrenCount: 22, callsCount: 3 },
  { id: 'h3', date: '2026-03-22', serviceName: 'Culto Domingo Manhã', childrenCount: 31, callsCount: 7 },
  { id: 'h4', date: '2026-03-22', serviceName: 'Culto Domingo Noite', childrenCount: 19, callsCount: 2 },
];

export const mockSettings: AppSettings = {
  churchName: 'Igreja Graça e Vida',
  reactivateMinutes: 5,
  dailyCode: '4821',
  heartbeatIntervalSeconds: 30,
  heartbeatWarningThreshold: 1,
  heartbeatOfflineThreshold: 3,
  esp32Url: 'http://ovelhinha-01.local',
};
