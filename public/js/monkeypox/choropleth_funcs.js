// Zoom
function zoomed(event) {
  g.selectAll("path") // To prevent stroke width from scaling
    .attr("transform", event.transform);
}

// Add chart details
function add_chart_details() {
  // Add date text
  svg
    .append("foreignObject")
    .attr("x", "20")
    .attr("y", "50")
    .attr("width", "150px")
    .attr("height", "40px")
    .html(
      '<p id="date_text"><strong>Date:</strong> <span id="date_value"></span></p>'
    );
}

// Color countries
function fill_countries(date, data_type) {
  d3.selectAll(".countries path")
    // Color countries
    .style("fill", function (d) {
      monkeypox_data_country = monkeypox_data[date][d.id];

      if (
        monkeypox_data_country &&
        monkeypox_data_country[data_type] !== null
      ) {
        const color_scale = set_color_scale(data_type);
        return color_scale(monkeypox_data_country[data_type]);
      } else {
        return "grey";
      }
    })
    .attr("class", "country")

    // Hover
    .on("mouseover", function (e, d) {
      monkeypox_data_country = monkeypox_data[date][d.id];

      d3.selectAll(".country").style("opacity", 0.3);

      d3.select(this).style("opacity", 1).style("stroke", "black");

      if (
        monkeypox_data_country &&
        monkeypox_data_country[data_type] !== null
      ) {
        tooltip.html(
          d.properties.name +
            ": " +
            monkeypox_data_country[data_type] +
            set_suffix(data_type)
        );
      } else {
        tooltip.html(d.properties.name + ": No data");
      }

      tooltip
        .transition()
        .duration(200)
        .style("display", "block")
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
  svg.selectAll("g#legend").remove();

  const x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

  const legend = svg.append("g").attr("id", "legend");
  const color_scale = set_color_scale(data_type);
  const { legend_title, legend_unit } = set_legend_details(data_type);

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
      if (i === 0) return "< " + d[1] / legend_unit;
      if (d[1] < d[0]) return d[0] / legend_unit + " +";
      return d[0] / legend_unit + " - " + d[1] / legend_unit;
    });

  legend.append("text").attr("x", 15).attr("y", 625).text(legend_title);
}
