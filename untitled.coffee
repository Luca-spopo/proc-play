"use strict";

#DIRT = 0
#WATER = 1

data = new ArrayBuffer(1000*1000)
space2d = new Array(1000)
for _, i in space2d
	space2d[i] = new Uint8Array(data, i*1000)

