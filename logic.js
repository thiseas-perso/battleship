function createShip(ship) {
   return {
      length: ship.length,
      name: ship.name,
      location: [],
      sunk: false,
      hit(loc) {
         this.location[loc].hit = true;
         this.isSunk();
      },
      isSunk() {
         if (this.location.every(element => element.hit === true)) {
            this.sunk = true
         }
      },
      rotated: false,
   }
}

function createGameboard() {
   return {
      shipsArr: [],
      shipsStart: [
         {
            name: 'Carrier',
            length: 5,
            quantity: 1
         },
         {
            name: 'Battleship',
            length: 4,
            quantity: 1
         },
         {
            name: 'Destroyer',
            length: 3,
            quantity: 1
         },
         {
            name: 'Submarine',
            length: 3,
            quantity: 2
         },
         {
            name: 'Patrol',
            length: 2,
            quantity: 2
         }
      ],
      boardArr: null,
      initBoard() {
         this.boardArr = new Array(10);
         for (let i = 0; i < 10; i++) {
            this.boardArr[i] = new Array(10).fill(null)
         }
      },

      placeShip(yStart, xStart, ship, rotated) {
         // console.log('placing ', ship.name)
         if (!rotated) {
            let newShip = createShip(ship);
            newShip.rotated = rotated;
            this.shipsArr.push(newShip)

            for (let i = 0; i < ship.length; i++) {
               this.boardArr[yStart][xStart + i] = newShip
               newShip.location.push({ y: yStart, x: xStart + i, hit: false })
            }
         } else if (rotated) {
            let newShip = createShip(ship);
            newShip.rotated = rotated;
            this.shipsArr.push(newShip)

            for (let i = 0; i < ship.length; i++) {
               this.boardArr[yStart + i][xStart] = newShip
               newShip.location.push({ y: yStart + i, x: xStart, hit: false })
            }
         }

      },
      placeHumanShips(coordinates, ship) {
         // this.shipsStart.forEach(ship => {
         // while (ship.quantity > 0) {
         if (this.checkAvailable(ship, coordinates) === -1) {
            console.log("placing : ", { y: coordinates.y, x: coordinates.x, name: ship.name, rotated: coordinates.rotated })
            this.placeShip(coordinates.y, coordinates.x, ship, coordinates.rotated)
            ship.quantity--;
         } else {
            console.log('not possible')
         }
         // }
         // })

      },

      placeComputerShips() {
         this.shipsStart.forEach(ship => {
            while (ship.quantity > 0) {
               let coordinates = this.generateCoordinates()

               if (this.checkAvailable(ship, coordinates) === -1) {

                  this.placeShip(coordinates.y, coordinates.x, ship, coordinates.rotated)
                  ship.quantity--;

               }
            }
         })

      },


      generateCoordinates() {
         let rotated = Math.random() > 0.5 ? true : false;
         let y = Math.floor(Math.random() * 9)
         let x = Math.floor(Math.random() * 9)
         return { y, x, rotated }
      },

      checkAvailable(ship, coordinates) {
         let availability = -1
         if (coordinates.rotated == false && coordinates.x + ship.length < 10) {

            for (let i = 0; i < ship.length; i++) {
               if (this.boardArr[coordinates.y][coordinates.x + i] !== null) {
                  availability++
               }
            }
         } else if (coordinates.rotated == true && coordinates.y + ship.length < 10) {

            for (let i = 0; i < ship.length; i++) {
               if (this.boardArr[coordinates.y + i][coordinates.x] !== null) {
                  availability++
               }
            }
         } else {
            availability = 0;
         }
         return availability;
      },

      receiveAttack(hitY, hitX) {
         if (!this.boardArr[hitY][hitX]) {
            this.boardArr[hitY][hitX] = 'missed'
            console.log('missed !!!')
         } else {
            const succesHitIndex = this.boardArr[hitY][hitX].location.findIndex(position =>
               position.y == hitY && position.x == hitX)
            this.boardArr[hitY][hitX].hit(succesHitIndex);
            this.allSuck();
            console.log('ship hit !!!')
         }
      },
      allSunk() {
         if (this.shipsArr.length && this.shipsArr.every(ship => ship.sunk === true)) {
            return true
         } else {
            return false
         }
      }
   }
}

function createPlayer(name = null) {
   return {
      name,

      gameboard: createGameboard(),
      plays: [],
      humanPlay(opponent, y, x) {
         if ((this.plays.findIndex(play => play.y === y && play.x === x)) === -1) {
            opponent.gameboard.receiveAttack(y, x);
            this.plays.push({ y, x });
         } else {
            console.log('already played')
            this.computerPlay(opponent)
         }
      },

      computerPlay(opponent) {
         let y = -1;
         let x = -1;
         function generateCoordinates() {
            y = Math.floor(Math.random() * 9)
            x = Math.floor(Math.random() * 9)
         }
         generateCoordinates();
         if ((this.plays.findIndex(play => play.y === y && play.x === x)) === -1) {
            opponent.gameboard.receiveAttack(y, x);
            this.plays.push({ y, x });
         } else {
            console.log('already played')
            this.computerPlay(opponent)
         }
      },
   }
}

export { createShip, createGameboard, createPlayer }


