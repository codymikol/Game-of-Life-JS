# Game-of-Life-JS

This is a simple implementation of the Conway's Game of Life Simulation with a couple of different twists added for fun.

The siulation is made up of a 100 x 100 grid, and each cell on the grid represents a potential living organism
that can either do nothing, die, or come to life.

The rules are simple. 

1. If a living cell has less than two neighbors, it dies in the next generation.

2. If a living cell has more than three neighbors, it dies in the next generation.

3. If a living cell has two or three neighbors, it survives in the next generation.

4. If a dead cell has exactly three neighbors, it will come to life.

Every 100ms the board is evaluated and updated to the next genration. While the rules are simple, 
really interesting patterns can come as a result.

I also added two other bits for fun. Each newborn cell will take on a random color and the longer
a cell survives over generations, it will slowly fade into grayscale.




