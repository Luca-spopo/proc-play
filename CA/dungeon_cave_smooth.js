comment = `
Generates a rocky cave/dungeon that is smoothened out with a kernel.
`

var RESOLUTION = 400

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

var ran = Math.random

var WALLYNESS = 0.30
var TREASURENESS = 0.01
var WALLYNESS_DECAY_COEFF = Math.pow((0.998), 1/3)


function rules(state, c)
{
	if (state == 0) {
		if (c(-1, 0) == 10 ||  c(0, -1) == 10 || c(0, 1) == 10 || c(1, 0) == 10)
			return 1

		if (c(-1, 0) == 2 || c(0, -1) == 2 || c(0, 1) == 2 || c(1, 0) == 2)
			if (WALLYNESS < ran() )
					return 2
			else
				return 1
		else
			return state
	}
	return state //Identity
}

var KERNEL = 1
var smooth_passes = 1
smoothrules = function(state, c) {
	//return function(c, abx, aby) {
		if (state==0) return 0
		var temp = 0
		for(var i=-KERNEL; i<=KERNEL; i++)
			for(var j=-KERNEL; j<=KERNEL; j++)
				if(c(i, j) == 2 || c(i, j) == 4)
					temp++
		if(temp > 0.5*(KERNEL*2+1)*(KERNEL*2+1))
			return 2
		else
			return 1			//}
}

var count = 0
function next(ruless)
{
	if((count++) % 30 > 27) {
		ruless = smoothrules
		WALLYNESS = WALLYNESS*WALLYNESS_DECAY_COEFF
	}
	for(i = 0; i<RESOLUTION; i++)
		for(j = 0; j<RESOLUTION; j++)
			buffer[i][j] = grid[i][j] //This is a snapshot of the current state, which will be used by the rules.
	for(i=0; i<RESOLUTION; i++)
		for(j=0; j<RESOLUTION; j++)
		{
			grid[i][j] = ruless(buffer[i][j], contextualize(buffer, i, j))
		}
	WALLYNESS = WALLYNESS/WALLYNESS_DECAY_COEFF
	//console.log(count)
	draw();
}

grid[RESOLUTION/2][RESOLUTION/2] = 2
var l
// for (l=0; l<350; l++)
// 	next(rules)

// draw()
setInterval(next, 10, rules)