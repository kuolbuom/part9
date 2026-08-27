import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";

import type {
  DiaryEntry,
  DiaryEntryForm,
  Weather,
  Visibility,
} from "./types.ts";

import diaryService from "./services/diaryService.ts";

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [visibility, setVisibility] = useState<Visibility>("great");
  const [comment, setComment] = useState("");

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

    diaryService.create(newEntry).then((createdEntry) => {
      setDiaryEntries(diaryEntries.concat(createdEntry));
    });

    setDate("");
    setWeather("sunny");
    setVisibility("great");
    setComment("");
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      <h2>Add new diary entry</h2>

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
          <label>
            Weather:
            <select
              value={weather}
              onChange={(event) => setWeather(event.target.value as Weather)}
            >
              <option value="sunny">Sunny</option>
              <option value="rainy">Rainy</option>
              <option value="cloudy">Cloudy</option>
              <option value="stormy">Stormy</option>
              <option value="windy">Windy</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Visibility:
            <select
              value={visibility}
              onChange={(event) =>
                setVisibility(event.target.value as Visibility)
              }
            >
              <option value="great">Great</option>
              <option value="good">Good</option>
              <option value="ok">OK</option>
              <option value="poor">Poor</option>
            </select>
          </label>
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
