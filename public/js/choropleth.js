const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3
  .geoMercator()
  .scale(150)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
let data = new Map();
const colorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load external data and boot
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv(
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",
    function(d) {
      data.set(d.iso_code)
    }
  ),
]).then(function (loadData) {
  let topo = loadData[0];

  let mouseOver = function (e, d) {
    d3.selectAll('.country')
      .style('opacity', 0.5)

    d3.select(this)
      .style('opacity', 1)
      .style('stroke', 'black')

    tooltip.style("left", e.pageX + "px")
      .style("top", e.pageY + "px")
      .style('opacity', 1)
      .text(d.properties.name)
  };

  let mouseLeave = function() {
    d3.selectAll('.country')
      .style('opacity', 1)
      .style('stroke', 'transparent')
    
    tooltip.style('opacity', 0)
  }

  // Draw choropleth
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")

    // Draw countries
    .attr("d", d3.geoPath().projection(projection))

    .attr('data-name', function(d) {
      return d.properties.name
    })

    // Set color of countries
    .attr("fill", function (d) {
      return "gray";
    })

    .attr('class', function(d) {
      return 'country'
    })
    .attr('id', function(d) {
      return d.id
    })
    .on('mouseover', mouseOver)
    .on('mouseleave', mouseLeave)
});