// =====================================================
// Sagaing Fault & Myanmar Seismicity Dashboard - LIVE
// =====================================================

const CONFIG = {
    // API Endpoint
    endpoint: "https://earthquake.usgs.gov/fdsnws/event/1/query",
    // Tectonic Data Source
    tectonicUrl: 'https://raw.githubusercontent.com/drtinkooo/myanmar-earthquake-archive/main/Myanmar_Tectonic_Map_2011.geojson',
    // Myanmar Bounding Box
    bbox: { minLon: 92.0, maxLon: 101.2, minLat: 9.5, maxLat: 28.5 }
};

let map, earthquakeLayer, tectonicLayer;
let timelineChart, magDistChart;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    initializeMap();
    
    // 1. Calculate Date Range (Past 365 Days)
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // 2. Fetch Data
    const quakes = await fetchEarthquakeData(oneYearAgo, now);
    
    if (quakes) {
        renderDashboard(quakes);
        document.getElementById('last-update').innerText = `Updated: ${now.toLocaleTimeString()}`;
    }

    // 3. Load Tectonic Lines
    await loadTectonicLines();
    
    // Hide loading screen
    document.getElementById('loading').classList.add('hidden');
}

// ------------------------------------------------------
// Data Fetching
// ------------------------------------------------------
async function fetchEarthquakeData(start, end) {
    const params = new URLSearchParams({
        format: "geojson",
        starttime: start.toISOString(),
        endtime: end.toISOString(),
        minlongitude: CONFIG.bbox.minLon,
        maxlongitude: CONFIG.bbox.maxLon,
        minlatitude: CONFIG.bbox.minLat,
        maxlatitude: CONFIG.bbox.maxLat,
        minmagnitude: 2.5,
        orderby: "time"
    });

    try {
        const response = await fetch(`${CONFIG.endpoint}?${params}`);
        const data = await response.json();
        return data.features;
    } catch (error) {
        console.error("USGS Fetch Error:", error);
        return null;
    }
}

async function loadTectonicLines() {
    try {
        const response = await fetch(CONFIG.tectonicUrl);
        const data = await response.json();
        
        tectonicLayer = L.geoJSON(data, {
            style: {
                color: "#f59e0b", // Orange color for faults
                weight: 2,
                opacity: 0.6
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    layer.bindPopup(`<b>Fault:</b> ${feature.properties.Name || 'Unknown'}`);
                }
            }
        }).addTo(map);
        
    } catch (error) {
        console.error("Tectonic Data Error:", error);
    }
}

// ------------------------------------------------------
// Map & Rendering
// ------------------------------------------------------
function initializeMap() {
    map = L.map('map').setView([21.9, 96.0], 6); // Centered on Myanmar

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO'
    }).addTo(map);
}

function renderDashboard(quakes) {
    // Map Markers
    if (earthquakeLayer) map.removeLayer(earthquakeLayer);
    
    earthquakeLayer = L.geoJSON(quakes, {
        pointToLayer: (feature, latlng) => {
            const mag = feature.properties.mag;
            const depth = feature.geometry.coordinates[2];
            
            return L.circleMarker(latlng, {
                radius: getRadius(mag),
                fillColor: getColor(mag),
                color: "#fff",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.7
            }).bindPopup(`
                <b>M ${mag}</b><br>
                ${feature.properties.place}<br>
                Depth: ${depth} km<br>
                ${new Date(feature.properties.time).toLocaleDateString()}
            `);
        }
    }).addTo(map);

    updateStats(quakes);
    updateTable(quakes);
    updateCharts(quakes);
}

function getRadius(mag) {
    return mag >= 7 ? 15 : mag >= 6 ? 10 : mag >= 5 ? 7 : 4;
}

function getColor(mag) {
    return mag >= 6 ? "#ef4444" : mag >= 5 ? "#f97316" : "#3b82f6";
}

function updateStats(quakes) {
    const mags = quakes.map(q => q.properties.mag);
    const depths = quakes.map(q => q.geometry.coordinates[2]);
    
    document.getElementById('total-events').innerText = quakes.length;
    document.getElementById('max-magnitude').innerText = Math.max(...mags).toFixed(1);
    document.getElementById('strong-events').innerText = quakes.filter(q => q.properties.mag >= 5.0).length;
    document.getElementById('avg-depth').innerText = (depths.reduce((a,b)=>a+b,0) / depths.length).toFixed(1);
}

function updateTable(quakes) {
    const tbody = document.querySelector("#major-events-table tbody");
    const majorQuakes = quakes.filter(q => q.properties.mag >= 4.5).slice(0, 50);
    
    tbody.innerHTML = majorQuakes.map(q => `
        <tr onclick="map.setView([${q.geometry.coordinates[1]}, ${q.geometry.coordinates[0]}], 9)">
            <td>${new Date(q.properties.time).toLocaleDateString()}</td>
            <td style="color:${getColor(q.properties.mag)}"><b>${q.properties.mag}</b></td>
            <td>${q.geometry.coordinates[2]} km</td>
            <td>${q.properties.place}</td>
        </tr>
    `).join('');
}

function updateCharts(quakes) {
    // 1. Timeline Chart
    const dates = {};
    quakes.forEach(q => {
        const date = new Date(q.properties.time).toISOString().split('T')[0];
        dates[date] = (dates[date] || 0) + 1;
    });

    // Sort dates
    const sortedDates = Object.keys(dates).sort();
    
    new Chart(document.getElementById('timelineChart'), {
        type: 'bar',
        data: {
            labels: sortedDates,
            datasets: [{
                label: 'Daily Events',
                data: sortedDates.map(d => dates[d]),
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, title: { display: true, text: 'Daily Seismicity Trend' } },
            scales: { x: { display: false } }
        }
    });

    // 2. Magnitude Distribution
    const magCounts = [0, 0, 0, 0]; // <4, 4-5, 5-6, >6
    quakes.forEach(q => {
        const m = q.properties.mag;
        if(m < 4) magCounts[0]++;
        else if(m < 5) magCounts[1]++;
        else if(m < 6) magCounts[2]++;
        else magCounts[3]++;
    });

    new Chart(document.getElementById('magDistChart'), {
        type: 'doughnut',
        data: {
            labels: ['< M4', 'M 4-5', 'M 5-6', 'M 6+'],
            datasets: [{
                data: magCounts,
                backgroundColor: ['#94a3b8', '#3b82f6', '#f97316', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' }, title: { display: true, text: 'Magnitude Distribution' } }
        }
    });
}