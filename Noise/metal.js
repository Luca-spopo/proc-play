comment = 
`This one looks like a steel shutter.`


var RESOLUTION = 1500

	var grid = makegrid(RESOLUTION, 145, 149, 150)
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

var p1 = makePerlin(16, 3, 60, (t) => {return Math.pow(t, 0.5)})
var p2 = makePerlin(3, 80, 5)
var p3 = makePerlin(3, 3, 0)


for (i=0; i<RESOLUTION; i++)
	for(j=0; j<RESOLUTION; j++)
		grid[i][j] = 125+p1(i/RESOLUTION, j/RESOLUTION) + Math.abs(p2(i/RESOLUTION, j/RESOLUTION)) + p3(i/RESOLUTION, j/RESOLUTION)
//grid[i][j] = p1(i/RESOLUTION, j/RESOLUTION) + p2(i/RESOLUTION, j/RESOLUTION)
draw();