// ENG / PL
// List of all cards 
// Lista wszystkich kart
let objects = ['anchor', 'anchor', 'bicycle', 'bicycle', 'bolt', 'bolt', 'bomb', 'bomb', 'cube', 'cube', 'diamond','diamond', 'leaf', 'leaf', 'paper-plane-o', 'paper-plane-o'],


    
    // jQuery shortcut selectors 
    // Skróty do jQuery
    $container = $('.container'),
    $scorePanel = $('.score-panel'),
    $rating = $('.fa-star'),
    $moves = $('.moves'),
    $timer = $('.timer'),
    $restart = $('.restart'),
    $deck = $('.deck'),
   
    
    
    // Set var 
    // Ustawienie stałych
    nowTime,
    allOpen = [],
    match = 0,
    second = 0,
    moves = 0,
    wait = 600,
    totalCard = objects.length / 2,

    
    // Scoring system 
    // Punktacja
    stars3 = 10,
    stars2 = 15,
    star1 = 20;
    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     */

    // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
}



//The function init() enable to start the game 
// Funkcja pozwala zacząć grę
function init() {

    // The shuffle function shuffles the objects array 
    // Funkcja do tasowania obiektów w tablicy
    let allCards = shuffle(objects);
    $deck.empty();

    // The game starts with no matching cards and zero moves 
    // Gra zaczyna się z 0 ruchów i z 0 pasujących kart
    match = 0;
    moves = 0;
    $moves.text('0');

    
    // Loop which creates 16 <li> tags with the class of card for every <i> tag 
    // Pętla tworzy 16 klas <li>, która każda posiada tag <i>
    for (let i = 0; i < allCards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + allCards[i] + '"></i></li>'))
    }
    addCardListener();
    
    //Just game restart :D which reset time to 0. 
    // Reset gry
    resetTimer(nowTime);
    second = 0;
    $timer.text(`${second}`)
    initTime();
}

// Add a score depending on the amount of moves done 
// Licznik punktacji bazujący na ilości wykonanych ruchów
function rating(moves) {
    let rating = 3;
    if (moves > stars3 && moves < stars2) {
        $rating.eq(3).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars2 && moves < star1) {
        $rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > star1) {
        $rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return { score: rating };
}

// Add boostrap modal alert window showing time, moves, score it took to finish the game, toggles when all pairs are         matched.
// Wyskakujący komunikat, który pojawia się po końcu gry, gdy mamy wszystkie pary
function gameOver(moves, score) {
    $('#winnerText').text(`In ${second} seconds, you did a total of ${moves} moves with a score of ${score}. Well done!`);
    $('#winnerModal').modal('toggle');
}


// Clicking on the button located on the top right enables the cards too be reset
// Button, który pozwala zresetować gre 
$restart.bind('click', function (confirmed) {
    if (confirmed) {
        $rating.removeClass('fa-star-o').addClass('fa-star');
        init();
    }
});


// This function allows each card to be validated that is an equal match to another card that is clicked on to stay open.
// If cards do not match, both cards are flipped back over.
// Funkcja pozwala nam sprawdzić czy karty się zgadzać. Pozwala pozostawić pierwszą kartę otwartą dopóki nie sprawdzimy czy // nie pasuję do drugiej. Jeżeli nie pasuje to znowu się obróci.
let addCardListener = function () {

    // With the following, the card that is clicked on is flipped
    // Kliknięta karta się odwraca
    $deck.find('.card').bind('click', function () {
        let $this = $(this);

        if ($this.hasClass('show') || $this.hasClass('match')) {
            return true;
        }

        let card = $this.html();
        $this.addClass('open show');
        allOpen.push(card);

        // Compares cards if they matched
        // Sprawdzenie czy karty pasują
        if (allOpen.length > 1) {
            if (card === allOpen[0]) {
                $deck.find('.open').addClass('match animated bounceIn');
                setTimeout(function () {
                    $deck.find('open').removeClass('open show');
                }, wait);
                match++;

                // If cards are not matched
                // Jeżeli karty nie pasują
            } else {
                $deck.find('.open').addClass('notmatch');
                setTimeout(function () {
                    $deck.find('.open').removeClass('open show');
                }, wait / 1.5);
            }

            // The allOpen array specifies all added cards facing up
            // Tablica określa wszystkie dodane karty aversem
            allOpen = [];

            // Increments the number of all moves
            // Dodaje ilość wykonanych ruchów kiedy kart pasują lub nie
            moves++;

            // The number of moves is added to the rating() function that will determine the star score
            // Określenie naszego wyniku z funkcją rating()
            rating(moves);

            // The number of moves are added to the modal HTML alert
            // Liczba ruchów jest dodawana do modalnego powiadomienia 
            $moves.html(moves);
        }

        // The game is finished once all cards have been matched, with a short delay
        // Gra kończy się, gdy wszystkie karty zostaną dopasowane, z krótkim opóźnieniem
        if (totalCard === match) {
            rating(moves);
            let score = rating(moves).score;
            setTimeout(function () {
                gameOver(moves, score);
            }, 500);
        }
    });
}

// Initiates the timer as soon as the game is loaded
// Inicjacja czasu jak najszybciej gdy zacznie się gra
function initTime() {
    nowTime = setInterval(function () {
        $timer.text(`${second}`)
        second = second + 1
    }, 1000);
}

// Resets the timer when the game ends or is restarted
// Resetuje timer po zakończeniu gry lub po ponownym uruchomieniu
function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}

init();