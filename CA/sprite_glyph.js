comment = `
Glyph sprites
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


var probby = 0.8 

function rules(state)
{
	/*
		0 = Not done
		50 = set
		6 = exclude
	*/

	if( [0].hasAny( state ) )
		return function(c, abs_x, abs_y)
		{

			if( [  c(0, 1), c(0, -1), c(1, 0), c(-1, 0)  ].hasAny(50) ) //No way to get here
				if (probby > ran())
					return 50
				else
					return 6
			else
				return 0
		}

	return function(context) { return context(0, 0) } //Identity
}

var count = 0
var inter;
function next()
{
	for(i = 0; i<RESOLUTION; i++)
		for(j = 0; j<RESOLUTION; j++)
			buffer[i][j] = grid[i][j] //This is a snapshot of the current state, which will be used by the rules.
	for(i=0; i<RESOLUTION; i++)
		for(j=0; j<RESOLUTION; j++)
		{
			grid[i][j] = rules(buffer[i][j])(contextualize(buffer, i, j), i, j)
		}
	// count++;
	// if(count >= 50)
	// 	clearInterval(inter)
	// draw();
}

grid[49][49] = 50 //seed

for (k=0; k<15; k++)
	next()

for(i=0; i<RESOLUTION/2; i++) //cleaning the results
		for(j=0; j<RESOLUTION; j++)
		{
			if (grid[i][j] != 50)
				grid[i][j] = 0
			grid[RESOLUTION-i-1][j] = grid[i][j]
		}
draw();

//inter = setInterval(next, 100)