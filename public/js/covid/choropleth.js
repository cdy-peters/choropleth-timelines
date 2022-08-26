const svg = d3.select("svg"),
  g = svg.append("g");
(width = 1000), (height = 800);

// Map and projection
const projection = d3
  .geoMercator()
  .scale(150)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
let data = new Map();

const tc_color_scale = d3
  .scaleThreshold()
  .domain([10000, 100000, 1000000, 10000000, 50000000, 100000000])
  .range(d3.schemeBlues[7]);

const nc_color_scale = d3
  .scaleThreshold()
  .domain([100, 1000, 10000, 100000, 500000, 1000000])
  .range(d3.schemeBlues[7]);

const td_color_scale = d3
  .scaleThreshold()
  .domain([1000, 5000, 10000, 100000, 500000, 1000000])
  .range(d3.schemeReds[7]);

const nd_color_scale = d3
  .scaleThreshold()
  .domain([10, 50, 100, 500, 1000, 2500])
  .range(d3.schemeReds[7]);

const ip_color_scale = d3
  .scaleThreshold()
  .domain([10, 100, 500, 1000, 2500, 5000])
  .range(d3.schemeOranges[7]);

const hp_color_scale = d3
  .scaleThreshold()
  .domain([100, 500, 1000, 5000, 10000, 20000])
  .range(d3.schemeOranges[7]);

const tt_color_scale = d3
  .scaleThreshold()
  .domain([1000000, 5000000, 10000000, 100000000, 500000000, 1000000000])
  .range(d3.schemePurples[7]);

const nt_color_scale = d3
  .scaleThreshold()
  .domain([1000, 10000, 50000, 100000, 500000, 1000000])
  .range(d3.schemePurples[7]);

const tv_color_scale = d3
  .scaleThreshold()
  .domain([10000, 100000, 1000000, 10000000, 50000000, 100000000, 200000000])
  .range(d3.schemeGreens[7]);

const pv_color_scale = d3
  .scaleThreshold()
  .domain([10000, 100000, 1000000, 50000000, 10000000, 50000000, 100000000])
  .range(d3.schemeGreens[7]);

const pfv_color_scale = d3
  .scaleThreshold()
  .domain([10000, 100000, 1000000, 10000000, 100000000, 100000000])
  .range(d3.schemeGreens[7]);

const nv_color_scale = d3
  .scaleThreshold()
  .domain([1000, 10000, 100000, 500000, 1000000, 10000000])
  .range(d3.schemeGreens[7]);

// Tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Zoom
const zoom = d3
  .zoom()
  .scaleExtent([1, 8])
  .translateExtent([
    [0, 0],
    [width, height],
  ])
  .on("zoom", zoomed);

svg.call(zoom);

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
      total_cases: d.total_cases === "" ? null : +d.total_cases,
      new_cases: d.new_cases === "" ? null : +d.new_cases,
      total_deaths: d.total_deaths === "" ? null : +d.total_deaths,
      new_deaths: d.new_deaths === "" ? null : +d.new_deaths,
      icu_patients: d.icu_patients === "" ? null : +d.icu_patients,
      hosp_patients: d.hosp_patients === "" ? null : +d.hosp_patients,
      total_tests: d.total_tests === "" ? null : +d.total_tests,
      new_tests: d.new_tests === "" ? null : +d.new_tests,
      total_vaccinations:
        d.total_vaccinations === "" ? null : +d.total_vaccinations,
      people_vaccinated:
        d.people_vaccinated === "" ? null : +d.people_vaccinated,
      people_fully_vaccinated:
        d.people_fully_vaccinated === "" ? null : +d.people_fully_vaccinated,
      new_vaccinations: d.new_vaccinations === "" ? null : +d.new_vaccinations,
    };
  }),
];

Promise.all(promises).then(ready);

function ready([world]) {
  // Draw the map
  g.attr("class", "countries")
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

  // Add chart details
  add_chart_details();

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
  // Set slider and date picker to last date
  $("#date_slider").attr("max", idx);
  $("#date_slider").val(idx);
  $("#date_value").text(date);

  $("#date_picker").attr("max", date);
  $("#date_picker").val(date);

  fill_countries(date, "total_cases");
  legend("total_cases");

  $("#loading_bg").fadeOut("slow");
}
