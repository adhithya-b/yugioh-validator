import "./Edopro.css";
import React, { useState } from "react";
import Validations from "../validations/Validations";

function Edopro() {
  const [textValue, setTextValue] = useState("");
  const [data, setData] = useState([]);
  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/validateDeck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deckType: "edopro",
        decklist: textValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div class="flex justify-center">
        <form class="mb-3 xl:w-96" onSubmit={handleSubmit}>
          <label class="form-label inline-block mb-2 text-white">
            Enter Decklist:
          </label>
          <textarea
            class="
                form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
            rows="15"
            placeholder="Pot of Greed x3"
            value={textValue}
            onChange={handleTextChange}
          ></textarea>

          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded-full"
            type="submit"
            value="Submit"
          >
            Validate
          </button>
        </form>
      </div>

      <Validations strings={data} />
    </div>
  );
}

export default Edopro;
