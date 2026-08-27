import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";

import type {
  DiaryEntry,
  DiaryEntryForm,
  Weather,
  Visibility,
} from "./types.ts";

import diaryService from "./services/diaryService.ts";
import axios from "axios";

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [visibility, setVisibility] = useState<Visibility>("great");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    diaryService.getAll().then((initialEntries) => {
      setDiaryEntries(initialEntries);
    });
  }, []);

  const handleAddDiaryEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const newEntry: DiaryEntryForm = {
      date,
      weather,
      visibility,
      comment,
    };

    diaryService
      .create(newEntry)
      .then((createdEntry) => {
        setDiaryEntries(diaryEntries.concat(createdEntry));

        setDate("");
        setWeather("sunny");
        setVisibility("great");
        setComment("");
        setError("");
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          setError("Incorrect Visibility: " + newEntry.visibility);
        } else {
          setError("An unknown error occurred");
        }
      });
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      <h2>Add new diary entry</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <form onSubmit={handleAddDiaryEntry}>
        <div>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>

        <div>
          Weather:{" "}
          <input
            type="text"
            value={weather}
            onChange={(event) => setWeather(event.target.value as Weather)}
          />
        </div>

        <div>
          Visibility:{" "}
          <input
            type="text"
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
          />
        </div>

        <div>
          <label>
            Comment:
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>

        <button type="submit">Add</button>
      </form>

      <h2>Diary entries</h2>

      {diaryEntries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>Weather: {entry.weather}</p>
          <p>Visibility: {entry.visibility}</p>
          <p>Comment: {entry.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
