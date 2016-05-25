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
		x = (x+i)%arr.length
		y = (y+j)%arr[x].length

		return arr[x][y]
	}
}

function rules(state)
{
	switch (state)
	{
		case 0 : return function(c)
		{
			if ([c(-1, 0), c(0, -1), c(0, 1),c(1, 0) /*, c(1, -1), c(-1, -1), c(-1, 1),c(1, 1)*/].indexOf(2) >= 0)
				if (Math.random()>0.4)
					return 2
				else
					return 1
			else
				return 0
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
}

grid[20][20] = 2

var inter = setInterval(next, 500)