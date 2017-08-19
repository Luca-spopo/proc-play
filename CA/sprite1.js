comment = `
Golem sprites
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

var KERNEL = 1
var probby = 0.75
var neighbourThres = function(set, total) {
	return set/total > 0.6
}
var smooth_passes = 10

function main_rules(state)
{
	/*
		0 = Not done
		50 = set
		50+x = 50 after x delay
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
	if(state > 50)
		return function(c, abs_x, abs_y) {
			return c(0, 0)-1
		}

	return function(context) { return context(0, 0) } //Identity
}

var count = 0
var inter;
function next(rules)
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

grid[49][30] = 55 //head
grid[49][40] = 58 //head2
grid[40][54] = 55 //chest
grid[28][44] = 57 //shoulders
grid[39][44] = 60 //nape
grid[25][50] = 60 //arms
grid[21][55] = 62 //arms
grid[21][60] = 62 //arms
grid[21][65] = 55 //hands
grid[45][75] = 54 //crotch
grid[45][65] = 56 //abs
grid[40][80] = 60 //legs
grid[38][90] = 60 //legs
grid[34][97] = 57 //legs


for (k=0; k<20; k++)
	next(main_rules)

//Now new rules for smoothing

rules = function(state) {
	return function(c, abx, aby) {
		var temp = 0
		for(var i=-KERNEL; i<=KERNEL; i++)
			for(var j=-KERNEL; j<=KERNEL; j++)
				if(c(i, j) == 50)
					temp++
		if(neighbourThres(temp, (KERNEL*2+1)*(KERNEL*2+1)))
			return 50
		else
			return 0
	}
}

for(var i=0; i<smooth_passes; i++)
	next(rules) //smooth


for(i=0; i<RESOLUTION/2; i++) //cleaning the results
		for(j=0; j<RESOLUTION; j++)
		{
			if (grid[i][j] != 50)
				grid[i][j] = 0
			grid[RESOLUTION-i-1][j] = grid[i][j]
		}
draw();

//inter = setInterval(next, 100)