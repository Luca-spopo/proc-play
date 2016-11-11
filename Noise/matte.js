comment = 
`This one takes a tiled map and "smudges" it around based on a given noise function.
I can imagine something like this being used to give smooth edges to biomes in minecraft
This uses sharp noise to get a matte finish on the edges
You would use something like this to connect two differents kinds of villages in minecraft`

var RESOLUTION = 1000


var ran = Math.random
var rani = function(x)
{
	return Math.floor(ran()*x)
}


	var grid = makegrid(RESOLUTION, false)
	var draw = grid[1]
	grid = grid[0]

	function f(t) { return 6*Math.pow(t, 5) - 15*Math.pow(t, 4) + 10*Math.pow(t, 3) }

	function dot(vec1, vec2)
	{
		return vec1[0]*vec2[0] + vec1[1] * vec2[1]
	}
	function mul(vec1, s)
	{
		return [vec1[0]*s, vec1[1]*s]
	}
	function add(vec1, vec2)
	{
		return [vec1[0]+vec2[0], vec1[1]+vec2[1]]
	}

	function interpolate(x, y, g00, g01, g10, g11, f) //f is easing function
	{
		return (
		dot(g00, [x, y])* f( 1-x )
		+
		dot(g10, [x-1, y]) * f(x)
		)*f( 1-y )
		+
		(
		dot(g01, [x, y-1]) * f( 1-x )
		+
		dot(g11, [x-1, y-1]) * f(x)
		)*f(y)
	}
function makePerlin(DENSITY_X, DENSITY_Y, AMPLITUDE, EASING)
{

	if (EASING == null)
		EASING = f

	DENSITY_X+=2;
	DENSITY_Y+=2;

	var pins = new Array(DENSITY_X)
	for (i=0; i<DENSITY_X; i++)
	{
		var newarr = new Array(DENSITY_Y)
		for (j=0; j<DENSITY_Y; j++)
			newarr[j] = Math.floor(Math.random()*9)
		pins[i] = newarr
	}

	var _ARROWS = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1] ]
	
	function ret(x, y)
	{
		//Expects x and y to be in [0,1]
		x *= DENSITY_X-2
		y *= DENSITY_Y-2

		//now x, y is within pins.
		var i = Math.floor(x)
		var j = Math.floor(y)

		return AMPLITUDE*interpolate(x-i, y-j, 
			_ARROWS[pins[i][j]] ,
			_ARROWS[pins[i][j+1]] ,
			_ARROWS[pins[i+1][j]] ,
			_ARROWS[pins[i+1][j+1]], EASING )
	}
	return ret;


}

function poly3(a, b, c)
{
	return function(x)
	{
		return a*x*x*x + b*x*x + c*x
	}
}


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

var buffer;


function scale(map, newdim)
{
	//assumes square
	var cdim = map.length
	
	buffer = new Array(newdim)
	for (i=0; i<newdim; i++)
	{
    	buffer[i] = new Uint8Array(newdim)
		for(j = 0; j<newdim; j++)
		{
			var si = Math.floor(i*cdim/newdim)
			var sj = Math.floor(j*cdim/newdim)
			// console.log(si, sj)
			buffer[i][j] = map[si][sj]
		}
	}
	return buffer
}

var map = [
[12, 14, 12, 12, 12],
[12, 14, 18, 18, 12],
[12, 16, 14, 18, 12],
[12, 17, 16, 14, 12],
[12, 17, 14, 14, 14]
]

map = scale(map, RESOLUTION)

var P1 = { X: 200, Y : 20, A : 30}
var P2 = { X: 20, Y : 200, A : 30}
var P3 = { X: 200, Y : 200, A : 0}


var px1 = makePerlin(P1.X, P1.Y, P1.A)
var px2 = makePerlin(P2.X, P2.Y, P2.A)
var px3 = makePerlin(P3.X, P3.Y, P3.A)

var py1 = makePerlin(P1.X, P1.Y, P1.A)
var py2 = makePerlin(P2.X, P2.Y, P2.A)
var py3 = makePerlin(P3.X, P3.Y, P3.A)

for (var i=0; i<RESOLUTION; i++)
	for(var j=0; j<RESOLUTION; j++)
	{
		var fi = i/RESOLUTION
		var fj = j/RESOLUTION
		var si = Math.floor(px1(fi, fj) + px2(fi, fj) + px3(fi, fj) )
		var sj = Math.floor(py1(fi, fj) + py2(fi, fj) + py3(fi, fj) )
		grid[i][j] = contextualize(map, i, j)(si, sj)
	}


draw()