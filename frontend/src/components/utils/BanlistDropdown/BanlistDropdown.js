import React, { useState, useEffect } from "react";

function BanlistDropdown(props) {
  const [datesByYear, setDatesByYear] = useState({});

  const handleOptionChange = (event) => {
    props.setBanlist(event.target.value);
  };

  useEffect(() => {
    fetch("/getBanlists")
      .then((response) => response.json())
      .then((dates) => {
        dates = dates.sort((a, b) => new Date(a) - new Date(b));
        const datesByYearObj = {};
        dates.forEach((dateStr) => {
          const year = dateStr.substr(0, 4);
          if (!datesByYearObj[year]) {
            datesByYearObj[year] = [];
          }
          datesByYearObj[year].push(dateStr);
        });
        setDatesByYear(datesByYearObj);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <div className="relative inline-block w-full text-gray-700 py-2">
        <select
          id="dropdown-select"
          onChange={handleOptionChange}
          className="w-full py- px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
        <option disabled selected>Select a banlist.</option>
          {Object.keys(datesByYear).map((year) => (
            <optgroup key={year} label={year}>
              {datesByYear[year].map((dateStr) => (
                <option key={dateStr} value={dateStr}>
                  {dateStr}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M14.95 6.95l-4.586 4.586L9 10l5-5-1.414-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default BanlistDropdown;
