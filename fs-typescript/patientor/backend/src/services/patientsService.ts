import type { NonSensitivePatient } from "../types.ts";
import patients from "../../data/patients.ts";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...patient }) => patient);
};

export default {
  getNonSensitivePatients,
};
