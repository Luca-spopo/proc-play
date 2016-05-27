var RESOLUTION = 300

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
		x = (x+i)%arr.length
		y = (y+j)%arr[x].length

		return arr[x][y]
	}
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

var WALLYNESS = 0.35
var TREASURENESS = 0.01
var WALLYNESS_DECAY_COEFF = 0.998


function rules(state)
{
	switch (state)
	{
		case 0 :
		return function(c)
		{
			if ([c(-1, 0), c(0, -1), c(0, 1),c(1, 0)].hasAny(10))
				return 1

			if ([c(-1, 0), c(0, -1), c(0, 1),c(1, 0)].hasAny(2))
				if (WALLYNESS < Math.random() )
						return 2
				else if (Math.random() < TREASURENESS)
					return 10 //treasure
				else
					return 1
			else
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
	WALLYNESS = WALLYNESS/WALLYNESS_DECAY_COEFF
}

grid[150][150] = 2
// var l
// for (l=0; l<300; l++)
// 	next()

// //Sanitation:
// for(l=0; l<RESOLUTION; l++)


var inter = setInterval(next, 10)