import React from "react";
import { useParams, useNavigate } from "react-router";
import "../styling/DetailedView.css";
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
import { useState, useEffect } from 'react'
import {
  LineChart,BarChart, Bar,  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function DetailedView() {
 const { code } = useParams()
  const [data, setData] = useState([]); 
  const navigate = useNavigate()
  
  // --- Fetch data for this specific country on load ---
  useEffect(() => {
    const query = makeQuery(code, 1950, 2025);
    callAPI(query).catch(console.error);
  }, [code]);

  // --- Build the query for one country over a year range ---
  const makeQuery = (countryCode, startYear, endYear) => {
    const years = `${startYear}:${endYear}`;
    const ages = "0:100"; // full range of ages

    // sex=0,1,2 for both/male/female
    const query = `https://api.census.gov/data/timeseries/idb/1year?get=NAME,GENC,YR,POP,SEX&YR=${years}&AGE=${ages}&SEX=0,1,2&for=genc+standard+countries+and+areas:${countryCode}&key=${ACCESS_KEY}`;
    return query;
  };

  // --- Call API and summarize results ---
  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const json = await response.json();
      setData(json);
         // Redirect if API returned an error or invalid format
      if (!Array.isArray(json) || json.length < 2) {
        navigate("/not-found", { replace: true });
        return;
      }


    } catch (err) {
      console.error("Failed to fetch/parse API:", err);
      navigate("/not-found", { replace: true }); // redirect on fetch error
    }
  };

  // --- Transform API response into summarized yearly data ---
  const summarizeData = (data) => {
  if (!Array.isArray(data) || data.length < 2) return [];

  // header row (first element)
  const header = data[0].map((h) => String(h).trim());

  // dynamic index lookup (fallback to -1 if not found)
  const idxName = header.indexOf("NAME");
  const idxGENC = header.indexOf("GENC");
  const idxYR = header.indexOf("YR");
  const idxPOP = header.indexOf("POP");
  const idxSEX = header.indexOf("SEX");

  // If essential columns are missing, bail out safely
  if (idxName === -1 || idxGENC === -1 || idxYR === -1 || idxPOP === -1 || idxSEX === -1) {
    console.warn("summarizeData: unexpected header", header);
    return [];
  }

  const rows = data.slice(1);

  // group by country-code + year
  const grouped = rows.reduce((acc, row) => {
    // make sure row is array-like
    if (!Array.isArray(row)) return acc;

    const country = row[idxName];
    const code = row[idxGENC];
    const year = Number(row[idxYR]);
    const pop = Number(row[idxPOP]) || 0;
    const sex = Number(row[idxSEX]);

    // ignore invalid years
    if (!Number.isFinite(year)) return acc;

    const key = `${String(code)}_${year}`;

    if (!acc[key]) {
      acc[key] = {
        country: country ?? String(code),
        code: String(code),
        year,
        malePop: 0,
        femalePop: 0,
        totalPop: 0,
      };
    }

    if (sex === 1) acc[key].malePop += pop;
    else if (sex === 2) acc[key].femalePop += pop;
    else if (sex === 0) acc[key].totalPop += pop;
    // If API ever uses other sex codes, they are ignored here.

    return acc;
  }, {});

  // convert grouped -> array and compute percentages (as numbers)
  const result = Object.values(grouped).map((c) => {
    const total = c.totalPop || c.malePop + c.femalePop;
    const malePct = total > 0 ? (c.malePop / total) * 100 : 0;
    const femalePct = total > 0 ? (c.femalePop / total) * 100 : 0;

    return {
      country: c.country,
      code: c.code,
      year: c.year,
      population: total,
      // round percentages to 1 decimal place for convenience
      male: Number(malePct.toFixed(1)),
      female: Number(femalePct.toFixed(1)),
    };
  });

  // sort ascending by year (useful for charts)
  result.sort((a, b) => a.year - b.year);

  return result;
};
const ageDataFunction = (data) => {
  if (!Array.isArray(data) || data.length < 2) return [];

  const header = data[0];
  const idxAGE = header.indexOf("AGE");
  const idxPOP = header.indexOf("POP");
  const idxSEX = header.indexOf("SEX");

  if (idxAGE === -1 || idxPOP === -1 || idxSEX === -1) return [];

  const rows = data.slice(1);
  const ageData = [];

  for (let age = 0; age <= 100; age++) {
    // sum POP for all sexes
    const totalPop = rows
      .filter((r) => Number(r[idxAGE]) === age)
      .reduce((sum, r) => sum + Number(r[idxPOP] || 0), 0);

    ageData.push({
      age,
      population: totalPop,
    });
  }

  return ageData;
};

const chart1Data = summarizeData(data)  
const latest = chart1Data[chart1Data.length - 1]; // most recent year
const ageData = ageDataFunction(data); 

console.log(data)
  
  return (
    <div className="detailed-view">

      {/* Main Info Section */}
      <div className="info-section">
        <h1 className="country-name">{latest?latest.country:""}</h1>

        <div className="detail-item">
          <span className="label">Year:</span>
          <span className="value">{latest?latest.year: ""}</span>
        </div>

        <div className="detail-item">
          <span className="label">Total Population:</span>
          <span className="value">{latest?latest.population.toLocaleString(): ""}</span>
        </div>

        <div className="gender-split">
          <h3>Gender Split</h3>
          <div className="gender-bar">
            <div
              className="male-bar"
              style={{ width: `${latest?latest.male: "1"}%` }}
              title={`male: ${latest?latest.male: "1"}%`}
            />
            <div
              className="female-bar"
              style={{ width: `${latest?latest.female: "1"}%` }}
              title={`Female: ${latest?latest.female: "1"}%`}
            />
          </div>
          <div className="gender-labels">
            <span>♂ {`${latest?latest.male: ""}`}%</span>
            <span>♀ {`${latest?latest.female: ""}`}%</span>
          </div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="graphs-section">
        <div className="chart-card">
          <h2>Population Change Over Time</h2>
      <div className="chart-container">
        <h2>Population Over Time</h2>
        {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chart1Data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) =>
                value >= 1_000_000_000
                  ? `${(value / 1_000_000_000).toFixed(1)}B`
                  : `${(value / 1_000_000).toFixed(0)}M`
              }
              domain={['auto', 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]} // percentage scale
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value, name) =>
                name.includes('%')
                  ? `${value.toFixed(1)}%`
                  : value >= 1_000_000_000
                  ? `${(value / 1_000_000_000).toFixed(1)}B`
                  : `${(value / 1_000_000).toFixed(0)}M`
              }
            />
            <Legend />

            {/* Population line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="population"
              stroke="#7ED321"
              name="Total Population"
              strokeWidth={2}
              dot={false}
            />

            {/* Male % */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="male"
              stroke="#4A90E2"
              name="Male %"
              strokeWidth={2}
              dot={false}
            />

            {/* Female % */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="female"
              stroke="#E94E77"
              name="Female %"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
        </div>

        <div className="chart-card">
          <h2>Age Distribution</h2>
          <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
              <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "bottom", offset: -10 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(1)}M`
                      : `${(v / 1_000).toFixed(0)}K`
                  }
                  label={{
                    value: "Population",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                  }}
                />
                <Tooltip
                  formatter={(value) =>
                    value >= 1_000_000
                      ? `${(value / 1_000_000).toFixed(1)}M`
                      : `${(value / 1_000).toFixed(0)}K`
                  }
                />
                <Legend />
                <Bar dataKey="population" fill="#7ED321" name="Population" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}