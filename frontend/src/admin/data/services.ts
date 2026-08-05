export interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  active: boolean;
  works: string[];
}

export const services: Service[] = [
  {
    id: 1,
    name: "PAN Card",
    category: "Identity",
    price: 199,
    active: true,
    works: [
      "New PAN",
      "PAN Correction",
      "PAN Reprint",
      "Lost PAN",
    ],
  },

  {
    id: 2,
    name: "Aadhaar",
    category: "Identity",
    price: 99,
    active: true,
    works: [
      "Address Update",
      "Mobile Update",
      "PVC Card",
    ],
  },

  {
    id: 3,
    name: "Passport",
    category: "Identity",
    price: 399,
    active: true,
    works: [
      "New Passport",
      "Renew Passport",
    ],
  },
];