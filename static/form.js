$("form").on("submit", function(event) {
    event.preventDefault(); // prevent default behavior
  
    // Get value of input field
    const guess = $("input").val();
  
    // Make AJAX request to Flask server
    axios.post("/check-guess", { guess: guess })
      .then(function(response) {
        // Handle response from server
        let result = response.data.result;
  
        if (result === "ok") {
          // Display success message
          $("p").text(guess + " is a valid word on the board!");
        } else if (result === "not-a-word") {
          // Display error message for invalid word
          $("p").text(guess + " is not a valid word!");
        } else {
          // Display error message for word not on board
          $("p").text(guess + " is not on the board!");
        }
      });
  });
  
  let score = 0;

  // Submit the guess when the form is submitted
  document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
    const guessInput = document.getElementById("guess");
    let guess = guessInput.value;
    guessInput.value = "";

    fetch("/check-guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ guess: guess })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.result === "ok") {
        score += data.score;
        document.getElementById("score").textContent = score;
      } else {
        alert("Invalid guess.");
      }
    });
  });

//timer

let timer = 60; // set the countdown timer to 60 seconds

function countdown() {
  if (timer > 0) {
    timer--;
    setTimeout(countdown, 1000); // call the countdown function after 1 second
  } else {
    // disable any future guesses when the timer expires
    document.getElementById("guess-input").disabled = true;
    document.getElementById("guess-button").disabled = true;
  }
}

// start the countdown timer when the game starts
countdown();