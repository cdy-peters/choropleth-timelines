var date;
var prev_radio = "total_cases";
var radios = document.data_type_radio.data_type;

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

const oColorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeOranges[7]);

const yColorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemePurples[7]);

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
      icu_patients: +d.icu_patients, // Daily or weekly?
      hosp_patients: +d.hosp_patients, // Daily or weekly?
      total_tests: +d.total_tests, // Consider units
      new_tests: +d.new_tests, // Consider units
      // positive_rate: +d.positive_rate,
      // tests_per_case: +d.tests_per_case,
      // tests_units: d.tests_units,
      total_vaccinations: +d.total_vaccinations,
      people_vaccinated: +d.people_vaccinated,
      people_fully_vaccinated: +d.people_fully_vaccinated,
      new_vaccinations: +d.new_vaccinations,
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
  date = Object.keys(covid_data)[idx];
  // Set slider to last date
  document.getElementById("date_slider").setAttribute("max", idx);
  document.getElementById("date_slider").setAttribute("value", idx);
  document.getElementById("date_value").innerHTML = date;

  fill_countries(date, "total_cases");
}

function fill_countries(date, data_type) {
  d3.selectAll(".countries path")
    // Color countries
    .style("fill", function (d) {
      covid_data_country = covid_data[date][d.id];

      if (covid_data_country) {
        return color_scale(covid_data_country, data_type);
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
        tooltip.html(d.properties.name + ": " + covid_data_country[data_type]);
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

// Set color scale
function color_scale(covid_data_country, data_type) {
  switch (data_type) {
    case "total_cases":
      return bColorScale(covid_data_country[data_type]);
    case "new_cases":
      return bColorScale(covid_data_country[data_type]);
    case "total_deaths":
      return rColorScale(covid_data_country[data_type]);
    case "new_deaths":
      return rColorScale(covid_data_country[data_type]);
    case "icu_patients":
      return oColorScale(covid_data_country[data_type]);
    case "hosp_patients":
      return oColorScale(covid_data_country[data_type]);
    case "total_tests":
      return yColorScale(covid_data_country[data_type]);
    case "new_tests":
      return yColorScale(covid_data_country[data_type]);
    case "total_vaccinations":
      return gColorScale(covid_data_country[data_type]);
    case "people_vaccinated":
      return gColorScale(covid_data_country[data_type]);
    case "people_fully_vaccinated":
      return gColorScale(covid_data_country[data_type]);
    case "new_vaccinations":
      return gColorScale(covid_data_country[data_type]);
    default:
      return "grey";
  }
}

// On slider change
function slider_change(e) {
  date = Object.keys(covid_data)[e.value];
  document.getElementById("date_value").innerHTML = date;
  console.log(prev_radio, date);

  fill_countries(date, prev_radio);
}

// On radio change
for (var i = 0; i < radios.length; i++) {
  radios[i].onclick = function () {
    if (this.value !== prev_radio) {
      prev_radio = this.value;
      console.log(this.value, date);

      fill_countries(date, this.value);
    }
  };
}
