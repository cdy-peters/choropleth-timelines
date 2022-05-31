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
  .domain([
    10000, 100000, 1000000, 10000000, 100000000, 100000000
  ])
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
  // Set slider and date picker to last date
  document.getElementById("date_slider").setAttribute("max", idx);
  document.getElementById("date_slider").setAttribute("value", idx);
  document.getElementById("date_value").innerHTML = date;

  document.getElementById("date_picker").setAttribute("max", date);
  document.getElementById("date_picker").setAttribute("value", date);

  fill_countries(date, "total_cases");
  legend('total_cases');
}

// Color countries
function fill_countries(date, data_type) {
  d3.selectAll(".countries path")
    // Color countries
    .style("fill", function (d) {
      covid_data_country = covid_data[date][d.id];

      if (covid_data_country && covid_data_country[data_type] !== null) {
        const color_scale = set_color_scale(data_type);
        return color_scale(covid_data_country[data_type]);
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

      if (covid_data_country && covid_data_country[data_type] !== null) {
        tooltip.html(
          d.properties.name +
            ": " +
            covid_data_country[data_type] +
            set_suffix(data_type)
        );
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

// Legend
function legend(data_type) {
  svg.selectAll("g#legend").remove()

  const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

  const legend = svg.append("g").attr("id", "legend");
  const color_scale = set_color_scale(data_type)
  const legend_title = set_legend_title(data_type)

  const legend_entry = legend
    .selectAll("g.legend")
    .data(
      color_scale.range().map(function (d) {
        d = color_scale.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      })
    )
    .enter()
    .append("g")
    .attr("class", "legend_entry");

  const ls_w = 20,
    ls_h = 20;

  legend_entry
    .append("rect")
    .attr("x", 20)
    .attr("y", function (d, i) {
      return height - i * ls_h - 2 * ls_h;
    })
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function (d) {
      return color_scale(d[0]);
    })
    .style("opacity", 0.8);

  legend_entry
    .append("text")
    .attr("x", 50)
    .attr("y", function (d, i) {
      return height - i * ls_h - ls_h - 6;
    })
    .text(function (d, i) {
      if (i === 0) return "< " + d[1] / 1000000 + " m";
      if (d[1] < d[0]) return d[0] / 1000000 + " m +";
      return d[0] / 1000000 + " m - " + d[1] / 1000000 + " m";
    });

  legend
    .append("text")
    .attr("x", 15)
    .attr("y", 625)
    .text(legend_title);
}

// Set suffix
function set_suffix(data_type) {
  switch (data_type) {
    case "total_cases":
      return " Total Cases";
    case "new_cases":
      return " New Cases";
    case "total_deaths":
      return " Total Deaths";
    case "new_deaths":
      return " New Deaths";
    case "icu_patients":
      return " ICU Patients";
    case "hosp_patients":
      return " Hospitalized Patients";
    case "total_tests":
      return " Total Tests";
    case "new_tests":
      return " New Tests";
    case "total_vaccinations":
      return " Total Vaccinations";
    case "people_vaccinated":
      return " People Vaccinated";
    case "people_fully_vaccinated":
      return " People Fully Vaccinated";
    case "new_vaccinations":
      return " New Vaccinations";
  }
}

// Set color scale
function set_color_scale(data_type) {
  switch (data_type) {
    case "total_cases":
      return tc_color_scale;
    case "new_cases":
      return nc_color_scale;
    case "total_deaths":
      return td_color_scale;
    case "new_deaths":
      return nd_color_scale;
    case "icu_patients":
      return ip_color_scale;
    case "hosp_patients":
      return hp_color_scale;
    case "total_tests":
      return tt_color_scale;
    case "new_tests":
      return nt_color_scale;
    case "total_vaccinations":
      return tv_color_scale;
    case "people_vaccinated":
      return pv_color_scale;
    case "people_fully_vaccinated":
      return pfv_color_scale;
    case "new_vaccinations":
      return nv_color_scale;
    default:
      return "grey";
  }
}

// Set legend title
function set_legend_title(data_type) {
  switch (data_type) {
    case "total_cases":
      return 'Total Cases (millions)';
    case "new_cases":
      return 'New Cases (millions)';
    case "total_deaths":
      return 'Total Deaths (millions)';
    case "new_deaths":
      return 'New Deaths (millions)';
    case "icu_patients":
      return 'ICU Patients (millions)';
    case "hosp_patients":
      return 'Hospitalized Patients (millions)';
    case "total_tests":
      return 'Total Tests (millions)';
    case "new_tests":
      return 'New Tests (millions)';
    case "total_vaccinations":
      return 'Total Vaccinations (millions)';
    case "people_vaccinated":
      return 'People Vaccinated (millions)';
    case "people_fully_vaccinated":
      return 'People Fully Vaccinated (millions)';
    case "new_vaccinations":
      return 'New Vaccinations (millions)';
  }
}

// On slider change
function slider_change(e) {
  date = Object.keys(covid_data)[e.value];

  document.getElementById("date_picker").setAttribute("value", date);
  document.getElementById("date_value").innerHTML = date;

  fill_countries(date, prev_radio);
}

// On date picker change
function picker_change(e) {
  date = e.value;
  idx = Object.keys(covid_data).indexOf(date);

  document.getElementById("date_slider").setAttribute("value", idx);
  document.getElementById("date_value").innerHTML = date;

  fill_countries(date, prev_radio);
}

// On radio change
for (var i = 0; i < radios.length; i++) {
  radios[i].onclick = function () {
    if (this.value !== prev_radio) {
      prev_radio = this.value;

      fill_countries(date, this.value);
      legend(prev_radio);
    }
  };
}
