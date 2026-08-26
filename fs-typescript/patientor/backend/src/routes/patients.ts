import express from "express";

import { z } from "zod";

import patientsService from "../services/patientsService.ts";

import parseNewPatient from "../utils.ts";

const router = express.Router();

//get route
router.get("/", (_req, res) => {
  res.send(patientsService.getNonSensitivePatients());
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
export default router;
