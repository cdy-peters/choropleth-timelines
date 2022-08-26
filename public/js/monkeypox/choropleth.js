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
  .domain([100, 500, 1000, 10000, 50000, 100000])
  .range(d3.schemeBlues[7]);

const nc_color_scale = d3
  .scaleThreshold()
  .domain([10, 50, 100, 500, 1000, 2500])
  .range(d3.schemeBlues[7]);

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
const MONKEYPOX_DATASET =
  "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

var monkeypox_data_raw = {};
var monkeypox_data;

var promises = [
  d3.json(COUNTRY_DATASET),
  d3.csv(MONKEYPOX_DATASET, function (d) {
    if (!(d.date in monkeypox_data_raw)) {
      monkeypox_data_raw[d.date] = {};
    }

    monkeypox_data_raw[d.date][d.iso_code] = {
      total_cases: d.total_cases === "" ? null : +d.total_cases,
      new_cases: d.new_cases === "" ? null : +d.new_cases,
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

  // Sort monkeypox data object by date
  monkeypox_data = Object.keys(monkeypox_data_raw)
    .sort()
    .reduce((obj, key) => {
      obj[key] = monkeypox_data_raw[key];
      return obj;
    }, {});

  // Fill countries
  var idx = Object.keys(monkeypox_data).length - 1;
  date = Object.keys(monkeypox_data)[idx];
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
