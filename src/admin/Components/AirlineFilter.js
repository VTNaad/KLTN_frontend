import React, { useState } from "react";
import "../Style/filter.scss";

const AirlineFilter = ({ onFilter }) => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [minDepartureTime, setMinDepartureTime] = useState("");
  const [maxArrivalTime, setMaxArrivalTime] = useState("");
  //   const [minTax, setMinTax] = useState("");
  const [maxTax, setMaxTax] = useState("");

  const handleFilter = () => {
    onFilter({
      departure,
      destination,
      //   minTax,
      maxTax,
      minDepartureTime,
      maxArrivalTime,
    });
  };

  return (
    <div className="filters-container">
      <div className="input-row">
        <input
          type="text"
          placeholder="Departure"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Min Departure Time"
          value={minDepartureTime}
          onChange={(e) => setMinDepartureTime(e.target.value)}
        />

        <input
          type="datetime-local"
          placeholder="Max Arrival Time"
          value={maxArrivalTime}
          onChange={(e) => setMaxArrivalTime(e.target.value)}
        />
        {/* <input
          type="number"
          placeholder="Min Tax"
          value={minTax}
          onChange={(e) => setMinTax(e.target.value)}
        /> */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxTax}
          onChange={(e) => setMaxTax(e.target.value)}
        />
      </div>
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default AirlineFilter;
