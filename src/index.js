// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const nameDisplay = document.getElementById("name");
    const imageDisplay = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");

  // Character Data
  const characters = [
    {
      id: 1,
      name: "Mr. Cute",
      image: "https://thumbs.gfycat.com/EquatorialIckyCat-max-1mb.gif",
      votes: 0,
    },
    {
      id: 2,
      name: "Mx. Monkey",
      image: "https://thumbs.gfycat.com/FatalInnocentAmericanshorthair-max-1mb.gif",
      votes: 0,
    },
    {
      id: 3,
      name: "Ms. Zebra",
      image: "https://media2.giphy.com/media/20G9uNqE3K4dRjCppA/source.gif",
      votes: 0,
    },
    {
      id: 4,
      name: "Dr. Lion",
      image: "http://bestanimations.com/Animals/Mammals/Cats/Lions/animated-lion-gif-11.gif",
      votes: 0,
    },
    {
      id: 5,
      name: "Mme. Panda",
      image: "https://media.giphy.com/media/ALalVMOVR8Qw/giphy.gif",
      votes: 0,
    },
  ];

  let selectedCharacter = null;

  // Populate Character Bar
  function loadCharacters() {
    characters.forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char.name;
      span.style.cursor = "pointer";
      span.addEventListener("click", () => displayCharacter(char));
      characterBar.appendChild(span);
    });
  }

  // Display Selected Character
  function displayCharacter(character) {
    selectedCharacter = character;
    nameDisplay.textContent = character.name;
    imageDisplay.src = character.image;
    imageDisplay.alt = character.name;
    voteCount.textContent = character.votes;
  }

  // Handle Vote Submission
  votesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedCharacter) return alert("Select a character first!");
    
    const voteInput = document.getElementById("votes");
    let newVotes = parseInt(voteInput.value, 10);
    
    if (isNaN(newVotes) || newVotes < 0) {
      alert("Please enter a valid number!");
      return;
    }

    selectedCharacter.votes += newVotes;
    voteCount.textContent = selectedCharacter.votes;
    voteInput.value = "";
  });

  // Reset Votes
  resetButton.addEventListener("click", () => {
    if (!selectedCharacter) return alert("Select a character first!");

    selectedCharacter.votes = 0;
    voteCount.textContent = selectedCharacter.votes;
  });

  // Initialize App
  loadCharacters();
});