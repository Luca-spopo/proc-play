function makegrid(RESOLUTION, R, G, B)
{
    if (R == Math.round(R))
        R += 0.001
    if (G == Math.round(G))
        G += 0.01
    if (B == Math.round(B))
        B += 0.01
    var fs_src = 
    `    	precision mediump float;
        	uniform sampler2D data;
        	varying vec2 pos;
        	void main() {
        		float c = texture2D(data, (pos+1.0)/2.0 ).a;// + texture2D(data, pos).r + texture2D(data, pos).g + texture2D(data, pos).b;
        		//gl_FragColor = vec4(sin(c*1143.214), cos(c*2415.1414), c, c*255.0);
                gl_FragColor = vec4(c* ${R}/255.0, c* ${G}/255.0, c* ${B}/255.0, 1);
                //if (c==0.0)
                //    gl_FragColor.r = 1.0;
    		}`
    var vs_src =
    `    	precision mediump float;
    		attribute vec2 a_position;
     		varying vec2 pos;
    		void main() {
    		  gl_Position = vec4(a_position, 0, 1);
    		  pos = a_position;
            }`

    var canvas = document.getElementById("canvas");
    if (!canvas) alert("Keep a DOM canvas called canvas") 
    var gl = canvas.getContext("webgl");
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fs_src)
    gl.compileShader(fshader)
    var vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vs_src)
    gl.compileShader(vshader)
    if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
        alert("vertex: \n"+gl.getShaderInfoLog(vshader))
    }
    if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS))
    {
       alert("fragment: \n"+gl.getShaderInfoLog(fshader))
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vshader)
    gl.attachShader(prog, fshader)
    gl.linkProgram(prog)
    gl.useProgram(prog)
    var positionLocation = gl.getAttribLocation(prog, "a_position");
    var datapositionLocation = gl.getAttribLocation(prog, "data"); 
    var texture = gl.createTexture();
    var data = new ArrayBuffer(RESOLUTION*RESOLUTION);
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0]),
        gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    var rawview =new Uint8Array(data);

    function draw() {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, RESOLUTION, RESOLUTION, 0, gl.ALPHA, gl.UNSIGNED_BYTE, rawview);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    var space2d = new Array(RESOLUTION)
    for (i=0; i<RESOLUTION; i++)
        space2d[i] = new Uint8Array(data, i*RESOLUTION)

    return [space2d, draw]
}