import express from "express";

import { z } from "zod";

import patientsService from "../services/patientsService.ts";

import parseNewPatient, { parseNewEntry } from "../utils.ts";

const router = express.Router();

//get route
router.get("/", (_req, res) => {
  res.send(patientsService.getNonSensitivePatients());
});

router.get("/:id", (req, res) => {
  const patient = patientsService.getPatientById(req.params.id);

  if (!patient) {
    res.status(404).send({ error: "Patient not found" });
    return;
  }

  res.send(patient);
});

// POST route
router.post("/", (req, res) => {
  try {
    const newPatient = parseNewPatient(req.body);

    const addedPatient = patientsService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: "unknown error" });
    }
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const patient = patientsService.getPatientById(req.params.id);

    if (!patient) {
      res.status(404).send({ error: "Patient not found" });
      return;
    }

    const newEntry = parseNewEntry(req.body);
    const addedEntry = patientsService.addEntry(patient.id, newEntry);

    res.status(201).json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else if (
      error instanceof Error &&
      error.message === "Patient not found"
    ) {
      res.status(404).send({ error: "Patient not found" });
    } else {
      res.status(400).send({ error: "unknown error" });
    }
  }
});

export default router;
