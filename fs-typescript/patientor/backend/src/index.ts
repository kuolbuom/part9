import express from "express";
import diagnosesService from "./services/diagnosesService.ts";
import patientRouter from "./routes/patients.ts";

const app = express();
app.use(express.json());

const PORT = 3000;

//get ping api
app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

// GET /api/diagnoses
app.get("/api/diagnoses", (_req, res) => {
  res.send(diagnosesService.getDiagnoses());
});

app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
