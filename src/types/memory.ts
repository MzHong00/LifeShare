export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Memory {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  path: LocationPoint[];
  thumbnailUrl?: string;
  userId: string;
  workspaceId: string;
}
