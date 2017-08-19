comment = `
Creates a ruined monastary or something. I used a new and crazy approach to make this.
Results are mixed.`

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

function is1(t)
{
	return t==0 || t==6 || t==7 || t==8
}

function rules(state)
{
	switch (state)
	{
		case 1 : return function(c)
		{	
			if ( [c(-2, 0), c(-1, 0), c(-3, 0)].every(is1) 
			|| [c(2, 0), c(1, 0), c(3, 0)].every(is1) 
			|| [c(0, 1), c(0, 2), c(0, 3)].every(is1) 
			|| [c(0, -1), c(0, -2), c(0, -3)].every(is1) )
				if (Math.random()>0.3)
					return 0
				else
					return 5
			else
				if (Math.random() > 0.98)
					return 6
				else
					return 1
		}
		case 0 : 
		case 6 : return function(c)
		{
			if ( [c(-2, 0), c(-1, 0), c(-3, 0)].every(is1) 
			|| [c(2, 0), c(1, 0), c(3, 0)].every(is1) 
			|| [c(0, 1), c(0, 2), c(0, 3)].every(is1) 
			|| [c(0, -1), c(0, -2), c(0, -3)].every(is1) )
				return 0
			else
				return 7
		}
		case 7 : return function(c)
		{
			if ( [c(-2, 0), c(-1, 0), c(-3, 0)].every(is1) 
			|| [c(2, 0), c(1, 0), c(3, 0)].every(is1) 
			|| [c(0, 1), c(0, 2), c(0, 3)].every(is1) 
			|| [c(0, -1), c(0, -2), c(0, -3)].every(is1) )
				return 0
			else
				return 8
		}
		case 8 : return function(c)
		{
			if ( [c(-2, 0), c(-1, 0), c(-3, 0)].every(is1) 
			|| [c(2, 0), c(1, 0), c(3, 0)].every(is1) 
			|| [c(0, 1), c(0, 2), c(0, 3)].every(is1) 
			|| [c(0, -1), c(0, -2), c(0, -3)].every(is1) )
				return 0
			else
				return 1
		}
	}
	return function(context) { return context(0, 0) } //Identity
}

count = 0

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
	if(count++ > 300)
	{
		clearInterval(inter)
		clean()
	}
	draw();
}

//grid[20][20] = 2
// for (k=0; k<300; k++)
// 	next();

function clean()
{
for(i=0; i<RESOLUTION; i++) //cleaning the results
		for(j=0; j<RESOLUTION; j++)
		{
			if (grid[i][j] != 0)
				grid[i][j] = 1;
			else
				grid[i][j] = 0

		}
}
for(i=0; i<RESOLUTION; i++) //cleaning the results
		for(j=0; j<RESOLUTION; j++)
			grid[i][j] = 1

inter = setInterval(next, 10)