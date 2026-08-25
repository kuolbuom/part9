import patients from "../../data/patients.ts";
import type { NewPatient, Patient, NonSensitivePatient } from "../types.ts";

import { v1 as uuid } from "uuid";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...patient }) => patient);
};

//adding new patient to the list
const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);

  return newPatient;
};

export default {
  getNonSensitivePatients,
  addPatient,
};
