var RESOLUTION = 100

	var grid = makegrid(RESOLUTION)
	var draw = grid[1]
	grid = grid[0]

	function f(t) { return 6*Math.pow(t, 5) - 15*Math.pow(t, 4) + 10*Math.pow(t, 3) }

	function interpolate(u, v, g00, g01, g10, g11, f) //f is easing function
	{
		var n00 = g00[0]*u + g00[1]*v
		var n10 = g10[0]*(u-1) + g10[1]*v
		var n01 = g01[0]*u + g01[1]*(v-1)
		var n11 = g11[0]*(u-1) + g11[1]*(v-1)
		var nx0 = n00*(f(1-u)) + n10*f(u)	
		var nx1 = n01 * (f(u)) + n11*(f(1-u))
		return nx0 * (f(v)) + nx1 * (f(1-v))
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

var getxy = makePerlin(20, 20, 200)

for (i=0; i<RESOLUTION; i++)
	for(j=0; j<RESOLUTION; j++)
		grid[i][j] = getxy(i/RESOLUTION, j/RESOLUTION)

draw();