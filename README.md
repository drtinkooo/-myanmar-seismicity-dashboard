🇲🇲 Myanmar Live Seismicity Dashboard

An automated, real-time dashboard for monitoring and analyzing seismic activity across the Myanmar region (including the Sagaing Fault). This project visualizes live earthquake data fetched directly from the USGS API and overlays major tectonic lineaments.

(Note: Add a screenshot of your dashboard here and name it https://www.google.com/search?q=preview.png)

🌟 Key Features

🚀 Real-Time Data Integration

Live USGS Feed: Automatically fetches earthquake data for the past 365 days every time the dashboard loads.

Dynamic Updates: The dashboard refreshes its dataset without requiring manual file uploads or static data.js updates.

Auto-Sync: Checks for new data periodically (every 15 minutes) while the page is open.

🗺️ Interactive Geospatial Visualization

Leaflet.js Map: Fully interactive map centered on Myanmar.

Magnitude Scaling: Earthquake markers are sized and colored dynamically based on magnitude (e.g., Red for M 6+, Blue for < M 5).

Tectonic Overlay: Displays major fault lines and tectonic boundaries sourced from the Myanmar Tectonic Map 2011.

Popups: Click on any event to see detailed info (Magnitude, Location, Depth, Date).

📊 Statistical Analysis & Charts

Timeline Chart: Visualizes earthquake frequency over time to identify swarms or quiet periods.

Magnitude Distribution: Doughnut chart showing the proportion of small vs. large events.

Key Metrics: Instant calculation of:

Total event count (Past Year).

Maximum recorded magnitude.

Count of significant earthquakes (M ≥ 5.0).

Average focal depth.

⚡ Performance & Design

Dark Mode UI: Modern, responsive interface optimized for data visibility.

No Build Step: Built with pure HTML/CSS/JS. No Node.js, Webpack, or complex backend required.

🛠️ Technology Stack

Component

Technology

Description

Frontend

HTML5, CSS3

Semantic structure and responsive flexbox/grid layout.

Logic

JavaScript (ES6+)

Fetch API for async data retrieval and DOM manipulation.

Mapping

Leaflet.js

Open-source interactive maps.

Charts

Chart.js

Canvas-based data visualization.

Basemap

CARTO

CartoDB Dark Matter tiles for high-contrast visualization.

📂 Project Structure

myanmar-seismicity-dashboard/
├── index.html      # Main application structure
├── styles.css      # Dark theme styling and layout
├── app.js          # Core logic (API fetch, Map rendering, Charts)
├── README.md       # Project documentation
└── preview.png     # (Optional) Screenshot for GitHub repo


Note: The data.js file has been removed as the project now uses live API fetching.

⚙️ Configuration & Data Sources

1. Earthquake Data (USGS API)

The dashboard queries the USGS FDSN Event Web Service with the following parameters:

Format: geojson

Timeframe: NOW back to NOW - 1 Year

Region (Myanmar Bounding Box):

Longitude: 92.0°E to 101.2°E

Latitude: 9.5°N to 28.5°N

Minimum Magnitude: 2.5

To modify these settings, edit the CONFIG object in app.js:

const CONFIG = {
    endpoint: "[https://earthquake.usgs.gov/fdsnws/event/1/query](https://earthquake.usgs.gov/fdsnws/event/1/query)",
    bbox: {
        minLon: 92.0, 
        maxLon: 101.2, 
        minLat: 9.5, 
        maxLat: 28.5
    },
    minMag: 2.5
};


2. Tectonic Data

Tectonic lineaments are loaded from an external GeoJSON file:

Source: Myanmar Tectonic Map 2011

URL: Defined in app.js as CONFIG.tectonicUrl.

🚀 How to Run Locally

Clone the repository:

git clone [https://github.com/drtinkooo/sagaing-fault-seismicity-dashboard.git](https://github.com/drtinkooo/sagaing-fault-seismicity-dashboard.git)


Open the project:
Simply open index.html in any modern web browser (Chrome, Firefox, Edge, Safari).

Tip: For the best experience, use a local server (like Live Server in VS Code) to avoid CORS issues with some strict browsers, although the APIs used generally support direct access.

👤 Author

Tin Ko Oo

Affiliation: Mahidol University, Thailand

GitHub: @drtinkooo

Focus: Seismic Hazard Analysis, Earth Science Visualization

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments

USGS Earthquake Hazards Program for the public API.

Myanmar Geosciences Society for tectonic reference data.

OpenStreetMap & CARTO for map tiles.
