import patients from "../../data/patients.ts";
import type { NewPatient, Patient, NonSensitivePatient } from "../types.ts";

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

export default {
  getNonSensitivePatients,
  addPatient,
  getPatientById,
};
