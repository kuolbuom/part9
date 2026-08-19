import { isNotNumber } from "./utils.ts";

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyHours: number[], target: number): Result => {
  // calculates the number of measured days
  //the number of days
  const periodLength = dailyHours.length;

  // filter the days greater than zero and count the training days
  //the number of training days
  const trainingDays = dailyHours.filter((day) => day > 0).length;

  // calculate the total amount of hours
  //the original target value
  const totalHours = dailyHours.reduce((sum, day) => sum + day, 0);

  // calculate the average amount of hours spent on training
  //the calculated average time
  const average = totalHours / periodLength;

  // calculate whether the target was reached
  //boolean value describing if the target was reached
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average < target * 0.75) {
    rating = 1;
    ratingDescription = "You need to exercise more";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "Excellent";
  }

  //return the Result
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

//command-line
try {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    throw new Error("Please provide a target and at least one exercise hour");
  }

  if (args.some(isNotNumber)) {
    throw new Error("Arguments must be numbers");
  }

  const target = Number(args[0]);

  const dailyHours = args.slice(1).map(Number);

  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Error:", error.message);
  }
}
