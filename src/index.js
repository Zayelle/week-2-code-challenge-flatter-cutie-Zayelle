document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000";
    const characterBar = document.getElementById("character-bar");
    const characterName = document.getElementById("name");
    const characterImage = document.getElementById("image");
    const characterVotes = document.getElementById("vote-count");
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");

    let selectedCharacter = null;

    // Fetch characters from the server and display in character bar
    function fetchCharacterDetails() {
        console.log("fetchCharacterDetails is running..."); // Debugging line
        fetch(`${baseURL}/characters`) // Fetch characters from serve
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();// Convert response to JSON
            })
            .then((data) =>{ 
                 console.log("Characters:", data); // Extract characters from data
                 characterBar.innerHTML = ""; // Clear previous entries to prevent duplicates
                 data.forEach((char) => {
                    const span = document.createElement("span");
                    span.textContent = char.name; // Set name
                    span.style.cursor = "pointer"; // Make clickable
                    span.addEventListener("click", () => displayCharacter(char)); // Add click event
                    characterBar.appendChild(span); // Append to character bar
                });
            })
            .catch((error) => console.error("Error fetching characters:", error));
    }

    // Function to add new character to character bar
    function addCharacterToBar(character) {
        if ([...characterBar.children].some(span => span.textContent === character.name)) return; // Prevent errors if element is missing
        const span = document.createElement("span");
        span.textContent = character.name; // Set name
        span.style.cursor = "pointer"; // Make clickable
        span.addEventListener("click", () => displayCharacter(character)); // Add click event
        characterBar.appendChild(span); // Append to character bar
    }       

    // Function to display characters in the DOM
    function displayCharacter(characters) {
      const characterList = document.getElementById("character-list");
      if (!characterList) return; // Prevent errors if element is missing
      characterList.innerHTML = ""; // Clear previous entries to prevent duplicates
  
    characters.forEach(character => {
      const li = document.createElement("li");
      li.textContent = `${character.name} - Power: ${character.power}`;
      characterList.appendChild(li);
    });
  }

    // Function to display character details when clicked
    function displayCharacter(character) {
        selectedCharacter = character;
        characterName.textContent = character.name;
        characterImage.src = character.image;
        characterImage.alt = character.name;
        characterVotes.textContent = character.votes || 0; // Display votes or 0 if none
        console.log(`Selected character:, ${character.name}, Votes: ${character.votes || 0}`);
    }

    // Handle votes form submission
    voteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!selectedCharacter) return;

        const votesInput = document.getElementById("votes").value;
        const votesToAdd = parseInt(votesInput, 10);

    // Prevent adding invalid votes
        if (isNaN(votesToAdd) || votesToAdd < 1) {
            console.error("Invalid votes:", votesInput);
            return;
        }
        const newVotes = (selectedCharacter.votes || 0) + votesToAdd;

    // Send PATCH request to update in backend
        fetch(`${baseURL}/characters/${selectedCharacter.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: newVotes })
        }
        )
        .then((response) => response.json())
        .then((updatedCharacter) => {
            selectedCharacter = updatedCharacter; // Assign entire object, not just votes
            characterVotes.textContent = updatedCharacter.votes; // Update votes in DOM
            })
        .catch((error) => console.error("Error updating votes:", error));

    voteForm.reset(); // Reset form after submission
    });

    // Handle reset votes button
    resetButton.addEventListener("click", () => {
        if (!selectedCharacter) return; // Prevent errors if no character is selected
 
        console.log(`Resetting votes for ${selectedCharacter.name}...`);

    // Confirm reset
        characterVotes.textContent = 0;

    // Send PATCH request to update in backend
       fetch(`${baseURL}/characters/${selectedCharacter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: 0 })
    })
      .then(response => response.json())
      .then(updatedCharacter => {
        selectedCharacter = updatedCharacter  || { ...selectedCharacter, votes: 0 }; // Fallback if response is missing data 
        characterVotes.textContent = selectedCharacter.votes; // Update votes in DOM
    })
      .catch(error => console.error("Error resetting votes:", error));
        
    });

    // Handle new character form submission (Save to the server and display in UI)
     characterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("name-input").value.trim();
        const imageInput = document.getElementById("image-input").value.trim();

        if (!nameInput || !imageInput) {
            console.error("Please enter a name and image URL.");
            return;
        }

        const powerInput = document.getElementById("power-input").value.trim();
        const newCharacter = {
            name: nameInput,
            image: imageInput,
            votes: 0,
            power: powerInput || "Unknown" //Set a default or allow user input
        };
    // Send POST request to save new character in backend
        fetch(`${baseURL}/characters`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        })
        .then((response) => response.json())
        .then((createdCharacter) => {
            addCharacterToBar(createdCharacter); // Add new character to UI
            displayCharacter(createdCharacter); // Show character details
            characterForm.reset(); // Clear form fields
        })
        .catch((error) => console.error("Error adding character:", error));
    });

    //Call the function INSIDE the event listener
fetchCharacterDetails();
});


