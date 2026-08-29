import patients from "../../data/patients.ts";
import type {
  Entry,
  NewEntry,
  NewPatient,
  Patient,
  NonSensitivePatient,
} from "../types.ts";

import { v1 as uuid } from "uuid";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...patient }) => patient);
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

//adding new patient to the list
const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);

  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry) => {
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  } as Entry;

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getNonSensitivePatients,
  addPatient,
  getPatientById,
  addEntry,
};
