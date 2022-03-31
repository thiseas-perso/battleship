import { displayShips, selectCoordinates, displayButtons, play } from './dom.js'
import { createPlayer } from './logic.js'


let humanPlayer, computer;
function setupGame(player) {
   humanPlayer = createPlayer(player);
   computer = createPlayer();
   humanPlayer.gameboard.initBoard();
   computer.gameboard.initBoard();
   displayButtons(humanPlayer)
   displayShips(humanPlayer);
   computer.gameboard.placeComputerShips()
   selectCoordinates(humanPlayer)
}

function launchGame() {
   play(humanPlayer, computer)
}



export { setupGame, launchGame }



