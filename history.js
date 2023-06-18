export function getHistory(dataHistoryElement) {
    let weatherHistory = JSON.parse(window.localStorage.getItem("weatherDetails"));
    let activityHistory = window.localStorage.getItem("activityDetails")
    weatherHistory.forEach(element => {
    const temperatureElement = document.createElement("h1");
    const locationElement = document.createElement("p");
    const dateElement = document.createElement("p");
    temperatureElement.setAttribute("id", "temperature");
    locationElement.setAttribute("id", "location");
    dateElement.setAttribute("id", "date");
    let temperatureText = document.createTextNode(`${element.temperature}\u00B0C`)
    let locationText = document.createTextNode(`${element.locationName}, ${element.locationCountry}`)
    let dateText = document.createTextNode(element.date);
    // append elements 
    dataHistoryElement.append(temperatureElement);
    dataHistoryElement.append(locationElement);
    dataHistoryElement.append(dateElement);
    temperatureElement.append(temperatureText);
    locationElement.append(locationText);
    dateElement.append(dateText);
    console.log(locationElement)
    });
}