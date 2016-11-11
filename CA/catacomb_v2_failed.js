comment = `
Let the thing generate everything, after which it cleans the colours.
Generates a random catacomb map
Passages are black, treasure chests are golden
`

var RESOLUTION = 100

	var grid = makegrid(RESOLUTION, false)
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

var LENGTHYNESS = 0.9
var DEADENDS = 0.08
var SPLITS = 0.1

function rules(state)
{
	switch (state)
	{
		/*
			0 = WALL
			1/11 = going right
			2/12 = going left
			3/13 = going up
			4/14 = going down
			5 = dead end
			6 = 4-way
			+10 signifies "immune to splits/turns"
		*/
		case 0 : return function(c) //Wall
		{	

			if ([1].indexOf(c(-1, 0))>=0 
				|| [2].indexOf(c(1, 0))>=0 
				|| [3].indexOf(c(0, -1))>=0 
				|| [4].indexOf(c(0, 1))>=0)
					if (ran() < SPLITS)
						return 6
				

			if ( [1, 6, 11].indexOf(c(-1, 0))>=0 )
				if (c(-1, 0) === 11 || ran() < LENGTHYNESS)
					return 1
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [11, 13, 14][rani(3)]
			if ([2, 6, 12].indexOf(c(1, 0))>=0)
				if (c(1, 0)===12 || ran() < LENGTHYNESS)
					return 2
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [12, 13, 14][rani(3)]
			if ([3, 6, 13].indexOf(c(0, -1))>=0)
				if (c(0, -1)===13 || ran() < LENGTHYNESS)
					return 3
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [11, 13, 12][rani(3)]
			if ([4, 6, 14].indexOf(c(0, 1))>=0)
				if (c(0, 1) === 14 || ran() < LENGTHYNESS)
					return 4
				else
					if(ran() < DEADENDS)
						return 5
					else
						return [11, 12, 14][rani(3)]
			return c(0, 0)

		}
	}
	return function(context) { return context(0, 0) } //Identity
}

var count = 0
function next()
{
	console.log("nexting")
	for(i = 0; i<RESOLUTION; i++)
		for(j = 0; j<RESOLUTION; j++)
			buffer[i][j] = grid[i][j] //This is a snapshot of the current state, which will be used by the rules.
	for(i=0; i<RESOLUTION; i++)
		for(j=0; j<RESOLUTION; j++)
		{
			grid[i][j] = rules(buffer[i][j])(contextualize(buffer, i, j))
		}
	if (count++>170){
		clearInterval(inter);
		for(i=0; i<RESOLUTION; i++) //cleaning the results
		for(j=0; j<RESOLUTION; j++)
		{
			if (grid[i][j] == 5)
				grid[i][j] = 20
			else if (grid[i][j] != 0)
				grid[i][j] = 1;
			else
				grid[i][j] = 0

		}
	}
	draw();
}

grid[50][50] = [1, 2, 3, 4][rani(4)] //seed

// for (k=0; k<200; k++)
// 	next()

inter = setInterval(next, 10)