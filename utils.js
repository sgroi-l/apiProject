// Function to generate a random item from an array
export function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Function to create an element, set an ID and append text
export function createElement(tagName, id, text) {
  const element = document.createElement(tagName);
  element.setAttribute("id", id);
  const textNode = document.createTextNode(text);
  element.appendChild(textNode);
  return element;
}

// Function to render weather data to the page
export function renderWeatherData(temperature, name, country, renderElement) {
    const temperatureElement = createElement("h1", "temperature", `${temperature}\u00B0C`);
    const locationElement = createElement("p", "location", `${name}, ${country}`);
    renderElement.append(temperatureElement, locationElement);
  }

// Function to save weather history 
export function getHistory(dataHistoryElement) {
let weatherHistory = JSON.parse(window.localStorage.getItem("weatherDetails"));
let activityHistory = window.localStorage.getItem("activityDetails");

weatherHistory.forEach(element => {
    const temperatureElement = createElement("h1", "temperature", `${element.temperature}\u00B0C`);
    const locationElement = createElement("p", "location", `${element.locationName}, ${element.locationCountry}`);
    const dateElement = createElement("p", "date", element.date);
    
    dataHistoryElement.append(temperatureElement, locationElement, dateElement);
});
}

// Function to clear previous search result
export function clearSearchResult(errorMessageElement, renderElement) {
    errorMessageElement.textContent = "";
    renderElement.textContent = "";
}

// Function to handle form submission via click or keyboard
export function handleFormEvent(event, errorMessageElement, renderElement, handleFormSubmit) {
    event.preventDefault();
    clearSearchResult(errorMessageElement, renderElement);
    handleFormSubmit(event);
}

// Function to store data in localStorage
export function storeDataInLocalStorage(key, data) {
  let arr;
  if (localStorage.getItem(key) === null) {
    arr = [];
  } else {
    try {
      arr = JSON.parse(localStorage.getItem(key));
    } catch (error) {
      arr = [];
      console.error("Error parsing localStorage data:", error);
    }
  }
  arr.unshift(data);
  localStorage.setItem(key, JSON.stringify(arr));
}