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

         if (this.checkAvailable(ship, coordinates) === -1) {
            this.placeShip(coordinates.y, coordinates.x, ship, coordinates.rotated)
            ship.quantity--;
            return true
         } else {

            return false
         }
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
         if (coordinates.rotated == false && coordinates.x + ship.length <= 10) {

            for (let i = 0; i < ship.length; i++) {
               if (this.boardArr[coordinates.y][coordinates.x + i] !== null) {
                  availability++
               }
            }
         } else if (coordinates.rotated == true && coordinates.y + ship.length <= 10) {

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

         if (this.boardArr[hitY][hitX] === null) {
            this.boardArr[hitY][hitX] = 'missed'

            return false
         } else {
            const succesHitIndex = this.boardArr[hitY][hitX].location.findIndex(position =>
               position.y == hitY && position.x == hitX)
            console.log("hit location ", this.boardArr[hitY][hitX])
            this.boardArr[hitY][hitX].hit(succesHitIndex);
            this.allSunk();

            return true
         }
      },
      allSunk() {
         if (this.shipsArr.length && this.shipsArr.every(ship => ship.sunk === true)) {
            console.log('all sunk')
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
         let result = {
            played: false,
            hitTarget: false
         };
         if ((this.plays.findIndex(play => play.y === y && play.x === x)) === -1) {
            if (opponent.gameboard.receiveAttack(y, x)) {
               result.hitTarget = true
               result.played = true
            } else {
               result.played = true
            }
            this.plays.push({ y, x });

         } else {
            console.log('already played')
         }
         return result
      },

      computerPlay(opponent, y = null, x = null, playingAgain = false) {

         let result = {
            hitTarget: false,
            y: -1,
            x: -1
         };

         if (playingAgain) {
            if (y + 1 < 10 && this.plays.findIndex(play => play.y === y + 1 && play.x === x) === -1) {
               console.log('computer attacking at ', { y: y + 1, x })
               if (opponent.gameboard.receiveAttack(y + 1, x)) {
                  result.hitTarget = true
                  console.log('computer hit target')
               } else {
                  console.log('computer missed')
               }
               this.plays.push({ y: y + 1, x });
               result.y = y + 1;
               result.x = x;
            } else if (y - 1 >= 0 && this.plays.findIndex(play => play.y === y - 1 && play.x === x) === -1) {
               console.log('computer attacking at ', { y: y - 1, x })
               if (opponent.gameboard.receiveAttack(y - 1, x)) {
                  console.log('computer hit target')
                  result.hitTarget = true
               } else {
                  console.log('computer missed')
               }
               this.plays.push({ y: y - 1, x });
               result.y = y - 1;
               result.x = x;
            } else if (x + 1 < 10 && this.plays.findIndex(play => play.y === y && play.x === x + 1) === -1) {
               console.log('computer attacking at ', { y, x: x + 1 })
               if (opponent.gameboard.receiveAttack(y, x + 1)) {
                  console.log('computer hit target')
                  result.hitTarget = true
               } else {
                  console.log('computer missed')
               }
               this.plays.push({ y, x: x + 1 });
               result.y = y;
               result.x = x + 1;
            } else if (x - 1 >= 0 && this.plays.findIndex(play => play.y === y && play.x === x - 1) === -1) {
               console.log('computer attacking at ', { y, x: x - 1 })
               if (opponent.gameboard.receiveAttack(y, x - 1)) {
                  console.log('computer hit target')
                  result.hitTarget = true
               } else {
                  console.log('computer missed')
               }
               this.plays.push({ y, x: x - 1 });
               result.y = y;
               result.x = x - 1;
            } else {
               console.log('already played nearby squares')
               return this.computerPlay(opponent)
            }
         } else if (!playingAgain) {
            y = Math.floor(Math.random() * 9);
            x = Math.floor(Math.random() * 9);

            if ((this.plays.findIndex(play => play.y === y && play.x === x)) === -1) {
               console.log('computer attacking at ', { y, x })
               if (opponent.gameboard.receiveAttack(y, x)) {
                  console.log('computer hit target')
                  result.hitTarget = true
               } else {
                  console.log('computer missed')
               }
               this.plays.push({ y, x });
            } else {
               console.log('computer already played ', { y, x })
               return this.computerPlay(opponent)
            }
            result.y = y;
            result.x = x;
         }
         console.log({ result })
         return result
      },
   }
}

export { createShip, createGameboard, createPlayer }


