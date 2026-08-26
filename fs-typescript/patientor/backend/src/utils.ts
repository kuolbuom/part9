import { z } from "zod";
import { Gender, type NewPatient } from "./types.ts";

const parseNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatient: NewPatient = {
      //z.string().min(1).parse(""). This will throw an error if the string is empty. The same goes for the other fields.
      name: z.string().min(1).parse(object.name),
      dateOfBirth: z.iso.date().parse(object.dateOfBirth),
      ssn: z.string().min(1).optional().parse(object.ssn),
      gender: z.enum(Gender).parse(object.gender),
      occupation: z.string().min(1).parse(object.occupation),
    };

    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};

export default parseNewPatient;
