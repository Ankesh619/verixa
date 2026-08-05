export const services = [
  {
    id: "pan",
    name: "PAN Card",
    icon: "💳",
    works: [
      {
        id: "new-pan",
        title: "New PAN Card",
        price: 199,
        days: "2-3 Days",
        documents: [
          "Aadhaar Card",
          "Passport Size Photo",
          "Signature",
        ],
      },
      {
        id: "pan-correction",
        title: "PAN Correction",
        price: 249,
        days: "3-5 Days",
        documents: [
          "Old PAN Card",
          "Aadhaar Card",
          "Passport Size Photo",
          "Signature",
        ],
      },
      {
        id: "reprint-pan",
        title: "Lost PAN Reprint",
        price: 149,
        days: "2 Days",
        documents: [
          "Old PAN Copy (if available)",
          "Aadhaar Card",
        ],
      },
    ],
  },

  {
    id: "aadhaar",
    name: "Aadhaar",
    icon: "🪪",
    works: [
      {
        id: "mobile-update",
        title: "Mobile Number Update",
        price: 199,
        days: "1 Day",
        documents: [
          "Aadhaar Card",
        ],
      },
      {
        id: "address-update",
        title: "Address Update",
        price: 199,
        days: "1 Day",
        documents: [
          "Aadhaar Card",
          "Address Proof",
        ],
      },
      {
        id: "name-update",
        title: "Name Correction",
        price: 249,
        days: "2 Days",
        documents: [
          "Aadhaar Card",
          "Supporting Document",
        ],
      },
    ],
  },

  {
    id: "passport",
    name: "Passport",
    icon: "🛂",
    works: [
      {
        id: "new-passport",
        title: "New Passport",
        price: 499,
        days: "7-15 Days",
        documents: [
          "Aadhaar Card",
          "PAN Card",
          "Photo",
          "Address Proof",
        ],
      },
      {
        id: "renew-passport",
        title: "Passport Renewal",
        price: 499,
        days: "7 Days",
        documents: [
          "Old Passport",
          "Aadhaar Card",
        ],
      },
    ],
  },

  {
    id: "gst",
    name: "GST Registration",
    icon: "🏢",
    works: [
      {
        id: "new-gst",
        title: "New GST Registration",
        price: 999,
        days: "3-5 Days",
        documents: [
          "PAN Card",
          "Aadhaar Card",
          "Bank Passbook",
          "Photo",
        ],
      },
    ],
  },
];