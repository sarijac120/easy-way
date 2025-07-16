export interface RideGroup {
  _id: string;
  groupName: string;
  origin: string;
  destination: string;
  days: string[];
  departureTime: string;
  returnTime?: string;
  capacityTotal: number;
  estimatedDuration: number;
  driverId: string | { _id: string; name: string }; // תלוי אם אתה עושה populate
  passengers: string[] | { _id: string; name: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  groupImageURL?: string;
}