export interface Diagnosis {
  code: string;
  name: string;
  //Notice that some objects have: "latin": "..." and some do not. That is exactly why we use: latin?: string;
  latin?: string;
}
