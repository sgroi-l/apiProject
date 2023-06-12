// Function to generate a random item from an array
function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('nav');

// Add event listener to the document
document.addEventListener('click', function(event) {
  const target = event.target;

  // Check if the click event occurred outside the side menu
  if (target !== menuToggle && target !== nav && !nav.contains(target)) {
    // Close the side menu by unchecking the checkbox
    menuToggle.checked = false;
  }
});

const form = document.querySelector("#searchForm");
const searchLink = document.querySelector('#searchLink'); // I replaced the submit button on the form with an icon. 
const renderElement = document.querySelector('#data-render')


searchLink.addEventListener("click", function(event) {
  event.preventDefault()
  handleFormSubmit(event);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  handleFormSubmit(event);
});

function handleFormSubmit(event) {
  event.preventDefault();

  const input = document.querySelector("#search").value;
  console.log("Input value:", input);


// First promise
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=62f3a1ae06706d5807a4f7d172197411`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .then((data) => {
    // Access the temperature value
    const temperature = Math.round(data.main.temp - 273.15);

    // Use the temperature value as needed
    console.log(`Temperature in ${data.name}, ${data.sys.country}: ${temperature}\u00B0`);
    // Clear weather data
    let weatherElement = "";
    // Create element
    temperatureElement = document.createElement("h1");
    locationElement = document.createElement("p");
    temperatureElement.setAttribute("id", "temperature");
    locationElement.setAttribute("id", "location");
    temperatureText = document.createTextNode(`${temperature}\u00B0C`)
    locationText = document.createTextNode(`${data.name}, ${data.sys.country}`)
    // append elements 
    renderElement.append(temperatureElement);
    renderElement.append(locationElement);
    temperatureElement.append(temperatureText);
    locationElement.append(locationText);
    console.log(renderElement);
    // Second promise
    let typeArray;
    if (temperature >= 20) {
      typeArray = ["social", "recreational", "charity"];
    } else {
      typeArray = ["education", "cooking", "relaxation"];
    }

    const randomType = getRandomItem(typeArray);

    fetch(`https://www.boredapi.com/api/activity?type=${randomType}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((jsonData) => {
        console.log(jsonData);
        console.log(jsonData.type);
        // Create element
        activityElement = document.createElement('h2');
        // Set ID attribute to activity
        activityElement.setAttribute('id', "activity")
        // Create text for activity element
        activityText = document.createTextNode(`Try a ${jsonData.type} activity today. ${jsonData.activity}. You will need ${jsonData.participants} participant(s) and £${jsonData.price}.`);
        // append elements
        activityElement.append(activityText);
        renderElement.append(activityElement);
        console.log(renderElement);
      })
      .catch((error) => console.error(error));
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  });
}