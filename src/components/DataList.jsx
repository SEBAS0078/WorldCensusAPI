import React from "react";
import "./DataList.css";
import { Link } from "react-router";

export default function DataList({ data }) {
  // Ensure data is always an array
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="no-data">No data available.</p>;
  }
  console.log(data)

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
                <td key={j}>
                  {key === "country" ? (
                    <Link
                      to={`/country/${encodeURIComponent(item.code)}`}
                      className="country-link"
                    >
                      {item[key]}
                    </Link>
                  ) : (
                    item[key] !== undefined ? item[key] : "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
