var date;
var prev_type = "total_cases";
var radios = $("#data_type_form input[type=radio]");

// On slider change
function slider_change(e) {
  date = Object.keys(covid_data)[e.value];

  $("#date_slider").attr("value", e.value);
  $("#date_picker").val(date);
  $("#date_value").text(date);

  fill_countries(date, prev_type);
}

// On date picker change
function picker_change(e) {
  date = e.value;
  idx = Object.keys(covid_data).indexOf(date);

  $("#date_slider").val(idx);
  $("#date_value").text(date);

  fill_countries(date, prev_type);
}

// On radio change
for (var i = 0; i < radios.length; i++) {
  radios[i].onclick = function () {
    if (this.value !== prev_type) {
      prev_type = this.value;

      $("#data_type_selection").val(prev_type);

      chart_details(prev_type);
      fill_countries(date, prev_type);
      legend(prev_type);
    }
  };
}

// On select change
function select_change(e) {
  prev_type = e.value;

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].value === prev_type) {
      radios[i].checked = true;
    }
  }

  chart_details(prev_type);
  fill_countries(date, prev_type);
  legend(prev_type);
}

function chart_details(prev_type) {
  $("#chart_title").text(set_subtitle(prev_type));
}
