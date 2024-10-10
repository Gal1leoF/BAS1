let playerName = '';
let playerRoll = 0;
let computerRoll = 0;
let playerClaim = 0;
let lastClaim = 0;

document.getElementById('new-game').onclick = function() {
    playerName = document.getElementById('player-name').value || 'Játékos';
    document.getElementById('welcome-message').innerText = `Üdvözöllek, ${playerName}!`;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

document.getElementById('roll-dice').onclick = function() {
    playerRoll = rollDice();
    document.getElementById('player-roll').innerText = playerRoll;
    document.getElementById('dice-result').style.display = 'block';
    document.getElementById('player-claim').focus();
}

document.getElementById('submit-claim').onclick = function() {
    playerClaim = parseInt(document.getElementById('player-claim').value);
    if (!isNaN(playerClaim) && playerClaim > lastClaim) { // ellenőrzi, hogy nagyobb-e az előző elhitt számnál
        handleClaim(playerClaim);
    } else {
        alert('Adj meg egy érvényes és nagyobb számot az előzőnél!');
    }
}

document.getElementById('player-claim').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        playerClaim = parseInt(document.getElementById('player-claim').value);
        if (!isNaN(playerClaim) && playerClaim > lastClaim) {
            handleClaim(playerClaim);
        } else {
            alert('Adj meg egy érvényes és nagyobb számot az előzőnél!');
        }
    }
});

function rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    return parseInt(`${Math.max(die1, die2)}${Math.min(die1, die2)}`);
}

function handleClaim(claim) {
    if (claim >= playerRoll) {
        lastClaim = claim;
        document.getElementById('computer-message').innerText = 'A számítógép elhitte!';
        computerTurn(claim);
    } else {
        document.getElementById('computer-message').innerText = 'A számítógép nem hitte el! A számítógép nyert!';
        endGame();
    }
}

function computerTurn(previousClaim) {
    setTimeout(() => {
        computerRoll = rollDice();
        let computerClaim;

        if (computerRoll <= previousClaim) {
            computerClaim = getBluffNumber(previousClaim);
        } else {
            computerClaim = computerRoll;
        }

        document.getElementById('computer-message').innerText = `A számítógép dob... 3... 2... 1...`;

        setTimeout(() => {
            lastClaim = computerClaim; // Frissítjük a legutóbbi elhitt számot
            document.getElementById('computer-message').innerText = `A számítógép azt mondja, hogy: ${computerClaim}`;
            showPlayerOptions(computerClaim);
        }, 3000); // Visszaszámlálás után kiírja az eredményt
    }, 1000);
}

function getBluffNumber(previousClaim) {
    const possibleBluffs = [32, 41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66, 21];
    const validBluffs = possibleBluffs.filter(num => num > previousClaim);
    return validBluffs[Math.floor(Math.random() * validBluffs.length)];
}

function showPlayerOptions(computerClaim) {
    document.getElementById('belief-options').style.display = 'block'; // Előhozza a gombokat
    document.getElementById('belief-options').style.marginTop = '10px'; // Kicsi margó, hogy közvetlenül a szöveg alatt legyen
    document.getElementById('believe').onclick = function() {
        handlePlayerBelief(computerClaim, true);
    };
    document.getElementById('disbelieve').onclick = function() {
        handlePlayerBelief(computerClaim, false);
    };
}

function handlePlayerBelief(computerClaim, playerBelief) {
    document.getElementById('belief-options').style.display = 'none'; // Elrejti a gombokat

    if (playerBelief) {
        if (computerRoll < computerClaim) {
            document.getElementById('computer-message').innerText = 'A játék folytatódik...';
        } else {
            document.getElementById('computer-message').innerText = 'A számítógép igazat mondott! A játék folytatódik...';
        }
    } else {
        if (computerRoll < computerClaim) {
            endGame(`A játékos nyert! A számítógép valójában ezt dobta: ${computerRoll}`);
        } else {
            endGame('A számítógép igazat mondott, a számítógép nyert!');
        }
    }
}

function endGame(message = 'A játék véget ért!') {
    alert(message);
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('player-name').value = '';
}