import React, { useState } from "react";
import "../Style/filter.scss";

const TransactionFilter = ({ onFilter }) => {
  const [filterData, setFilterData] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filterData);
  };

  const handleReset = () => {
    setFilterData({
      type: "",
      startDate: "",
      endDate: "",
    });
    onFilter({});
  };

  return (
    <div className="filters-container">
      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <select
            name="type"
            value={filterData.type}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="hotel">Hotel</option>
            <option value="flight">Flight</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={filterData.startDate}
            onChange={handleChange}
            placeholder="From Date"
          />

          <input
            type="date"
            name="endDate"
            value={filterData.endDate}
            onChange={handleChange}
            placeholder="To Date"
          />
        </div>

        <div className="filterButtons">
          <button type="submit">Filter</button>
          {/* <button type="button" onClick={handleReset}>
            Reset
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default TransactionFilter;
