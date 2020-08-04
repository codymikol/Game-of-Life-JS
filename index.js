(function () {

    'use strict';

    function GameBoard(height, width) {

        this.scale = 5

        this.height = height;
        this.width = width;

        this.container = document.getElementById('game-of-life');
        this.canvas = document.getElementById('gol')
        this.canvas.height = height * this.scale
        this.canvas.width = width * this.scale
        this.ctx = this.canvas.getContext('2d')

        this.canvas.style.height = this.height * this.scale + 'px'
        this.canvas.style.width = this.width * this.scale + 'px'

        this.cellMatrix = [];
        this.flatCellMap = [];

        this.getCell = function (x, y) {
            if (this.cellMatrix[y] && this.cellMatrix[y][x]) {
                return this.cellMatrix[y][x];
            } else {
                return null;
            }
        };

        this.getNeighborList = function (cell) {

            var self = this;

            return [
                {x: -1, y: -1},
                {x: 0, y: -1},
                {x: 1, y: -1},
                {x: -1, y: 0},
                {x: 1, y: 0},
                {x: -1, y: 1},
                {x: 0, y: 1},
                {x: 1, y: 1}
            ].map(function (nCell) {
                return self.getCell(cell.getX() + nCell.x, cell.getY() + nCell.y);
            }).filter(function (value) {
                return value !== null;
            });

        };

        this.getNeighborsAlive = function (cell) {
            return this.getNeighborList(cell).reduce(function (col, x) {
                return (x.alive) ? col + 1 : col;
            }, 0);
        };

        this.init = function () {

            var self = this;

            //Add rows
            for (var i = 0; i < self.height; i++) {
                self.cellMatrix.push([]);
            }

            //For every row add the width equivalent of cells
            self.cellMatrix = self.cellMatrix.map(function (row, yIndex) {
                for (var xIndex = 0; xIndex < self.width; xIndex++) {
                    var newCell = new Cell(xIndex, yIndex);
                    row.push(newCell);
                    self.flatCellMap.push(newCell);
                }
                return row;
            });

            //Seed some randomized living cells for the simulation
            self.flatCellMap.forEach(function (cell) {
                if (Boolean(Math.round(Math.random()))) {
                    cell.alive = true;
                }
            });

            //Start the simulation :O
            self.cycle();

        };

        var self = this;

        this.cycle = () => {



// Gotta use that silly color fun, stolen from SO
            // https://stackoverflow.com/questions/1484506/random-color-generator
            // Godspeed there Paolo Forgia, may your snippet be copy and pasted for
            // years and years to come.
            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            //Gotta get that rAF
            setTimeout(function () {

                self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

                //Spy on those pesky neighbors
                self.flatCellMap.forEach(function (cell) {

                    var livingNeighbors = self.getNeighborsAlive(cell);

                    if (cell.alive) {
                        if (livingNeighbors < 2 || livingNeighbors > 3) {
                            cell.lifeBuffer = 'dead';
                        }
                    } else {
                        if (livingNeighbors === 3) {
                            cell.lifeBuffer = 'alive';
                        }
                    }

                });

                //Update all dem cells
                self.flatCellMap.forEach(function (cell) {

                    var color;

                    if (cell.lifeBuffer === 'dead') {
                        cell.alive = false;
                        color = '#FFFFFF';
                    }

                    if (cell.lifeBuffer === 'alive') {
                        cell.alive = true;
                        color = getRandomColor();
                    }

                    cell.lifeBuffer = null;

                    cell.updateStaleness();

                    cell.draw(self.ctx, color, self.scale)

                });

                requestAnimationFrame(self.cycle);

            }, 10);

        };

    }

    function Cell(x, y) {

        this.x = x;
        this.y = y;


        this.staleness = 0;
        this.previousAlive = false;
        this.alive = false;

        this.updateStaleness = function () {

            var sameAsLast = this.alive !== this.previousAlive;

            if (!sameAsLast) {
                this.staleness = 0;
            } else {
                this.staleness = (this.staleness === 100) ? 100 : this.staleness + 1;
            }


        };

        this.getX = function () {
            return this.x;
        };

        this.getY = function () {
            return this.y;
        };

        this.draw = (ctx, color, scale) => {
            if(this.alive) {
                ctx.fillStyle = color;
                console.log()
                ctx.fillRect(this.x * scale, this.y * scale,  scale, scale);
            }
        }

    }

    window.onload = function () {

        var game = new GameBoard(200, 200);

        game.init();

    };

})();
