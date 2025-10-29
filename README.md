# Web Development Project 5 - *Name of App Here*

Submitted by: **Sebastian Cruz**

This web app: **interactive web app that visualizes global population data. Users can filter by country, age range, and sex, view summary statistics like total and average population, and explore detailed tables of population breakdowns. The app highlights male and female distributions with percentages and provides a clean, dashboard-style interface for easy data exploration**

Time spent: **4** hours spent in total

## Required Features

The following **required** functionality is completed:

- [X] **The site has a dashboard displaying a list of data fetched using an API call**
  - The dashboard should display at least 10 unique items, one per row
  - The dashboard includes at least two features in each row
- [X] **`useEffect` React hook and `async`/`await` are used**
- [ ] **The app dashboard includes at least three summary statistics about the data** 
  - The app dashboard includes at least three summary statistics about the data, such as:
    - *insert details here*
- [X] **A search bar allows the user to search for an item in the fetched data**
  - The search bar **correctly** filters items in the list, only displaying items matching the search query
  - The list of results dynamically updates as the user types into the search bar
- [X] **An additional filter allows the user to restrict displayed items by specified categories**
  - The filter restricts items in the list using a **different attribute** than the search bar 
  - The filter **correctly** filters items in the list, only displaying items matching the filter attribute in the dashboard
  - The dashboard list dynamically updates as the user adjusts the filter

The following **optional** features are implemented:

- [X] Multiple filters can be applied simultaneously
- [X] Filters use different input types
  - e.g., as a text input, a dropdown or radio selection, and/or a slider
- [X] The user can enter specific bounds for filter values


## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='/public/Video Walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with LiceCap

## Notes

While building the app, I faced several challenges.

 Fetching data from the Census API required handling CORS issues and securely managing the API key. 
 
 Summarizing the raw data was tricky, especially combining male, female, and total populations and calculating percentages dynamically.
 
  Implementing controlled filters for age, sex, and country search also required careful state management with React hooks. 
  
  Finally, designing a layout that allowed summary statistics and the data table to be visible simultaneously, while keeping the interface interactive and visually appealing, took some experimentation with responsive styling and fixed sidebar navigation

## License

    Copyright [2025] [Sebastian Cruz L]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
