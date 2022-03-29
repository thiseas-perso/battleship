import { gameFlow } from "./game.js"


const leftBoard = document.querySelector("#leftBoard")
const leftScreen = document.querySelector("#leftScreen")
const rightBoard = document.querySelector("#rightBoard")
const rightScreen = document.querySelector("#rightScreen")
const form = document.querySelector('form')
const playerName = document.querySelector('#player-name')
const body = document.querySelector('body')



function generateBoards(board) {
   for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
         const square = document.createElement('div')
         square.setAttribute('id', `y${i}-x${j}`)
         square.setAttribute('class', 'square')
         board.appendChild(square)
      }
   }
}

generateBoards(leftBoard);
generateBoards(rightBoard);

function displayButtons(player) {
   let selectOrient = document.createElement('div')
   selectOrient.classList.add('selectOrient')
   let selectOrientationHor = document.createElement('input')
   let selectOrientationVer = document.createElement('input')
   selectOrientationHor.setAttribute('type', 'radio')
   selectOrientationHor.setAttribute('id', 'hor')
   selectOrientationHor.setAttribute('name', 'orient')
   selectOrientationHor.setAttribute('value', '0')
   selectOrientationHor.setAttribute('checked', 'true')
   selectOrientationVer.setAttribute('type', 'radio')
   selectOrientationVer.setAttribute('id', 'ver')
   selectOrientationVer.setAttribute('name', 'orient')
   selectOrientationVer.setAttribute('value', '1')
   let horLabel = document.createElement('label')
   horLabel.setAttribute('for', 'hor')
   horLabel.innerText = 'Horizontal'
   let verLabel = document.createElement('label')
   verLabel.setAttribute('for', 'ver')
   verLabel.innerText = 'Vertical'
   let screen = player.name == null ? rightScreen : leftScreen;
   selectOrient.appendChild(horLabel)
   selectOrient.appendChild(selectOrientationHor)
   selectOrient.appendChild(verLabel)
   selectOrient.appendChild(selectOrientationVer)
   screen.appendChild(selectOrient)
}

function displayShips(player) {

   let screen = player.name == null ? rightScreen : leftScreen;
   let list = document.createElement('div')
   list.setAttribute('class', 'ship-display')

   player.gameboard.shipsStart.forEach(ship => {
      let row = document.createElement('div')
      row.setAttribute('class', 'ship-display-row')
      row.setAttribute('id', `${ship.name}X${ship.quantity}`)


      for (let i = 0; i < ship.length; i++) {
         let shipPart = document.createElement('div')
         shipPart.setAttribute('id', `${ship.name}-${i}`)
         shipPart.setAttribute('class', 'ship-part')
         row.appendChild(shipPart)
      }
      let count = document.createElement('div')
      count.setAttribute('class', 'ship-count')
      count.innerText = `x ${ship.quantity}`
      row.appendChild(count)
      list.appendChild(row)
   })

   screen.appendChild(list)
}





function selectCoordinates(player) {
   let ships = selectShips(player)
   const coordinates = {
      x: null,
      y: null,
      rotated: null
   };

   const squares = leftBoard.querySelectorAll('.square');
   squares.forEach(square => {
      square.addEventListener('click', (e) => {
         coordinates.y = parseInt(e.target.id[1])
         coordinates.x = parseInt(e.target.id[4])
         coordinates.rotated = document.querySelector('input[name="orient"]:checked').value == 0 ? false : true
         placeShips(player, ships, coordinates)
         ships = selectShips(player)
      })
   })

}


function selectShips(player) {
   let ships = document.querySelectorAll('.ship-display-row')
   let shipsArr = Array.from(ships)
   let index = shipsArr.findIndex((element) => parseInt(element.id[element.id.length - 1]) > 0)
   if (index >= 0) {
      ships[index].classList.add('selected')
   } else {
      document.querySelector('#banner').innerText = 'Start playing!'
      document.querySelector('.ship-display').remove()
      document.querySelector('.selectOrient').remove()
      leftBoard.replaceWith(leftBoard.cloneNode(true))
      console.log('start playing')
   }
   ships.forEach(ship => ship.addEventListener('click', (e) => {
      ships.forEach(el => el.classList.remove('selected'));
      ship.classList.add('selected')
   }))
   return shipsArr
}


function placeShips(player, ships, coordinates) {
   // let total = ships.reduce((total, item) => parseInt(item.id[item.id.length - 1]) + total, 0);
   let realTotal = player.gameboard.shipsStart.reduce((total, item) => item.quantity + total, 0)
   let selected = document.querySelector('.selected')
   let ship = player.gameboard.shipsStart.find(element => selected.id.includes(element.name));

   if (realTotal > 0 && player.gameboard.placeHumanShips(coordinates, ship)) {
      let old = document.querySelector('.ship-display')
      leftScreen.removeChild(old)
      displayShips(player)
      displayPositions(player)
      console.log('placed!! ', selected)

   } else {
      let old = document.querySelector('.ship-display')
      leftScreen.removeChild(old)
      displayShips(player)
      console.log('try again')
   }

}



function displayPositions(player) {
   let squares = leftScreen.querySelectorAll('.square')
   for (let i = 0; i < player.gameboard.boardArr.length; i++) {
      for (let j = 0; j < player.gameboard.boardArr[i].length; j++) {
         if (player.gameboard.boardArr[i][j] !== null) {
            squares.forEach((square) => {
               if (parseInt(square.id[1]) == i && parseInt(square.id[4]) == j) {
                  square.classList.remove('square')
                  square.classList.add('placed')
               }
            })
         }
      }
   }
}


function play() {
   const coordinates = {
      x: null,
      y: null,
   };
   const squares = rightBoard.querySelectorAll('.square');
   squares.forEach(square => {
      square.addEventListener('click', (e) => {
         coordinates.y = parseInt(e.target.id[1])
         coordinates.x = parseInt(e.target.id[4])
         console.log(coordinates)
      })
   })
}

form.addEventListener('submit', function (e) {
   e.preventDefault()
   gameFlow(playerName.value)
   playerName.value = ''
   form.setAttribute('class', 'hidden')
   let banner = document.createElement('div')
   banner.setAttribute('id', 'banner')
   banner.innerText = 'Place your ships by selecting the ship and clicking on the square where you want it to start taking place'
   body.appendChild(banner)
})





export { displayShips, selectCoordinates, displayButtons, play }


