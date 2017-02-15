
$(document).ready(function() {


	//declare city objects.
	var florence = generateCity("Florence", "photo", "assets/images/florence.jpg");
	var melbourne = generateCity("Melbourne", "photo", "assets/images/melbourne.jpg");
	var beijing = generateCity("Beijing", "photo", "assets/images/beijing.jpg");
	var dallas = generateCity("Dallas", "photo", "assets/images/dallas.jpg");
	var edinburgh = generateCity("Edinburgh", "photo", "assets/images/edinburgh.jpg");
	var sanFrancisco = generateCity("San Francisco", "photo", "assets/images/sanFrancisco.jpg");
	var sydney = generateCity("Sydney", "photo", "assets/images/sydney.jpg");
	var longestCity = generateCity("Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch", "video", "https://www.youtube.com/embed/fHxO0UdpoxM");


	//function to create new cities
	function generateCity (name, imageType, imageLink) {
		var city = {
			name: name,
			imageType: imageType,
			imageLink: imageLink 
		}
		return city;
	}


	//declare variables;
	var cities = [florence, melbourne, beijing, dallas, edinburgh, sanFrancisco, sydney, longestCity];
	var hangmanImgArray = [];
	var letters = /^[A-Za-z]+$/;		//regex used to determine if the guess is a letter or not
	var currGame = ""
	var lowerGame = ""
	var solution = [];
	var usedLetters = [];					
	var numberWrong = 0;
	var randomNumber = 0;
	var guess = "";
	var displaySolution = $(".gameBoard");
	var displayLetters = $("<p>");
	var gameOver = "no";
	var currentHangman = "";
	var currentHangmanImage = $(".hangman");

	$(displaySolution).attr("class", "usedHeader");
	$(displayLetters).attr("class", "letterTracker");

	//assign hangman image based on number of wrong guesses
	for (i = 0; i < 7; i++) {
		hangmanImgArray[i] = new Image();
		hangmanImgArray[i].src = "assets/images/gallows" + i + ".png"; 
	}

	//when reset button is pushed, clear the letters used from the DOM and start a new game
	$(".resetButton").on("click", function() {
			$(".usedArea").empty();
			startGame()
  	});
	
	startGame();


	//when game is started, reset variables to default values
	//display Letters Used header and create Letters Used area
	//takes random city from array and creates matching solution 
	//(starts as all _ values) to display.
	function startGame() {
		randomNumber = Math.floor(Math.random()*cities.length);
		currGame = cities[randomNumber].name;
		lowerGame = currGame.toLowerCase();
		currentHangmanImage.attr("src", hangmanImgArray[0].src);
		solution = [];
		usedLetters = [];					
		numberWrong = 0;
		guess = "";
		gameOver = "no";
		letterHeader = $("<h1>Letters Used</h1>"); 
		$(".usedArea").append(letterHeader);
		displayLetters.html(showUsedLetters())	
		$(".usedArea").append(displayLetters);
		showUsedLetters();


		//loops through the challenge word and sets the solution variable to underscores
		//to display to the user as unsolved letters.
		for (var i = 0; i < currGame.length; i++) {
			if (currGame[i] === " "){
				solution[i] = "\xa0\xa0";
			}
			else {
				solution[i] = "_";
			}
		};
		showSolution();
	};
	
	//display letters used in alphabetical order
	function showUsedLetters() {
		$(displayLetters).html(usedLetters.sort().join("\xa0\xa0"));
	}

	//display solution in-progress to user. 
	//assign appropriate class based on length of city name
	function showSolution() {
		if (solution.length > 20) {
			$(displaySolution).attr("class", "longSolution");
		} else {
			$(displaySolution).attr("class", "shortSolution");
		}

		$(displaySolution).html(solution.join("\xa0"));
	};



	//get guess from user.  			
	document.onkeyup = function(event) {
        guess = event.key;
        if (guess.match(letters)) {
        	checkLetter(guess);
    	}
    }
      





	//check to see if the guess is part of the usedLetters array. If not, add it.
	//display the array to the user in alphabetical order
	//if it is already part of that array, ignore it and move to the next if statement
	
	function checkLetter(letter) {
		//check to see if the guess is part of the goal word and also
		//check to see if the letter has been guessed before
		//if it is not, add 1 to the numberWrong variable 
		//(and draw the next piece of the stick-figure)
		//if game is over, display complete word and related image

		if (gameOver === "no" && lowerGame.indexOf(letter.toLowerCase()) == -1 && usedLetters.indexOf(letter.toUpperCase()) === -1) {
			numberWrong++;
			usedLetters.push(letter.toUpperCase());
			showUsedLetters();
		}

		else if (gameOver === "no" && usedLetters.indexOf(letter.toUpperCase()) === -1) {

			usedLetters.push(letter.toUpperCase());
			showUsedLetters();


		//if the guess is part of the goal word, update the solution array
		//everywhere the letter appears.

			for (var i = 0; i < solution.length; i++) {
				if (lowerGame[i] === letter.toLowerCase()) {
					solution[i] = currGame[i];
				}
			}

		}

		//after all locations are updated, display the updated solution
		//to the user.

		showSolution();

		//show hangman image based on number of wrong guesses
		currentHangmanImage.attr("src", hangmanImgArray[numberWrong].src);

		//if game is over, update gameOver variable. If game was won, display won image
		if (numberWrong == 6) {
			gameOver = "loss";

		} else if (solution.indexOf("_") === -1) {
			gameOver = "win";
			currentHangmanImage.attr("src", "assets/images/gallowsWin.png");
			}


		//if the game is over, display the video or image associated with the city used
		if (gameOver != "no") {
			//update solution to fill in all letters
			for (var i = 0; i < currGame.length; i++) {
				if (currGame[i] === " "){
					solution[i] = "\xa0\xa0";
				}
				else {
					solution[i] = currGame[i];
				}
			};
			showSolution();
			//if the image type is video, embed the youtube video
			if (cities[randomNumber].imageType == "video") {
			videoDiv = $("<iframe>");
			videoDiv.attr({
				src: cities[randomNumber].imageLink,
				width: "600",
				height: "400",
				frameborder: "0",
				allowfullscreen: ""});
			// videoDiv.attr("width", "800");
			$(".usedArea").append(videoDiv);
			} else {
				//if the image type is not video, it is a photo that should be displayed
				pictureDiv = $("<img>");
				pictureDiv.attr({src: cities[randomNumber].imageLink,
				width: "600",
				height: "400"
				});		
				$(".usedArea").append(pictureDiv);	
			}
		}
	};
});


