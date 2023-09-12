export type RegionType = "Self" | "Peer" | "Edge" | "User";

export type Region = {
  Type: RegionType;
  ID: string;
  Name: string;
  Location: string;
  Lat: number;
  Lng: number;
  Flag: string;
};
