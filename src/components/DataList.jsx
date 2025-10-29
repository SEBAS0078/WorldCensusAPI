import React from "react";
import "./DataList.css";

export default function DataList({ data }) {
  // Ensure data is always an array
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="no-data">No data available.</p>;
  }

  // Get all keys from the first item safely
  const headers = Object.keys(data[0] || {});

  return (
    <div className="data-list-container">
      <h2>Data Overview</h2>

      <table className="data-table">
        <thead>
          <tr>
            {headers.map((key) => (
              <th key={key}>{key.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              {headers.map((key, j) => (
                <td key={j}>{item[key] !== undefined ? item[key] : "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
