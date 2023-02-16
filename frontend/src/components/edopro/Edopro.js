import "./Edopro.css";
import React, { useState } from "react";
import Validations from "../validations/Validations";
import { Tooltip as ReactTooltip } from "react-tooltip";
import BanlistDropdown from "../utils/BanlistDropdown/BanlistDropdown";
import "react-tooltip/dist/react-tooltip.css";
import { AiFillQuestionCircle } from "react-icons/ai";

function Edopro() {
  const [textValue, setTextValue] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [banlist, setBanlist] = useState("");

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSubmit = (event) => {
    if (banlist === "") {
      event.preventDefault();
      alert("Please select a banlist before submitting.");
    } else {
      console.log(banlist);
      setLoading(true);
      setData([]);
      event.preventDefault();
      fetch("/validateDeck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deckType: "edopro",
          decklist: textValue,
          banlist: banlist,
        }),
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .then(() => setLoading(false))
        .catch((error) => console.error(error));
    }
  };

  const Title = () => {
    return <h3 className="flex justify-around"><p>Enter Decklist</p><AiFillQuestionCircle id="header" className={"mt-2 ml-2"}/></h3>
  }

  return (
    <div>
      <div class="flex justify-center">
        <form class="mb-3 xl:w-96" onSubmit={handleSubmit}>
          <div class="form-label inline-block mb-2 text-white">
            <Title />
          </div>
          <ReactTooltip
            anchorId="header"
            place="bottom"
            variant="info"
            className={"tooltip"}
            html='Enter a card name followed by the number of cards, ex: "Pot of Greed x3".<br />You can also use EDOPro to paste your deck list.<br />Go to Decks > YDKE > Export Plaintext'
          />
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

          <BanlistDropdown setBanlist={setBanlist} />
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded-full"
            type="submit"
            value="Submit"
          >
            Validate
          </button>
        </form>
      </div>

      <Validations strings={data} loading={loading} />
    </div>
  );
}

export default Edopro;
