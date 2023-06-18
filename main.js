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
let renderElement = document.querySelector('#data-render')


searchLink.addEventListener("click", function(event) {
  event.preventDefault()
  // refresh content
  renderElement.textContent = "";
  handleFormSubmit(event);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  renderElement.textContent = "";
  handleFormSubmit(event);
});

function handleFormSubmit(event) {
  event.preventDefault();

  const input = document.querySelector("#search").value;
  // console.log("Input value:", input);


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

    // Use the temperature value as needed
    // console.log(`Temperature in ${data.name}, ${data.sys.country}: ${temperature}\u00B0`);
    // Create element
    const temperatureElement = document.createElement("h1");
    const locationElement = document.createElement("p");
    temperatureElement.setAttribute("id", "temperature");
    locationElement.setAttribute("id", "location");
    let temperatureText = document.createTextNode(`${temperature}\u00B0C`)
    let locationText = document.createTextNode(`${data.name}, ${data.sys.country}`)
    // append elements 
    renderElement.append(temperatureElement);
    renderElement.append(locationElement);
    temperatureElement.append(temperatureText);
    locationElement.append(locationText);
    // console.log(renderElement);
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
      temperature: temperatureElement,
      location: locationElement
    }
    console.log(weatherDetails.temperature)
    let arr;
    if(localStorage.getItem("weatherDetails") === null) {
     arr = [];
     console.log("This worked");
    } else {
      arr = JSON.parse(localStorage.getItem("weatherDetails"));
    }
    arr.unshift(weatherDetails);
    localStorage.setItem("weatherDetails", JSON.stringify(arr))



    fetch(`https://www.boredapi.com/api/activity?type=${randomType}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((jsonData) => {
        // console.log(jsonData);
        console.log(jsonData.type);
        // Create element
        const activityElement = document.createElement('h2');
        // Set ID attribute to activity
        activityElement.setAttribute('id', "activity")
        // Create text for activity element
        let activityText = document.createTextNode(`Try a ${jsonData.type} activity today. ${jsonData.activity}.`);
        // append elements
        activityElement.append(activityText);
        renderElement.append(activityElement);
        // console.log(renderElement);

        // Storing data in local storage
        const activityDetails = {
          activity: activityElement
        }

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
        console.log(typeArray);

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
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  });
}