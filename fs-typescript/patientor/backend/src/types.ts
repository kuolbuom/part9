import { z } from "zod";

export interface Diagnosis {
  code: string;
  name: string;
  //Notice that some objects have: "latin": "..." and some do not. That is exactly why we use: latin?: string;
  latin?: string;
}

export const Gender = {
  Male: "male",
  Female: "female",
  Other: "other",
} as const;

//Then create the Gender type:
export type Gender = (typeof Gender)[keyof typeof Gender];

//health check rating
export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

export type HealthCheckRating =
  (typeof HealthCheckRating)[keyof typeof HealthCheckRating];

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

//health check rating Schema
export const HealthCheckRatingSchema = z.union([
  z.literal(HealthCheckRating.Healthy),
  z.literal(HealthCheckRating.LowRisk),
  z.literal(HealthCheckRating.HighRisk),
  z.literal(HealthCheckRating.CriticalRisk),
]);

//base entry Schema
const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

//new entry schema
export const NewEntrySchema = z.union([
  BaseEntrySchema.extend({
    type: z.literal("Hospital"),
    discharge: z.object({
      date: z.iso.date(),
      criteria: z.string(),
    }),
  }),
  BaseEntrySchema.extend({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string(),
    sickLeave: z
      .object({
        startDate: z.iso.date(),
        endDate: z.iso.date(),
      })
      .optional(),
  }),
  BaseEntrySchema.extend({
    type: z.literal("HealthCheck"),
    healthCheckRating: HealthCheckRatingSchema,
  }),
]);

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: number;
}

export type Entry =
  | OccupationalHealthcareEntry
  | HospitalEntry
  | HealthCheckEntry;

export type NewEntry = z.infer<typeof NewEntrySchema>;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
