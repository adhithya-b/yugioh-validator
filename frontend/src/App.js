import React, { useState } from "react";
import "./App.css";
import Duelingbook from "./components/duelingbook/Duelingbook";
import Edopro from "./components/edopro/Edopro";

function App() {
  const [selectedButton, setSelectedButton] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">Yu-Gi-Oh Validator</h1>

        <div className="App-buttons">
          <div class="inline-flex">
            <button
              className={
                selectedButton === "edo"
                  ? "bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
                  : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
              }
              onClick={() => setSelectedButton("edo")}
            >
              EDOPro
            </button>
            <button
              className={
                selectedButton === "db"
                  ? "bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                  : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
              }
              onClick={() => setSelectedButton("db")}
            >
              Duelingbook
            </button>
          </div>
        </div>

        {selectedButton === "edo" && <Edopro />}

        {selectedButton === "db" && <Duelingbook />}
      </header>
    </div>
  );
}

export default App;
