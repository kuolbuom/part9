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
          setError("Failed to add diary entry");
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
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>

        <label>
          weather:
          <input
            type="radio"
            name="weather"
            value="sunny"
            checked={weather === "sunny"}
            onChange={(event) => setWeather(event.target.value as Weather)}
          />
          sunny
        </label>

        <label>
          <input
            type="radio"
            name="weather"
            value="rainy"
            checked={weather === "rainy"}
            onChange={(event) => setWeather(event.target.value as Weather)}
          />
          rainy
        </label>

        <label>
          <input
            type="radio"
            name="weather"
            value="cloudy"
            checked={weather === "cloudy"}
            onChange={(event) => setWeather(event.target.value as Weather)}
          />
          cloudy
        </label>

        <label>
          <input
            type="radio"
            name="weather"
            value="stormy"
            checked={weather === "stormy"}
            onChange={(event) => setWeather(event.target.value as Weather)}
          />
          stormy
        </label>

        <label>
          <input
            type="radio"
            name="weather"
            value="windy"
            checked={weather === "windy"}
            onChange={(event) => setWeather(event.target.value as Weather)}
          />
          windy
        </label>
        <br />

        <label>
          Visibility:
          <input
            type="radio"
            name="visibility"
            value="great"
            checked={visibility === "great"}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
          />
          great
        </label>

        <label>
          <input
            type="radio"
            name="visibility"
            value="good"
            checked={visibility === "good"}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
          />
          good
        </label>

        <label>
          <input
            type="radio"
            name="visibility"
            value="ok"
            checked={visibility === "ok"}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
          />
          ok
        </label>

        <label>
          <input
            type="radio"
            name="visibility"
            value="poor"
            checked={visibility === "poor"}
            onChange={(event) =>
              setVisibility(event.target.value as Visibility)
            }
          />
          poor
        </label>
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
