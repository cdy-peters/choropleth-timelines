var date;
var prev_radio = "total_cases";
var radios = $("#data_type_form input[type=radio]");

// On slider change
function slider_change(e) {
  date = Object.keys(covid_data)[e.value];

  $("#date_slider").attr("value", e.value);
  $("#date_picker").val(date);
  $("#date_value").text(date);

  fill_countries(date, prev_radio);
}

// On date picker change
function picker_change(e) {
  date = e.value;
  idx = Object.keys(covid_data).indexOf(date);

  $("#date_slider").val(idx);
  $("#date_value").text(date);

  fill_countries(date, prev_radio);
}

// On radio change
for (var i = 0; i < radios.length; i++) {
  radios[i].onclick = function () {
    if (this.value !== prev_radio) {
      prev_radio = this.value;

      $("#data_type_selection").val(this.value);

      fill_countries(date, prev_radio);
      legend(prev_radio);
    }
  };
}

function select_change(e) {
  prev_radio = e.value;

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].value === prev_radio) {
      radios[i].checked = true;
    }
  }

  fill_countries(date, prev_radio);
  legend(prev_radio);
}
