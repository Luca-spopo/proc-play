comment =
`
Takes an inital small tiled map, and keeps upscaling it while randomly swapping neighbours.
The chances of swapping increase with every iteration,
hence powdery smudge is common, but chances of massive displacements are low.
This would be an excellent way to mix certain biomes in minecraft.
`

var RESOLUTION = 1280

	var grid = makegrid(RESOLUTION, false) //50*20, 130*20, 170*20
	var draw = grid[1]
	grid = grid[0]

var buffer;

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


Array.prototype.count = function()
{
	var count = 0
	var args = []
	for(var i = 0; i<arguments.length; i++)
	{
		args[i] = arguments[i]
	}
	for(i=0; i<this.length; i++)
	{
		if( args.indexOf(this[i])!=-1 )
			count++
	}
	return count
}

Array.prototype.hasAny = function()
{
	var count = 0
	for(var i=0; i<arguments.length; i++)
	{
		if (this.indexOf(arguments[i]) != -1)
			return true
	}
	return false
}

var RIGIDITY = 2
var cdim = 5
var passes = 5


function decay()
{
	RIGIDITY *= 0.7
}


function rules(c)
{
	if (ran() < RIGIDITY)
		return c(0, 0)
	else
		return [c(-1, 0), c(0, -1), c(0, 1), c(1, 0)][rani(4)]
}

function next()
{

	if(cdim > RESOLUTION)
	{
		return
	}
	var i, j
	

	// console.log(buffer[1][.length], grid[0][0])
	// buffer[0][0] = grid[0][0]

	buffer = new Array(cdim)
	for (i=0; i<cdim; i++)
    buffer[i] = new Uint8Array(cdim)

	for(i = 0; i<cdim; i++)
		for(j = 0; j<cdim; j++)
			buffer[i][j] = grid[i][j] //This is a snapshot of the current state, which will be used by the rules.
	
	cdim = cdim*2
	passes--
	decay()

	for(i=0; i<cdim; i++)
		for(j=0; j<cdim; j++)
		{
			var si = Math.floor(i/2)
			var sj = Math.floor(j/2)
			grid[i][j] = rules(contextualize(buffer, si , sj), si, sj)
		}
	
	draw();
	// console.log(count++)
}

var map = [
[12, 14, 12, 12, 12],
[12, 14, 18, 18, 12],
[12, 16, 14, 18, 12],
[12, 17, 16, 14, 12],
[12, 17, 14, 14, 14]
]

// var map = [
// [1, 2, 3, 4, 5],
// [2, 3, 4, 5, 6],
// [3, 4, 5, 6, 7],
// [4, 5, 6, 7, 8],
// [5, 6, 7, 8, 9]
// ]

for (var ki = 0; ki < map.length; ki++)
	for(var kj = 0; kj < map[ki].length; kj++)
	{
		grid[ki][kj] = map[ki][kj]
	}

// for (k=0; k<200; k++)
// 	next()

// for(i=0; i<RESOLUTION; i++) //cleaning the results
// 		for(j=0; j<RESOLUTION; j++)
// 		{
// 			if (grid[i][j] == 5)
// 				grid[i][j] = 20
// 			else if (grid[i][j] != 0)
// 				grid[i][j] = 1;
// 			else
// 				grid[i][j] = 0

// 		}
// draw();

draw()

var inter = setInterval(next, 10)