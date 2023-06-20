import { getHistory, renderWeatherData, getRandomItem, clearSearchResult, handleFormEvent, storeDataInLocalStorage, createElement } from "./utils.js";


let dataHistoryElement = document.querySelector("#data-history");
if (dataHistoryElement) {
  getHistory(dataHistoryElement);
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
let renderElement = document.querySelector('#data-render');
let errorMessage = document.querySelector("#errorMessage");

if (searchLink) {
  searchLink.addEventListener("click", function (event) {
    handleFormEvent(event, errorMessage, renderElement, handleFormSubmit);
  });
}

if (form) {
  form.addEventListener("submit", function (event) {
    handleFormEvent(event, errorMessage, renderElement, handleFormSubmit);
  });
}

const loadingIndicator = document.querySelector('#loadingIndicator');

function handleFormSubmit(event) {
  event.preventDefault();

  // Show loading indicator
  loadingIndicator.style.display = 'block';

  const input = document.querySelector("#search").value;

  // First promise
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=62f3a1ae06706d5807a4f7d172197411`,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .then((data) => {
    // Access the temperature value
    const temperature = Math.round(data.main.temp - 273.15);

    renderWeatherData(temperature, data.name, data.sys.country, renderElement);

    // Second promise
    let typeArray;
    if (temperature >= 20) {
      typeArray = JSON.parse(localStorage.getItem("hotTypeArray")) || ["social", "recreational", "charity"]; // Hot temperature activities
    } else {
      typeArray = JSON.parse(localStorage.getItem("coldTypeArray")) || ["education", "cooking", "relaxation"]; // Cold temperature activities
    }
    
    let randomType;
    if (typeArray.length > 0) {
      randomType = getRandomItem(typeArray);
    
      // Remove the selected type from the typeArray
      typeArray = typeArray.filter(type => type !== randomType);
    } else {
      // If the typeArray is empty, reset it to default based on the temperature condition
      typeArray = temperature >= 20 ? ["social", "recreational", "charity"] : ["education", "cooking", "relaxation"];
      randomType = getRandomItem(typeArray);
    }

    // Storing the updated typeArray in local storage
    if (temperature >= 20) {
      localStorage.setItem("hotTypeArray", JSON.stringify(typeArray));
    } else {
      localStorage.setItem("coldTypeArray", JSON.stringify(typeArray));
    }

    // Storing data in local storage as objects in an array

    const weatherDetails = {
      temperature: temperature,
      locationName: data.name,
      locationCountry: data.sys.country,
      date: new Date()
    }
    console.log(weatherDetails.temperature);

    storeDataInLocalStorage("weatherDetails", weatherDetails);

    fetch(`https://www.boredapi.com/api/activity?type=${randomType}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((jsonData) => {
        // Create element
        const activityElement = createElement('h2', 'activity', `Try a ${jsonData.type} activity today. ${jsonData.activity}.`);
        renderElement.append(activityElement);
      
        // Storing data in local storage
        const activityDetails = {
          activityType: jsonData.type,
          activity: jsonData.activity
        };

        let arr;
        if(localStorage.getItem("activityDetails") === null) {
         arr = [];
         console.log("This worked");
        } else {
          arr = JSON.parse(localStorage.getItem("activityDetails"));
        }
        arr.unshift(activityDetails);
        localStorage.setItem("activityDetails", JSON.stringify(arr))
        
        
        // Remove the selected type from the typeArray
        const filteredArray = typeArray.filter(type => type !== randomType);
        typeArray = filteredArray.length > 0 ? filteredArray : (temperature >= 20 ? ["social", "recreational", "charity"] : ["education", "cooking", "relaxation"]);

        console.log(filteredArray)
    

        // Reset typeArray to default values if empty
        if (typeArray.length === 0) { 
          if (temperature < 20) {
            typeArray = ["education", "relaxation", "cooking"];
          } else {
            typeArray = ["social", "recreational", "charity"];
          }
        }

        // Store the updated typeArray in local storage
        localStorage.setItem("typeArray", JSON.stringify(typeArray));
      })
      .catch((error) => console.error(error));

       // Hide loading indicator
       loadingIndicator.style.display = 'none';
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
     // Hide loading indicator
     loadingIndicator.style.display = 'none';

    // Array of error messages
  const errorMessages = [
    "Are you sure that city exists?",
    "Hmm, we've never heard of that place before.",
    "Oops! It seems like the city you entered doesn't exist.",
    "Sorry, we couldn't find any weather information for the city you entered.",
    "Please check the spelling and try again. The city you entered doesn't match any known locations.",
    "The city you entered is not recognized. Please enter a valid city name.",
    "Uh-oh! It appears that the city you entered is not in our database."
  ];

  // Select a random error message
      const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    // Display error message
    errorMessage.textContent = randomErrorMessage;

    console.error("Error:", error);
  });
}