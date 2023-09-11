const EUROPE = process.env.EUROPE_HOST || "reg-europe";
const ASIA = process.env.ASIA_HOST || "reg-asia";
const US_WEST = process.env.USWEST_HOST || "reg-us-west";
const US_EAST = process.env.USEAST_HOST || "reg-us-east";

export type Region = {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  flag: string;
  host: string;
};

const getHost = (id: string) => {
  switch (id) {
    case "europe-west4":
      return EUROPE;
    case "asia-southeast1":
      return ASIA;
    case "us-west1":
      return US_WEST;
    case "us-east4":
      return US_EAST;
  }
};
export const REGIONS: Region[] = [
  {
    id: "europe-west4",
    name: "Eemshaven",
    city: "Eemshaven",
    country: "Netherlands",
    lat: 53.448333,
    lng: 6.831111,
    flag: "🇪🇺",
    host:
      process.env.NODE_ENV === "development"
        ? `http://192.168.68.103:4444`
        : `https://${getHost("europe-west4")}-production.up.railway.app`,
  },
  {
    id: "us-west1",
    name: "Oregon",
    city: "The Dallas",
    country: "USA",
    lat: 44.919284,
    lng: -123.317047,
    flag: "🇺🇸",
    host:
      process.env.NODE_ENV === "development"
        ? `http://192.168.68.103:4444`
        : `https://${getHost("us-west1")}-production.up.railway.app`,
  },
  {
    id: "us-east4",
    name: "Ashburn",
    city: "Ashburn",
    country: "USA",
    lat: 39.043757,
    lng: -77.487442,
    flag: "🇺🇸",
    host:
      process.env.NODE_ENV === "development"
        ? `http://192.168.68.103:4444`
        : `https://${getHost("us-east4")}-production.up.railway.app`,
  },
  {
    id: "asia-southeast1",
    name: "Jurong West",
    city: "Jurong West",
    country: "Singapore",
    lat: 1.34039,
    lng: 103.708988,
    flag: "🇸🇬",
    host:
      process.env.NODE_ENV === "development"
        ? `http://192.168.68.103:4444`
        : `https://${getHost("asia-southeast1")}-production.up.railway.app`,
  },
];
