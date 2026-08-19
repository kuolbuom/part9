import express from "express";

import { calculateBmi } from "./bmiCalculator.ts";

const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

//BMI calculator endpoint
app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  //1. First check: are the parameters missing?
  if (!height || !weight) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const heightNumber = Number(height);
  const weightNumber = Number(weight);

  //2. Second check: are the provided values actually numbers?
  if (isNaN(heightNumber) || isNaN(weightNumber)) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const bmi = calculateBmi(heightNumber, weightNumber);

  return res.json({
    weight: weightNumber,
    height: heightNumber,
    bmi,
  });
});
const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
