import { generateBoards, leftBoard, rightBoard, displayShips, selectShips } from './dom.js'
import { createShip, createGameboard, createPlayer } from './logic.js'


function gameFlow(player) {
   const humanPlayer = createPlayer(player);
   const computer = createPlayer();
   humanPlayer.gameboard.initBoard();
   computer.gameboard.initBoard();
   displayShips(humanPlayer);
   computer.gameboard.placeComputerShips()
   console.log({ computer, humanPlayer })
   selectShips()
   // selectCoordinates()


   return { humanPlayer, computer }
}


export { gameFlow }



