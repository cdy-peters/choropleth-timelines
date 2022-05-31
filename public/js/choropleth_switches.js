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

// Set legend details
function set_legend_details(data_type) {
  switch (data_type) {
    case "total_cases":
      legend_title = "Total Cases (millions)";
      legend_unit = 1000000;
      return { legend_title, legend_unit };
    case "new_cases":
      legend_title = "New Cases (thousands)";
      legend_unit = 1000;
      return { legend_title, legend_unit };
    case "total_deaths":
      legend_title = "Total Deaths (thousands)";
      legend_unit = 1000;
      return { legend_title, legend_unit };
    case "new_deaths":
      legend_title = "New Deaths (hundreds)";
      legend_unit = 100;
      return { legend_title, legend_unit };
    case "icu_patients":
      legend_title = "ICU Patients (hundreds)";
      legend_unit = 100;
      return { legend_title, legend_unit };
    case "hosp_patients":
      legend_title = "Hospitalized Patients (thousands)";
      legend_unit = 1000;
      return { legend_title, legend_unit };
    case "total_tests":
      legend_title = "Total Tests (millions)";
      legend_unit = 1000000;
      return { legend_title, legend_unit };
    case "new_tests":
      legend_title = "New Tests (thousands)";
      legend_unit = 1000;
      return { legend_title, legend_unit };
    case "total_vaccinations":
      legend_title = "Total Vaccinations (millions)";
      legend_unit = 1000000;
      return { legend_title, legend_unit };
    case "people_vaccinated":
      legend_title = "People Vaccinated (millions)";
      legend_unit = 1000000;
      return { legend_title, legend_unit };
    case "people_fully_vaccinated":
      legend_title = "People Fully Vaccinated (millions)";
      legend_unit = 1000000;
      return { legend_title, legend_unit };
    case "new_vaccinations":
      legend_title = "New Vaccinations (thousands)";
      legend_unit = 1000;
      return { legend_title, legend_unit };
  }
}
