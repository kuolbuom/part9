// import { Gender, type NewPatient } from "./types.ts";

//Notice that we use: unknown instead of: any This is important because data from req.body should initially be treated as unknown.
// const isString = (text: unknown): text is string => {
//   return typeof text === "string" || text instanceof String;
// };

// const parseName = (name: unknown): string => {
//   if (!name || !isString(name) || name.length === 0) {
//     throw new Error("Incorrect or missing name");
//   }

//   return name;
// };

// const parseOccupation = (occupation: unknown): string => {
//   if (!isString(occupation) || occupation.length === 0) {
//     throw new Error("Incorrect or missing occupation");
//   }

//   return occupation;
// };

// const parseSsn = (ssn: unknown): string => {
//   if (!isString(ssn) || ssn.length === 0) {
//     throw new Error("Incorrect or missing SSN");
//   }

//   return ssn;
// };

// const isDate = (date: string): boolean => {
//   return Boolean(Date.parse(date));
// };

// const parseDate = (date: unknown): string => {
//   if (!date || !isString(date) || !isDate(date)) {
//     throw new Error("Incorrect or missing date: " + date);
//   }
//   return date;
// };
// const isGender = (param: unknown): param is Gender => {
//   return (Object.values(Gender) as unknown[]).includes(param);
// };

// const parseGender = (gender: unknown): Gender => {
//   if (!isGender(gender)) {
//     throw new Error("Incorrect or missing gender");
//   }

//   return gender;
// };

// export const toNewPatient = (object: unknown): NewPatient => {
//   if (
//     !object ||
//     typeof object !== "object" ||
//     !("name" in object) ||
//     !("dateOfBirth" in object) ||
//     !("ssn" in object) ||
//     !("gender" in object) ||
//     !("occupation" in object)
//   ) {
//     throw new Error("Incorrect or missing data");
//   }

//   return {
//     name: parseName(object.name),
//     dateOfBirth: parseDate(object.dateOfBirth),
//     ssn: parseSsn(object.ssn),
//     gender: parseGender(object.gender),
//     occupation: parseOccupation(object.occupation),
//   };
// };
