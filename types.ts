
export enum Status {
  WFO = 'WFO',
  WFH = 'WFH',
  WKND = 'WKND',
  LEAVE = 'LEAVE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  adminId: string;
  offDays: number[]; // 0 for Sunday, 6 for Saturday etc.
  memberIds: string[];
}

export interface AvailabilityRecord {
  id: string;
  userId: string;
  teamId: string;
  weekId: string; // Format: "YYYY-W##"
  days: Status[]; // Array of 7 statuses
  updatedAt: number;
}

export interface Database {
  users: User[];
  teams: Team[];
  availabilities: AvailabilityRecord[];
}
