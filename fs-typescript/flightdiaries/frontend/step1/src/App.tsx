import { useState, useEffect } from "react";

import type { DiaryEntry } from "./types.ts";
import diaryService from "./services/diaryService.ts";
const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]); //starts empty.

  useEffect(() => {
    //gets the data.
    //axios.get<DiaryEntry[]>:
    diaryService.getAll().then((response) => {
      //puts the four diaries into state. is important for TypeScript because it tells Axios that the response is an array of your DiaryEntry type.
      setDiaryEntries(response);
    });
  }, []);

  console.log("Diary Entries:", diaryEntries);

  return (
    <div>
      <h1>Flight Diaries</h1>

      {diaryEntries.map((entry) => (
        <div key={entry.id}>
          <h2>{entry.date}</h2>
          <p>Weather: {entry.weather}</p>
          <p>Visibility: {entry.visibility}</p>
          <p>Comment: {entry.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
