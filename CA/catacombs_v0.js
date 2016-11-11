comment = `
Generates a random catacomb map
`

var RESOLUTION = 100

	var grid = makegrid(RESOLUTION, 255*255, 255*255, 255*255)
	var draw = grid[1]
	grid = grid[0]

var buffer = new Array(RESOLUTION)
for (i=0; i<RESOLUTION; i++)
    buffer[i] = new Uint8Array(i*RESOLUTION)

function contextualize(arr, i, j)
{
	return function(x, y)
	{
		x = (x+i+arr.length)%arr.length //Negative mods are a problem, hence the arbitrary add. Fix it to make a %%
		y = (y+j+arr[x].length)%arr[x].length

		return arr[x][y]
	}
}

var ran = Math.random
var rani = function(x)
{
	return Math.floor(ran()*x)
}

var LENGTHYNESS = 0.95
var DEADENDS = 0.03
var SPLITS = 0.033

function rules(state)
{
	switch (state)
	{
		/*
			0 = WALL
			1 = going right
			2 = going left
			3 = going up
			4 = going down
			5 = dead end
			6 = 4-way
		*/
		case 0 : return function(c) //Wall
		{	
			if ( [1, 6].indexOf(c(-1, 0))>=0 )
				if (ran() < LENGTHYNESS)
					if (ran() < SPLITS)
						return 6
					else
						return 1
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [1, 3, 4][rani(3)]
			if ([2, 6].indexOf(c(1, 0))>=0)
				if (ran() < LENGTHYNESS)
					if (ran() < SPLITS)
						return 6
					else
						return 2
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [2, 3, 4][rani(3)]
			if ([3, 6].indexOf(c(0, -1))>=0)
				if (ran() < LENGTHYNESS)
					if (ran() < SPLITS)
						return 6
					else
						return 3
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [1, 3, 2][rani(3)]
			if ([4, 6].indexOf(c(0, 1))>=0)
				if (ran() < LENGTHYNESS)
					if (ran() < SPLITS)
						return 6
					else
						return 4
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [1, 2, 4][rani(3)]
			return c(0, 0)

		}
	}
	return function(context) { return context(0, 0) } //Identity
}

function next()
{
	for(i = 0; i<RESOLUTION; i++)
		for(j = 0; j<RESOLUTION; j++)
			buffer[i][j] = grid[i][j] //This is a snapshot of the current state, which will be used by the rules.
	for(i=0; i<RESOLUTION; i++)
		for(j=0; j<RESOLUTION; j++)
		{
			grid[i][j] = rules(buffer[i][j])(contextualize(buffer, i, j))
		}
	draw();
}

grid[50][50] = [1, 2, 3, 4][rani(4)]

// for (k=0; k<2000; k++)
// 	next()

// for(i=0; i<RESOLUTION; i++) //cleaning the results
// 		for(j=0; j<RESOLUTION; j++)
// 		{
// 			if (grid[i][j] != 0)
// 				grid[i][j] = 1;
// 			else
// 				grid[i][j] = 0

// 		}
// draw();

var inter = setInterval(next, 10)