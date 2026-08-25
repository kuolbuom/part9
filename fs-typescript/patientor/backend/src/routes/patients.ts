import express from "express";

import patientsService from "../services/patientsService.ts";

const router = express.Router();

//get route
router.get("/", (_req, res) => {
  res.send(patientsService.getNonSensitivePatients());
});

export default router;
