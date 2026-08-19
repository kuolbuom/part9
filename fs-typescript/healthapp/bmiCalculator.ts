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
console.log(calculateBmi(180, 74));
