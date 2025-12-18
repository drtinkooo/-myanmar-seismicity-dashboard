# 🇲🇲 Myanmar Live Seismicity Dashboard

An automated, real-time dashboard for monitoring seismic activity across Myanmar.

## 📊 Live Data Integration
This dashboard no longer requires manual updates to `data.js`. It uses the **USGS FDSN API** to pull live earthquake data for the previous 365 days.

### Coverage
- **Bounding Box**: 92.0°E to 101.2°E | 9.5°N to 28.5°N (Full Myanmar Coverage)
- **Minimum Magnitude**: M 2.5+
- **Update Frequency**: Live on every page load.

## 🛠️ Tech Stack
- **Leaflet.js**: For interactive geospatial mapping.
- **Chart.js**: For statistical trend analysis.
- **USGS API**: Primary real-time data source.

## 👤 Author
**Tin Ko Oo** - Mahidol University