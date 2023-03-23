// $("form").on("submit", function(event) {
//     event.preventDefault(); // prevent default behavior
  
//     // Get value of input field
//     const guess = $("input").val();
  
//     // Make AJAX request to Flask server
//     axios.post("/check-guess", { guess: guess })
//       .then(function(response) {
//         // Handle response from server
//         let result = response.data.result;
  
//         if (result === "ok") {
//           // Display success message
//           $("p").text(guess + " is a valid word on the board!");
//         } else if (result === "not-a-word") {
//           // Display error message for invalid word
//           $("p").text(guess + " is not a valid word!");
//         } else {
//           // Display error message for word not on board
//           $("p").text(guess + " is not on the board!");
//         }
//       });
//   });
  
//   let score = 0;

//   // Submit the guess when the form is submitted
//   document.getElementById("form").addEventListener("submit", function(event) {
//     event.preventDefault();
//     const guessInput = document.getElementById("guess");
//     let guess = guessInput.value;
//     guessInput.value = "";

//     fetch("/check-guess", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ guess: guess })
//     })
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(data) {
//       if (data.result === "ok") {
//         score += data.score;
//         document.getElementById("score").textContent = score;
//       } else {
//         alert("Invalid guess.");
//       }
//     });
//   });

// //timer

// let timer = 60; // set the countdown timer to 60 seconds

// function countdown() {
//   if (timer > 0) {
//     timer--;
//     setTimeout(countdown, 1000); // call the countdown function after 1 second
//   } else {
//     // disable any future guesses when the timer expires
//     document.getElementById("guess").disabled = true;
//     document.getElementById("btn").disabled = true;
//   }
// }

// // start the countdown timer when the game starts
// countdown();

//refractor to class


class BoggleGame {
    /* make a new game at this DOM id */
  
    constructor(boardId, secs = 60) {
      this.secs = secs; // game length
      this.showTimer();
  
      this.score = 0;
      this.words = new Set();
      this.board = $("#" + boardId);
  
      // every 1000 msec, "tick"
      this.timer = setInterval(this.tick.bind(this), 1000);
  
      $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }
  
    /* show word in list of words */
  
    showWord(word) {
      $(".words", this.board).append($("<li>", { text: word }));
    }
  
    /* show score in html */
  
    showScore() {
      $(".score", this.board).text(this.score);
    }
  
    /* show a status message */
  
    showMessage(msg, cls) {
      $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }
  
    /* handle submission of word: if unique and valid, score & show */
  
    async handleSubmit(evt) {
      evt.preventDefault();
      const $word = $(".word", this.board);
  
      let word = $word.val();
      if (!word) return;
  
      if (this.words.has(word)) {
        this.showMessage(`Already found ${word}`, "err");
        return;
      }
  
      // check server for validity
      const resp = await axios.get("/check-word", { params: { word: word }});
      if (resp.data.result === "not-word") {
        this.showMessage(`${word} is not a valid English word`, "err");
      } else if (resp.data.result === "not-on-board") {
        this.showMessage(`${word} is not a valid word on this board`, "err");
      } else {
        this.showWord(word);
        this.score += word.length;
        this.showScore();
        this.words.add(word);
        this.showMessage(`Added: ${word}`, "ok");
      }
  
      $word.val("").focus();
    }
  
    /* Update timer in DOM */
  
    showTimer() {
      $(".timer", this.board).text(this.secs);
    }
  
    /* Tick: handle a second passing in game */
  
    async tick() {
      this.secs -= 1;
      this.showTimer();
  
      if (this.secs === 0) {
        clearInterval(this.timer);
        await this.scoreGame();
      }
    }
  
    /* end of game: score and update message. */
  
    async scoreGame() {
      $(".add-word", this.board).hide();
      const resp = await axios.post("/post-score", { score: this.score });
      if (resp.data.brokeRecord) {
        this.showMessage(`New record: ${this.score}`, "ok");
      } else {
        this.showMessage(`Final score: ${this.score}`, "ok");
      }
    }
  }
  