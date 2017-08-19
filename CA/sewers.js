comment = `
Creates a sewer system with lots of narrow turns
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


var LENGTHYNESS = 0.6
var DEADENDS = 0.03
var SPLITS = 0.23

function rules(state)
{
	/*
		0 = WALL
		1 = going right
		11 = going left
		21 = going up
		31 = going down
		100 = dead end
		201 = potential split, right gaurenteed
		202 = potential split, left gaurenteed
		203 = potential split, up gaurenteed
		204 = potential split, down gaurenteed
		250 = walkable, expired potential split
	*/

	if ( [201, 202, 203, 204].hasAny(state) )
		return function() {return 250}

	if( [0].hasAny( state ) )
		return function(c, abs_x, abs_y)
		{

			if( [  c(0, 1), c(0, -1), c(1, 0), c(-1, 0)  ].count(0)==4 ) //No way to get here
				return 0

			function hpr(res)
			{
				if( (abs_x%2) + (abs_y%2) != 1 ) //NXOR operation
					if(ran() < DEADENDS)
						return 100
					else
						return res
				else
					if(ran() < LENGTHYNESS)
						return res
					else
						switch( res )
						{
							case 1 : return [201, 204, 203][rani(3)]
							case 11 : return [202, 204, 203][rani(3)]
							case 21 : return [201, 202, 203][rani(3)]
							case 31 : return [201, 204, 202][rani(3)]
						}
			}

			if ( [c(-1, 0)].hasAny(1,201,202,203,204) )
			{
				if ( [1, 201].hasAny(c(-1, 0)) || ran() < SPLITS )
					return hpr(1)
			}
			else if ( [c(1, 0)].hasAny(11,201,202,203,204) )
			{
				if ( [11, 202].hasAny(c(1, 0)) || ran() < SPLITS )
					return hpr(11)
			}
			else if( [c(0, 1)].hasAny(21,201,202,203,204) )
			{
				if ( [21, 203].hasAny(c(0, 1)) || ran() < SPLITS )
					return hpr(21)
			}
			else if( [c(0, -1)].hasAny(31,201,202,203,204) )
			{
				if ( [31, 204].hasAny(c(0, -1)) || ran() < SPLITS )
					return hpr(31)
			}
			

			// console.log("impossible")
			return 0
		}

	return function(context) { return context(0, 0) } //Identity
}

var count = 0
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
	draw();
	// console.log(count++)
}

grid[50][50] = [1, 11, 31, 21][rani(4)] //seed

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

var inter = setInterval(next, 1000)