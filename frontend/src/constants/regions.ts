export type Region = {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  flag: string;
};

export const REGIONS: Region[] = [
  {
    id: "europe-west4",
    name: "Eemshaven",
    city: "Eemshaven",
    country: "Netherlands",
    lat: 53.448333,
    lng: 6.831111,
    flag: '🇪🇺',
  },
  {
    id: "us-west1",
    name: "Oregon",
    city: "The Dallas",
    country: "USA",
    lat: 44.919284,
    lng: -123.317047,
    flag: '🇺🇸',
  },
  {
    id: "us-east4",
    name: "Ashburn",
    city: "Ashburn",
    country: "USA",
    lat: 39.043757,
    lng: -77.487442,
    flag: '🇺🇸',
  },
  {
    id: "asia-southeast1",
    name: "Jurong West",
    city: "Jurong West",
    country: "Singapore",
    lat: 1.34039,
    lng: 103.708988,
    flag: '🇸🇬',
  },
];
