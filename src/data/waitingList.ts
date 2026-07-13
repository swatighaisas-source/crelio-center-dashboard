export interface WaitingListPatient {
  id: string;
  patientId: string;
  name: string;
  age: string;
  gender: string;
  services: string[];
  orderIds: string[];
  accessionNumbers: string[];
  provider: string;
  account: string;
  incomplete: number;
  completed: number;
  validated: number;
}

export interface WaitingListGroup {
  id: string;
  label: string;
  patients: WaitingListPatient[];
}

export const WAITING_LIST_STATUS = {
  incomplete: 11,
  completed: 0,
  validated: 0,
} as const;

export const WAITING_LIST_GROUPS: WaitingListGroup[] = [
  {
    id: "other-report",
    label: "Other Report",
    patients: [
      {
        id: "p74",
        patientId: "#74",
        name: "vaibhav 1",
        age: "0 years",
        gender: "M",
        services: ["SPIROMETRY"],
        orderIds: ["120"],
        accessionNumbers: ["000114126"],
        provider: "Dr Catherine Coleman...",
        account: "Amazon",
        incomplete: 1,
        completed: 0,
        validated: 0,
      },
      {
        id: "p75",
        patientId: "#75",
        name: "vaibhav",
        age: "0 years",
        gender: "M",
        services: ["SPIROMETRY"],
        orderIds: ["121"],
        accessionNumbers: ["000114127"],
        provider: "Dr Catherine Coleman...",
        account: "Amazon",
        incomplete: 1,
        completed: 0,
        validated: 0,
      },
      {
        id: "p24",
        patientId: "#24",
        name: "dummy",
        age: "0 years",
        gender: "M",
        services: [
          "SPIROMETRY",
          "SPIROMETRY",
          "SPIROMETRY",
          "SPIROMETRY",
          "SPIROMETRY",
        ],
        orderIds: ["122", "119"],
        accessionNumbers: ["000114128", "000114125"],
        provider: "Dr Catherine Coleman...",
        account: "Amazon",
        incomplete: 1,
        completed: 0,
        validated: 0,
      },
    ],
  },
];
