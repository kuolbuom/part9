import express from "express";

import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";

const app = express();

app.use(express.json());

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

//exercises calculator endpoint
//req = request — contains data sent by the client.
//res = response — used to send data back to the client.
app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  // Check if parameters exist
  if (!daily_exercises || target === undefined) {
    return res.status(400).json({
      error: "parameters missing",
    });
  }

  // Check that dailyHours is an array
  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const targetNumber = Number(target);
  const dailyHoursNumbers = daily_exercises.map(Number);

  // Check that all values are numbers
  if (isNaN(targetNumber) || dailyHoursNumbers.some((hour) => isNaN(hour))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const result = calculateExercises(dailyHoursNumbers, targetNumber);

  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
