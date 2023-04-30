const apiKey = "c3ad71055453ca2c85818dd97cf7a50a";

function addCity() {
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const country = document.getElementById("country").value;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      const cityInfo = {city, state, country, lat, lon};

      let cities = JSON.parse(localStorage.getItem("cities"));
      if (!cities) cities = [];

      cities.push(cityInfo);
      localStorage.setItem("cities", JSON.stringify(cities));

      addCityToTable(cityInfo);
    })
    .catch(error => {
      console.log(error);
      alert("Could not add city. Please try again.");
    });
}

function deleteCity(cityIndex) {
  let cities = JSON.parse(localStorage.getItem("cities"));
  cities.splice(cityIndex, 1);
  localStorage.setItem("cities", JSON.stringify(cities));
  location.reload();
}

function editCity(cityIndex) {
  const cityList = document.getElementById("city-list");
  const row = cityList.rows[cityIndex + 1];
  const cityCell = row.cells[0];
  const stateCell = row.cells[1];
  const countryCell = row.cells[2];

  const cityInput = document.createElement("input");
  cityInput.type = "text";
  cityInput.value = cityCell.innerHTML;
  cityCell.innerHTML = "";
  cityCell.appendChild(cityInput);

  const stateInput = document.createElement("input");
  stateInput.type = "text";
  stateInput.value = stateCell.innerHTML;
  stateCell.innerHTML = "";
  stateCell.appendChild(stateInput);

  const countryInput = document.createElement("input");
  countryInput.type = "text";
  countryInput.value = countryCell.innerHTML;
  countryCell.innerHTML = "";
  countryCell.appendChild(countryInput);

  const editButton = row.cells[4].childNodes[0];
  editButton.removeEventListener("click", editCity);
  editButton.className = "fa fa-check";
  editButton.onclick = () => {
    const city = cityInput.value;
    const state = stateInput.value;
    const country = countryInput.value;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const cityInfo = {city, state, country, lat, lon};

        let cities = JSON.parse(localStorage.getItem("cities"));
        cities[cityIndex] = cityInfo;
        localStorage.setItem("cities", JSON.stringify(cities));

        cityCell.innerHTML = city;
        stateCell.innerHTML = state;
        countryCell.innerHTML = country;

        editButton.className = "fa fa-edit";
        editButton.onclick = () => editCity(cityIndex);
      })
      .catch(error => {
        console.log(error);
        alert("Could not edit city. Please try again.");
      });
  };
}

function addCityToTable(cityInfo) {
  const cityList = document.getElementById("city-list");
  const row = cityList.insertRow(-1);

  const cityCell = row.insertCell(0);
  const stateCell = row.insertCell(1);
  const countryCell = row.insertCell(2);
  const tempCell = row.insertCell(3);
  const actionsCell = row.insertCell(4);

  cityCell.innerHTML = cityInfo.city;
  stateCell.innerHTML = cityInfo.state;
  countryCell.innerHTML = cityInfo.country;

  const apiKey = "c3ad71055453ca2c85818dd97cf7a50a";
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${cityInfo.lat}&lon=${cityInfo.lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tempC = data.main.temp;
      const tempF = (tempC * 9) / 5 + 32;
      tempCell.innerHTML = `${tempC}°C / ${tempF}°F`;
    })
    .catch((error) => {
      console.log(error);
      tempCell.innerHTML = "N/A";
    });

  const editButton = document.createElement("button");
  editButton.innerHTML = "Edit";
  editButton.addEventListener("click", () => editCity(row.rowIndex - 1));
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener("click", () => deleteCity(row.rowIndex - 1));
  actionsCell.appendChild(deleteButton);
}
