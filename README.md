# Web Development Project 6 - *WorldCensus API*

Submitted by: **Sebastian Cruz**

This web app: **interactive web app that visualizes global population data. Users can filter by country and age range, view, and sort by population. Summary statistics like total and average population, and explore detailed tables of population breakdowns. The app highlights male and female distributions with percentages and provides a clean, dashboard-style interface for easy data exploration**

Time spent: **8** hours spent in total

The following **required** functionality is completed:

- [X] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view
  - The same sidebar is displayed in detail view as in dashboard view
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
- [X] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  -  *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*
- [X] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
  - Each chart should describe a different aspect of the dataset


The following **optional** features are implemented:

- [ ] The site’s customized dashboard contains more content that explains what is interesting about the data 
  - e.g., an additional description, graph annotation, suggestion for which filters to use, or an additional page that explains more about the data
- [ ] The site allows users to toggle between different data visualizations
  - User should be able to use some mechanism to toggle between displaying and hiding visualizations 

  
The following **additional** features are implemented:

* [ ] List anything else that you added to improve the site's functionality!


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
