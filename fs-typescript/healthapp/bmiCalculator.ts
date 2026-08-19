import { isNotNumber } from "./utils.ts";

const calculateBmi = (height: number, weight: number) => {
  const heightInMeter = height / 100;
  const bmi = weight / (heightInMeter * heightInMeter);

  if (bmi < 18.5) {
    return "under weight";
  } else if (bmi < 25) {
    return "normal weight";
  } else if (bmi < 29) {
    return "over weight";
  } else {
    return "obese";
  }
};

//command-line
try {
  //this split out "node" and "calculateBmi" and leave only two arguments like "180" and "91"
  const args = process.argv.slice(2);

  //arguments length must be only two no more or less
  if (args.length < 2) {
    throw new Error("Please provide an arguments");
  }

  //checks whether extra. fore example, "node","bmiCalculator.ts", "180", "91","extra"
  if (args.length > 4) {
    throw new Error("Too many arguments");
  }

  //this some isNotNuber prevent any argument(s) which is not a number
  if (args.some(isNotNumber)) {
    throw new Error("Arguments must be numbers");
  }

  //remaining from slice are now converted to numbers
  const height = Number(args[0]);
  const weight = Number(args[1]);

  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Error:", error.message);
  }
}
