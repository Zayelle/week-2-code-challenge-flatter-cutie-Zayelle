document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000";
    const characterBar = document.getElementById("character-bar");
    const characterName = document.getElementById("name");
    const characterImage = document.getElementById("image");
    const characterVotes = document.getElementById("vote-count");
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");

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
                 displayCharacters(data); // Display characters in the DOM
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

    // Function to display characters in the DOM
    function displayCharacters(characters) {
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
        characterVotes.textContent = character.votes;
    }

    // Handle votes form submission
    voteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!selectedCharacter) return;

        const votesInput = document.getElementById("votes").value;
        const votesToAdd = parseInt(votesInput, 10);

        if (!isNaN(votesToAdd)) {
            selectedCharacter.votes += votesToAdd;
            characterVotes.textContent = selectedCharacter.votes;
        }

        voteForm.reset();
    });

    // Handle reset votes button
    resetButton.addEventListener("click", () => {
        if (selectedCharacter) {
            selectedCharacter.votes = 0;
            characterVotes.textContent = 0;
        }
    });

    //Call the function INSIDE the event listener
fetchCharacterDetails();
});


