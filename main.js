// Function to generate a random item from an array
function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const form = document.querySelector("#searchForm");
const searchLink = document.querySelector('#searchLink'); // I replaced the submit button on the form with an icon. 
const renderElement = document.querySelector('#data-render')


searchLink.addEventListener("click", function(event) {
  event.preventDefault()
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
    weatherElement = document.createElement("h1");
    weatherElement.setAttribute("id", "weather");
    weatherText = document.createTextNode(`${data.name}, ${data.sys.country}: ${temperature}\u00B0C`)
    // append elements 
    renderElement.append(weatherElement);
    weatherElement.append(weatherText);
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