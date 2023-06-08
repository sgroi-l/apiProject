// Access Bored's API
fetch("https://www.boredapi.com/api/activity")
    // wait for response
    .then((response) => {
        if(!response.ok){
            throw new Error(response.status);
        }
        return response.json();
    })
    // convert response into JSON
    .then((jsonData) => console.log(jsonData))
    .catch((error) => console.error)