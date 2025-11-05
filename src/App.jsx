import { useState, useEffect } from 'react'
import './App.css'
import Card from "./components/Card.jsx";
import DataList from "./components/DataList.jsx"; 


const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
//API INFO HERE:
//https://www.census.gov/data/developers/data-sets/international-database.html
function App() {
  const [data, setData] = useState([]); 
  const [search, setSearch] = useState("");
  const [population, setPopulation] = useState(0); 
  const [numCountries, setNumCountries] = useState(0); 
  const [avgPop, setAvgPop] = useState(0); 
  const [sortBy, setSortBy] = useState("population-desc");
  const [year, setYear] = useState(2023); // default year

    // Controlled state for age range
  const [ageRange, setAgeRange] = useState({ min: 0, max: 100 });

  //Function/useEffect to reload the data upon search/filter changes
  useEffect(() => {
    const query = makeQuery();
    callAPI(query).catch(console.error);
  }, [ageRange, year])

  //Function to call the API using the query
  const callAPI = async (query) => {
    try {
    const response = await fetch(query);
    const json = await response.json();
    const summarizedData = summarizeData(json);
    setData(summarizedData)
    }
    catch (err) {
    console.error("Failed to fetch/parse API:", err);
    alert("Error fetching data");
    }
  }

  //Function to make the query, should adapt to filters and searches
  const makeQuery = () => {
  const ageParam = `${ageRange.min}:${ageRange.max}`;
  const years = year;

  // Request all sexes (0 = both, 1 = male, 2 = female)
  const query = `https://api.census.gov/data/timeseries/idb/1year?get=NAME,GENC,POP,SEX&YR=${years}&AGE=${ageParam}&SEX=0,1,2&key=${ACCESS_KEY}`;
  
  return query;
  };

  //Function to summarize the data
const summarizeData = (data) => {
  const rows = data.slice(1); // Skip header row

  const grouped = rows.reduce((acc, row) => {
    const country = row[0]; // NAME
    const code = row[1]; // GENC (country code)
    const pop = Number(row[2]); // POP
    const sex = Number(row[3]); // SEX

    if (!acc[country]) {
      acc[country] = {
        country,
        code, // store GENC code
        malePop: 0,
        femalePop: 0,
        totalPop: 0,
      };
    }

    if (sex === 1) acc[country].malePop += pop;
    else if (sex === 2) acc[country].femalePop += pop;
    else if (sex === 0) acc[country].totalPop += pop;

    return acc;
  }, {});

  return Object.values(grouped).map((c) => {
    const total = c.totalPop || c.malePop + c.femalePop;
    const malePct = total > 0 ? ((c.malePop / total) * 100).toFixed(1) + "%" : "0%";
    const femalePct = total > 0 ? ((c.femalePop / total) * 100).toFixed(1) + "%" : "0%";

    return {
      country: c.country,
      code: c.code, // Include country code
      population: total,
      male: malePct,
      female: femalePct,
    };
  });
};

  //Filter data for search
  const filteredData = search !== ""
  ? data.filter(d => d.country.toLowerCase().includes(search.toLowerCase()))
  : data;

  //Summary statistics
 useEffect(() => {
  const totalPopulation = filteredData.reduce((acc, d) => acc + d.population, 0);
  const countriesCount = new Set(filteredData.map(d => d.country)).size;
  const average = countriesCount > 0 ? Math.round(totalPopulation / countriesCount) : 0;

  setPopulation(totalPopulation);
  setNumCountries(countriesCount);
  setAvgPop(average);
}, [filteredData]);
  

// helper: safely parse "48.5%" -> 48.5, or return NaN if not a percent string
const parsePercentString = (str) => {
  if (typeof str === "string" && str.includes("%")) {
    const n = parseFloat(str.replace("%", ""));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};

// helper: return percentage value (0..100) for male/female comparison
const getPercentageValue = (item, key) => {
  // key is "male" or "female"
  // 1) if the field is already a percent string (e.g. "48.5%"), use it
  const maybePercent = parsePercentString(item[key]);
  if (!Number.isNaN(maybePercent)) return maybePercent;

  // 2) if the field is a plain number but you have population or total counts,
  // compute percent = (value / total) * 100
  const rawVal = Number(item[key]);
  const total = Number(item.population) || Number(item.total) || (
    // fallback: if you stored malePop/femalePop numeric fields, compute total
    Number(item.malePop || 0) + Number(item.femalePop || 0)
  );

  if (Number.isFinite(rawVal) && total > 0) {
    return (rawVal / total) * 100;
  }

  // 3) fallback to 0 to avoid NaN during sorting
  return 0;
};

// Now the sortedData:
const sortedData = [...filteredData].sort((a, b) => {
  // numeric accessor for population (works if population is string or number)
  const parseNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // determine comparator key
  if (sortBy.startsWith("population")) {
    const aVal = parseNum(a.population);
    const bVal = parseNum(b.population);
    return sortBy.endsWith("-asc") ? aVal - bVal : bVal - aVal;
  }

  if (sortBy.startsWith("male")) {
    const aPct = getPercentageValue(a, "male");
    const bPct = getPercentageValue(b, "male");
    return sortBy.endsWith("-asc") ? aPct - bPct : bPct - aPct;
  }

  if (sortBy.startsWith("female")) {
    const aPct = getPercentageValue(a, "female");
    const bPct = getPercentageValue(b, "female");
    return sortBy.endsWith("-asc") ? aPct - bPct : bPct - aPct;
  }

  // fallback: sort by country name
  return a.country.localeCompare(b.country);
});
  

  return (
    <div>
      <h1>WorldCensus API</h1>
      
      <div className="card-row">
        <Card key={1} title="Total Population" data={population} />
        <Card key={2} title="Number of Countries" data={numCountries} />
        <Card key={3} title="Average Population" data={avgPop} />
      </div>
       <div className="filters">
        {/* Age Range Inputs */}
        <div className="filter-group">
          <div className="search-bar">
            <label>
              Year:
              <input
                type="number"
                min="1950"
                max="2100"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="filter-input"
              />
            </label>
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
               min={0}           
              max={100} 
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
              min={0}           
              max={100} 
              value={ageRange.max}
              onChange={(e) =>
                setAgeRange({ ...ageRange, max: Number(e.target.value) })
              }
              className="filter-input"
            />
          </label>
          <label>
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-input"
          >
            <option value="population-desc">Total Population (High → Low)</option>
            <option value="population-asc">Total Population (Low → High)</option>
            <option value="male-desc">Male % (High → Low)</option>
            <option value="male-asc">Male % (Low → High)</option>
            <option value="female-desc">Female % (High → Low)</option>
            <option value="female-asc">Female % (Low → High)</option>
          </select>
        </label>
        
        </div>
        <></>
      </div>
      <DataList data={sortedData} />
    </div>  
  )
}

export default App
