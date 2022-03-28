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



function displayShips(player) {
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

   selectOrient.appendChild(horLabel)
   selectOrient.appendChild(selectOrientationHor)
   selectOrient.appendChild(verLabel)
   selectOrient.appendChild(selectOrientationVer)
   screen.appendChild(selectOrient)
   screen.appendChild(list)
}

form.addEventListener('submit', function (e) {
   e.preventDefault()
   gameFlow(playerName.value)

   playerName.value = ''
   form.setAttribute('class', 'hidden')
   let banner = document.createElement('div')
   banner.innerText = 'Place your ships by selecting the ship and clicking on the square where you want it to start taking place'
   body.appendChild(banner)
})


function selectCoordinates(player) {
   const coordinates = {
      x: null,
      y: null,
      rotated: null
   };
   const squares = leftBoard.querySelectorAll('.square');
   squares.forEach(square => {
      square.addEventListener('click', (e) => {
         let orientation = document.querySelector('input[name="orient"]:checked').value
         coordinates.y = parseInt(e.target.id[1])
         coordinates.x = parseInt(e.target.id[4])
         coordinates.rotated = document.querySelector('input[name="orient"]:checked').value
         // return ({ y: parseInt(e.target.id[1]), x: parseInt(e.target.id[4]), rotated: orientation == 0 ? false : true })

      })
   })
   console.log(coordinates)
}


function selectShips() {
   let ships = document.querySelectorAll('.ship-display-row')
   ships.forEach(ship => ship.addEventListener('click', (e) => {
      ships.forEach(el => el.classList.remove('selected'));
      ship.classList.add('selected')
   }))
}


export { generateBoards, leftBoard, rightBoard, displayShips, selectShips }


// row.addEventListener('click', (e) => {
      //    let rows = document.querySelectorAll('.ship-display-row')
      //    rows.forEach(el => el.classList.remove('selected'))
      //    row.classList.add('selected')


      //    if (ship.quantity > 0) {
      //       let coordinates = {
      //          y: null,
      //          x: null,
      //          rotated: null
      //       };
      //       const squares = leftBoard.querySelectorAll('.square');
      //       squares.forEach(square => {
      //          square.addEventListener('click', (e) => {
      //             // console.log(ship)
      //             // let orientation = document.querySelector('input[name="orient"]:checked').value
      //             // coordinates.y = parseInt(e.target.id[1]);
      //             // coordinates.x = parseInt(e.target.id[4]);
      //             // coordinates.rotated = orientation == '0' ? false : true;
      //             // console.log('coordinates', coordinates)
      //             // player.gameboard.placeHumanShips(coordinates, ship)

      //          })
      //       })
      //    }
      // })