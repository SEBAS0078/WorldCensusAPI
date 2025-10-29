import React from "react";
import "./Card.css";

export default function Card({ title, data }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <p className="card-data">{data}</p>
    </div>
  );
}
