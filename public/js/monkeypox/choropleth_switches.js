// Set suffix
function set_suffix(data_type) {
  switch (data_type) {
    case "total_cases":
      return " Total Cases";
    case "new_cases":
      return " New Cases";
  }
}

// Set subtitle
function set_subtitle(data_type) {
  switch (data_type) {
    case "total_cases":
      return "Total Monkeypox Cases per Thousand People";
    case "new_cases":
      return "New Monkeypox Cases per Hundred People";
  }
}

// Set color scale
function set_color_scale(data_type) {
  switch (data_type) {
    case "total_cases":
      return tc_color_scale;
    case "new_cases":
      return nc_color_scale;
    default:
      return "grey";
  }
}

// Set legend details
function set_legend_details(data_type) {
  switch (data_type) {
    case "total_cases":
      legend_title = "Total Cases (thousands)";
      legend_unit = 1000;
      return { legend_title, legend_unit };
    case "new_cases":
      legend_title = "New Cases (hundreds)";
      legend_unit = 100;
      return { legend_title, legend_unit };
  }
}
