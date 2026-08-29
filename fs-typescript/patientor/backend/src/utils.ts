import {
  NewEntrySchema,
  NewPatientSchema,
  type NewEntry,
  type NewPatient,
} from "./types.ts";

const parseNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const parseNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};

export default parseNewPatient;
