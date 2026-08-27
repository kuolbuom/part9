import axios from "axios";
import type { DiaryEntry } from "../types.ts";

const baseUrl = "/api/diaries";

const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  console.log("Response from getAll:", response);
  return response.data;
};

export default {
  getAll,
};
