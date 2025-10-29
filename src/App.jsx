import { useState, useEffect } from 'react'
import './App.css'
import Card from "./components/Card.jsx";
import DataList from "./components/DataList.jsx"; 
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [data, setData] = useState([]); 
  const [search, setSearch] = useState("");

    // Controlled state for age range
  const [ageRange, setAgeRange] = useState({ min: 0, max: 100 });

  // Controlled state for sex
  // 0 = All, 1 = Male, 2 = Female
  const [sex, setSex] = useState(0);

  //Function/useEffect to reload the data upon search/filter changes
  useEffect(() => {
    const query = makeQuery();
    callAPI(query).catch(console.error);
  }, [sex, ageRange])

  //Function to call the API using the query
  const callAPI = async (query) => {
    try {
    const response = await fetch(query);
    const json = await response.json();
    const summarizedData = summarizeData(json,sex );
    setData(summarizedData)
    }
    catch (err) {
    console.error("Failed to fetch/parse API:", err);
    alert("Error fetching images");
    }
  }

  //Function to make the query, should adapt to filters and searches
  const makeQuery = () => {
    // Age range
    const ageParam = `${ageRange.min}:${ageRange.max}`; // e.g., "0:100"

    // Sex: 0 = All, 1 = Male, 2 = Female
    // For "All", we need "0,1,2" per Census API
    const sexParam = sex === 0 ? "0,1,2" : sex.toString();

    // Countries (example, you can make this dynamic too)
    // const countries = "BW,NO"; // Botswana and Norway
    //const forParam = `genc+standard+countries+and+areas:${countries}`;

    // Years (example: 2023 and 2024)
    const years = "2023,2024";

    // Construct full query
    const query = `https://api.census.gov/data/timeseries/idb/1year?get=NAME,GENC,POP&YR=${years}&AGE=${ageParam}&SEX=${sexParam}&key=${ACCESS_KEY}`;

    return query;
  };

  //Function to summarize the data
const summarizeData = (data, sexFilter) => {
  // Skip header row
  const rows = data.slice(1);

  // Group by country
  const grouped = rows.reduce((acc, row) => {
    const country = row[0]; // NAME
    const pop = Number(row[2]); // POP
    const sex = Number(row[5]); // SEX column: 0=both, 1=male, 2=female

    if (!acc[country]) {
      acc[country] = { country, male: 0, female: 0 };
    }

    // Add population to male/female
    if (sex === 1) acc[country].male += pop;
    else if (sex === 2) acc[country].female += pop;
    else if (sex === 0) {
      // Some API rows may have total in SEX column
      acc[country].male += pop / 2;
      acc[country].female += pop / 2;
    }

    return acc;
  }, {});

  // Build result array
  const result = [];

  Object.values(grouped).forEach((c) => {
    const total = c.male + c.female;

    if (sexFilter === 0) {
      // Both selected: show total and percentages
      result.push(
        { country: c.country, sex: "Total", population: total },
        { country: c.country, sex: "Male", population: ((c.male / total) * 100).toFixed(1) + "%" },
        { country: c.country, sex: "Female", population: ((c.female / total) * 100).toFixed(1) + "%" }
      );
    } else if (sexFilter === 1) {
      result.push({ country: c.country, sex: "Male", population: c.male });
    } else if (sexFilter === 2) {
      result.push({ country: c.country, sex: "Female", population: c.female });
    }
  });

  return result;
};

  //Summary statistics
  const population = sex === 0
    ? data
        .filter(d => d.sex === "Total") // only total rows
        .reduce((acc, d) => acc + d.population, 0)
    : data.reduce((acc, d) => acc + d.population, 0);

  // Number of unique countries
  const numCountries = new Set(data.map(d => d.country)).size;

  // Average population per country (based on totals if sex=0, or sum of selected sex)
  const avgPopulation = Math.round(population / numCountries)
  
const filteredData = search !== ""
  ? data.filter(d => d.country.toLowerCase().includes(search.toLowerCase()))
  : data;

useEffect(()=>{
  setData(filteredData)
}, [filteredData])
  console.log(data); 
  return (
    <div>
      <h1>WorldCensus API</h1>
      
      <div className="card-row">
        <Card key={1} title="Total Population" data={population} />
        <Card key={2} title="Number of Countries" data={numCountries} />
        <Card key={3} title="Average Population" data={avgPopulation} />
      </div>
       <div className="filters">
        {/* Age Range Inputs */}
        <div className="filter-group">
          <div className="search-bar">
            <label>
              Search Country:
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="filter-input"
                placeholder="Type country name..."
              />
            </label>
          </div>
          <label>
            Min Age:
            <input
              type="number"
              value={ageRange.min}
              onChange={(e) =>
                setAgeRange({ ...ageRange, min: Number(e.target.value) })
              }
              className="filter-input"
            />
          </label>
          <label>
            Max Age:
            <input
              type="number"
              value={ageRange.max}
              onChange={(e) =>
                setAgeRange({ ...ageRange, max: Number(e.target.value) })
              }
              className="filter-input"
            />
          </label>
        

        {/* Sex Selector */}          <label>
            Sex:
            <select
              value={sex}
              onChange={(e) => setSex(Number(e.target.value))}
              className="filter-input"
            >
              <option value={0}>Both(Sum)</option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>
          </label>
        </div>
      </div>
      <DataList data={data} />
    </div>  
  )
}

export default App
