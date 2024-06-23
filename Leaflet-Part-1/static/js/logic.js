// Create and set view on the map
var map = L.map('map').setView([20, -160], 2.5);

// Add a tile layer to the map
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: '© Esri'
}).addTo(map);

// URL to the USGS GeoJSON data
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Call the data
d3.json(earthquakeUrl).then(function(data) {
  createMarkers(data); // fxn to create markers for the data
});

// Create markers
function createMarkers(data) {
    function markerSize(magnitude) { // fxn for marker size based on magnitude
      return magnitude * 6;
    }
  
    function markerColor(depth) { // fxn for marker color based on depth
      return depth > 90 ? '#FF5F65' : //red
             depth > 70 ? '#FCA35D' : //orange
             depth > 50 ? '#FDB72A' : //light orange
             depth > 30 ? '#F7DB11' : //yellow
             depth > 10 ? '#DCF400' : '#A3F600'; //greens
    }
  
    // Loop through each earthquake feature
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: '#000',
          weight: 1,
          opacity: 0.3,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km</p>");
      }
    }).addTo(map);
  }

// Add a legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
    let container = L.DomUtil.create("div", "info legend");
    const grades = [-10, 10, 30, 50, 70, 90];
    const colors = ["#A3F600", "#DCF400", "#F7DB11", "#FDB72A", "#FCA35D", "#FF5F65"];

    for (let i = 0; i < grades.length; i++) {
        container.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return container;
};

legend.addTo(map);