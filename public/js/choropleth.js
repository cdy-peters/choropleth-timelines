const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const projection = d3
  .geoMercator()
  .scale(150)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
let data = new Map();

const rColorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeReds[7]);

const gColorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeGreens[7]);

const bColorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load external data and boot
const COUNTRY_DATASET =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const COVID_DATASET =
  "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv";

var covid_data_raw = {};
var covid_data;

var promises = [
  d3.json(COUNTRY_DATASET),
  d3.csv(COVID_DATASET, function (d) {
    if (!(d.date in covid_data_raw)) {
      covid_data_raw[d.date] = {};
    }
    covid_data_raw[d.date][d.iso_code] = {
      total_cases: +d.total_cases,
      new_cases: +d.new_cases,
      total_deaths: +d.total_deaths,
      new_deaths: +d.new_deaths,
    };
  }),
];

Promise.all(promises).then(ready);

function ready([world]) {
  // Draw the map
  svg
    .append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(world.features)
    .join("path")

    // Draw countries
    .attr("d", d3.geoPath().projection(projection))
    .attr("data-name", function (d) {
      return d.properties.name;
    })
    .attr("id", function (d) {
      return d.id;
    });

  // Sort covid data object by date
  covid_data = Object.keys(covid_data_raw)
    .sort()
    .reduce((obj, key) => {
      obj[key] = covid_data_raw[key];
      return obj;
    }, {});

  // Fill countries
  var idx = Object.keys(covid_data).length - 1;
  // Set slider to last date
  document.getElementById("date_slider").setAttribute("max", idx);
  document.getElementById("date_slider").setAttribute("value", idx);

  fill_countries(Object.keys(covid_data)[idx]);
}

function fill_countries(date) {
  d3.selectAll(".countries path")
    // Color countries
    .style("fill", function (d) {
      covid_data_country = covid_data[date][d.id];

      if (covid_data_country) {
        return rColorScale(covid_data_country.total_cases);
      } else {
        return "grey";
      }
    })
    .attr("class", "country")

    // Hover
    .on("mouseover", function (e, d) {
      covid_data_country = covid_data[date][d.id];

      d3.selectAll(".country").style("opacity", 0.3);

      d3.select(this).style("opacity", 1).style("stroke", "black");

      if (covid_data_country) {
        tooltip.html(d.properties.name + ": " + covid_data_country.total_cases);
      } else {
        tooltip.html(d.properties.name + ": No data");
      }

      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0.9)
        .style("left", e.pageX + 5 + "px")
        .style("top", e.pageY - 28 + "px");
    })
    .on("mouseout", function (e, d) {
      d3.selectAll(".country")
        .style("opacity", 1)
        .style("stroke", "transparent");

      tooltip.transition().duration(500).style("opacity", 0);
    });
}
