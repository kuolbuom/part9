import axios from "axios";
import type { DiaryEntry, DiaryEntryForm } from "../types.ts";

const baseUrl = "/api/diaries";

const getAll = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  console.log("Response from getAll:", response);
  return response.data;
};

const create = async (newEntry: DiaryEntryForm): Promise<DiaryEntry> => {
  const response = await axios.post<DiaryEntry>(baseUrl, newEntry);
  return response.data;
};

export default {
  getAll,
  create,
};
