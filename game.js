import { generateBoards, leftBoard, rightBoard, displayShips, selectShips, selectCoordinates, displayButtons } from './dom.js'
import { createShip, createGameboard, createPlayer } from './logic.js'


function gameFlow(player) {
   const humanPlayer = createPlayer(player);
   const computer = createPlayer();
   humanPlayer.gameboard.initBoard();
   computer.gameboard.initBoard();
   displayButtons(humanPlayer)
   displayShips(humanPlayer);
   computer.gameboard.placeComputerShips()
   console.log({ computer, humanPlayer })
   selectCoordinates(humanPlayer)



   return { humanPlayer, computer }
}


export { gameFlow }



