comment = 
`
A simple proof of concept I made while dabbling into L-Systems.
It's supposed to create different kind of noses, but I didnt make decent rules
or initial axiom to get a nice result.
`

var RESOLUTION = 100

	var grid = makegrid(RESOLUTION, 255*255, 255*255, 255*255)
	var draw = grid[1]
	grid = grid[0]

var ran = Math.random
var rani = function(x)
{
	return Math.floor(ran()*x)
}


function clear()
{
	for (i=0; i<RESOLUTION; i++)
		for(j=0; j<RESOLUTION; j++)
		{
			grid[i][j] = 0
		}
}

function contextualize(arr, off)
{
	return function(x)
	{
		if(x+off < arr.length)
			return arr[x+off]
		else
			return 0
	}
}

function pick(a1, p1, a2, p2, a3, p3, a4, p4)
{
	var th = Math.random()
	var args = []

	for(var i=0; i<arguments.length; i++)
	{
		args.push(arguments[i])
	}

	var v = args.shift()
	while(th > args[0])
	{
		args.unshift()
		v = args.shift()
	}
	console.log(v)
	return v

	// var items
	// var total = 0
	// var odd = false
	// var items = []
	// var chances = []
	// for(i = 0; i<arguments.length; i++)
	// {
	// 	odd = !odd
	// 	if (odd)
	// 	{
	// 		items.push(arguments[i])
	// 	}
	// 	else
	// 	{
	// 		chances.push(arguments[i])
	// 	}
	// }
	// var threses = []//new Array(chances.length)
	// threses[0] = chances[0]
	// for(i=1; i<chances.length; i++)
	// {
	// 	threses[i] = threses[i-1] + chances[i]
	// }
	// var thr = Math.random() * threses[threses.length-1]

	// for(i=0; i<threses.length-1; i++)
	// {
	// 	if(thr < threses[i+1])
	// 		return items[i]
	// }

	// return ["X"];
}

function rules(c)
{
/*
	 1 = down+right => 11
	 2 = down => 222
	 3 = left+down => 333
	 4 = left => 4444
*/
	switch (c(0))
	{
		case 1 :
			return [[1, 1], [1]][rani(2)]
						/*pick([1, 1], 0.66,
						[1, 1, 2], 1
						)*/
		case 2 : 
			return [[2, 2, 2], [2]][rani(2)]/*pick(
						[2, 2], 0.3,
						[2, 1], 1
						)*/
		case 3 : 
			return [[3, 3, 3], [3]][rani(2)]/*pick(
						[3, 3], 0.3,
						[3], 0.6
						[3, 4], 1
						)*/
		case 4 :
			return  [[4, 4, 4, 4], [4, 4]][rani(2)]		//[4, 4]
						

	}
	return [c(0)]
}


function parse()
{
	var newarr = []
	for(i=0; i<axiom.length; i++)
	{
		var token = rules(contextualize(axiom, i))
		for (k=0; k<token.length; k++)
			newarr.push(token[k])
	}
	axiom = newarr
}

function graph()
{
	/*
	 1 = down+right
	 2 = down
	 3 = left+down
	 4 = left
	*/
	var pos = {x : 0, y : 0}
	grid[ pos.x][pos.y] = 255;
	for(i=0; i<axiom.length; i++)
	{
		var v = axiom[i]
		if([1, 2, 3].indexOf(v) >= 0)
			pos.y++
		if(v==1)
			pos.x++
		if([3, 4].indexOf(v) >= 0)
			pos.x--
		if(pos.x < 0)
			return
		grid[ pos.x][ pos.y] = 255;
	}
}

function next()
{
	clear()
	parse()
	graph()
	draw()
	console.log(axiom)
}


axiom = [1, 2, 3, 4]

for(var i=0; i<17; i++) next();

// document.getElementById("canvas").onmousedown = function()
// {
// 	next()
// }

// draw()


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

//var inter = setInterval(next, 1000)