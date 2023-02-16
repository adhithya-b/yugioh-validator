import React, { useState } from "react";
import "./Validations.css";
import LoadingSpinner from "../utils/LoadingSpinner/LoadingSpinner";

function Validations(props) {
  const [clicked, setClicked] = useState("Copy");

  const ValidationList = () => (
    <div>
      <div className="List-div">
        <ul class="text-gray-500 list-disc list-inside dark:text-gray-400">
          {props.strings.map((s) => (
            <li>{s}</li>
          ))}
        </ul>
      </div>
      {props.strings.length === 0 ? (
        <p></p>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded-full"
          onClick={copyListToClipboard}
        >
          {clicked}
        </button>
      )}
    </div>
  );

  const copyListToClipboard = () => {
    const textToCopy = props.strings.join("\n");
    navigator.clipboard.writeText(textToCopy);
    setClicked("Copied!");
  };

  return <div>{props.loading ? <LoadingSpinner /> : <ValidationList />}</div>;
}

export default Validations;
