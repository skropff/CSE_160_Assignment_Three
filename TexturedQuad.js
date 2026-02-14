// TexturedQuad.js (c) 2012 matsuda and kanda
// Vertex shader program
globalThis.gl = 0;
globalThis.shapes = [];
globalThis.shapes1 = [null];
globalThis.is_textured = [];
globalThis.colors = [];

globalThis.x = 0;
globalThis.z = 0;

globalThis.past_x = null;

globalThis.blocks = 0;

var VSHADER_SOURCE =
	//'attribute float a_myInt;\n' +
	//'varying float v_myInt;\n' + 
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +   
  'uniform mat4 u_ModelMatrix;\n' +      // Declare Model Matrix
  'uniform mat4 u_ViewMatrix;\n' +   
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  /*
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  */
  'gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  //'v_myInt = a_myInt;\n' +// Pass to fragment shader
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform bool u_myBoolean;\n' + 
  //'varying float v_myInt;\n' + 
  'uniform sampler2D u_Sampler;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  'if (u_myBoolean){\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n' + 
  'else {\n' +
	  'gl_FragColor = u_FragColor;\n' +
  '}\n' +
  '}\n'
  
  
  

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear both buffers
  
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  
  globalThis.gl = gl;

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
  var identityMatrix = new Matrix4(); // Identity by default
  
  
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityMatrix.elements);

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
   
  camera = new Camera(canvas);
  globalThis.camera = camera;
  
  globalThis.is_textured.push(false);
  globalThis.colors.push([150 / 255, 75 / 255, 0]);
  ground = createRectPrism(-1, -1, -1, 2, 1, 2);
  globalThis.shapes.push(ground);

  // Set texture
  if (!initTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }

  
  
  //render_loop();
  
  window.addEventListener('keydown', (event) => {
		if (event.code === 'KeyW') {
			//console.log(gl);
			//console.log('The physical W key was pressed!');
			globalThis.camera.moveForward(10);
			var u_ViewMatrix = globalThis.gl.getUniformLocation(globalThis.gl.program, 'u_ViewMatrix');
			//console.log(camera);
			//console.log(u_ViewMatrix);
			
			gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
			//var gl = getWebGLContext(canvas);
			//var n = initVertexBuffers(globalThis.gl);
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			globalThis.x = globalThis.x + 10;

// Change TRIANGLE_STRIP to TRIANGLES
		    render_loop();
    // Add your desired actions here.
		}
		
		if (event.code === 'KeyS') {
			//console.log(gl);
			//console.log('The physical W key was pressed!');
			globalThis.camera.moveBackward(10);
			var u_ViewMatrix = globalThis.gl.getUniformLocation(globalThis.gl.program, 'u_ViewMatrix');
			//console.log(camera);
			//console.log(u_ViewMatrix);
			
			gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
			//var gl = getWebGLContext(canvas);
			//var n = initVertexBuffers(globalThis.gl);
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
    // Add your desired actions here.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			globalThis.x = globalThis.x - 10;
// Change TRIANGLE_STRIP to TRIANGLES
render_loop();
		}
		
		if (event.code == 'KeyA') {
			//console.log(gl);
			//console.log('The physical W key was pressed!');
			globalThis.camera.moveLeft(10);
			var u_ViewMatrix = globalThis.gl.getUniformLocation(globalThis.gl.program, 'u_ViewMatrix');
			//console.log(camera);
			//console.log(u_ViewMatrix);
			
			gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
			//var gl = getWebGLContext(canvas);
			//var n = initVertexBuffers(globalThis.gl);
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			globalThis.z = globalThis.z + 10;
// Change TRIANGLE_STRIP to TRIANGLES
render_loop();
		}
		
		if (event.code == "KeyD") {
			//console.log(gl);
			//console.log('The physical W key was pressed!');
			globalThis.camera.moveRight(10);
			var u_ViewMatrix = globalThis.gl.getUniformLocation(globalThis.gl.program, 'u_ViewMatrix');
			//console.log(camera);
			//console.log(u_ViewMatrix);
			
			gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
			//var gl = getWebGLContext(canvas);
			//var n = initVertexBuffers(globalThis.gl);
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			globalThis.z = globalThis.z - 10;
// Change TRIANGLE_STRIP to TRIANGLES
			render_loop();
		}
		
		if (event.code == 'KeyQ') {
			//console.log('The physical W key was pressed!');
			globalThis.camera.panLeft(45);
			var u_ViewMatrix = globalThis.gl.getUniformLocation(globalThis.gl.program, 'u_ViewMatrix');
			//console.log(camera);
			//console.log(u_ViewMatrix);
			
			gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
			//var gl = getWebGLContext(canvas);
			//var n = initVertexBuffers(globalThis.gl);
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			render_loop();
		}
		
		if (event.code == 'KeyE') {
			//console.log('The physical W key was pressed!');
			globalThis.camera.panRight(45);
			var u_ViewMatrix = globalThis.gl.getUniformLocation(globalThis.gl.program, 'u_ViewMatrix');
			//console.log(camera);
			//console.log(u_ViewMatrix);
			
			gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
			//var gl = getWebGLContext(canvas);
			//var n = initVertexBuffers(globalThis.gl);
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			render_loop();
		}
		
		if (event.code == 'KeyP') {
			/*
			is_present = false;
			for (let i = 1; i < globalThis.shapes1.length; i = i + 1) {
				if (globalThis.shapes1[i][0] == globalThis.x && globalThis.shapes1[i][1] == globalThis.z) {
					is_present = true;
				}
			}
			if (! is_present) {
				globalThis.shapes1.push([globalThis.x, globalThis.z]);
				rectangle = createRectPrism(globalThis.x, 0, globalThis.z, 1, 1, 1)
				globalThis.shapes.push(rectangle);
				globalThis.colors.push([0, 1, 0]);
				globalThis.is_textured.push(false);
			}
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			render_loop();
		}
		*/
		let camX = globalThis.camera.eye.elements[0];
    let camY = globalThis.camera.eye.elements[1];
    let camZ = globalThis.camera.eye.elements[2];

    // 2. Get the direction the camera is LOOKING
    // (at - eye) gives the forward vector
    let forwardX = globalThis.camera.at.elements[0] - camX;
    let forwardZ = globalThis.camera.at.elements[2] - camZ;

    // 3. Place the block 2 units in front of the camera
    let placeX = camX + (forwardX * 2);
    let placeZ = camZ + (forwardZ * 2);

    // 4. Round to nearest integer (optional, makes it "grid-like")
    placeX = Math.round(placeX);
    placeZ = Math.round(placeZ);

    // 5. Place the block
    let rectangle = createRectPrism(placeX, -0.5, placeZ, 1, 1, 1);
    globalThis.shapes.push(rectangle);
    globalThis.colors.push([0, 1, 0]); // Green
    globalThis.is_textured.push(false);
	
	
    render_loop();
	globalThis.shapes1.push([placeX, placeZ]);
	globalThis.blocks = globalThis.blocks + 1;
	console.log("blocks added: ", globalThis.blocks);
}

	if (event.code == 'KeyO') {
			/*
			is_present = false;
			for (let i = 1; i < globalThis.shapes1.length; i = i + 1) {
				if (globalThis.shapes1[i][0] == globalThis.x && globalThis.shapes1[i][1] == globalThis.z) {
					is_present = true;
				}
			}
			if (! is_present) {
				globalThis.shapes1.push([globalThis.x, globalThis.z]);
				rectangle = createRectPrism(globalThis.x, 0, globalThis.z, 1, 1, 1)
				globalThis.shapes.push(rectangle);
				globalThis.colors.push([0, 1, 0]);
				globalThis.is_textured.push(false);
			}
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			render_loop();
		}
		*/
		
		let camX = globalThis.camera.eye.elements[0];
    let camY = globalThis.camera.eye.elements[1];
    let camZ = globalThis.camera.eye.elements[2];

    // 2. Get the direction the camera is LOOKING
    // (at - eye) gives the forward vector
    let forwardX = globalThis.camera.at.elements[0] - camX;
    let forwardZ = globalThis.camera.at.elements[2] - camZ;

    // 3. Place the block 2 units in front of the camera
    let placeX = camX + (forwardX * 2);
    let placeZ = camZ + (forwardZ * 2);

    // 4. Round to nearest integer (optional, makes it "grid-like")
    placeX = Math.round(placeX);
    placeZ = Math.round(placeZ);

    // 5. Place the block
    //let rectangle = createRectPrism(placeX, -0.5, placeZ, 1, 1, 1);
    //globalThis.shapes.push(rectangle);
    //globalThis.colors.push([0, 1, 0]); // Green
    //globalThis.is_textured.push(false);
    
		is_present = false;
			for (let i = 1; i < globalThis.shapes1.length; i = i + 1) {
				/*
				console.log("list:");
				console.log(globalThis.shapes1[i][0]);
				console.log(globalThis.shapes1[i][1]);
				console.log("current");
				console.log(placeX);
				console.log(placeZ);
				*/
				if (globalThis.shapes1[i][0] == placeX && globalThis.shapes1[i][1] == placeZ) {
					is_present = true;
					num = i;
					//console.log("found");
				}
			}
			if (!is_present) {
				//console.log("not found");
			}
			
			if (is_present) {
			globalThis.shapes.splice(num, 1);
			globalThis.colors.splice(num, 1);
			globalThis.shapes1.splice(num, 1);
			globalThis.is_textured.splice(num, 1);
			
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			render_loop();
			}
}
	
  });
  
  // Select the element you want to add the listener to
const element = document.getElementById("webgl"); // Example: getting an element by its ID

// Add a click event listener
element.addEventListener("click", function(event) {
    // Code to run when the element is clicked
	const rect = canvas.getBoundingClientRect();

// 2. Calculate pixel position relative to canvas (0,0 is top-left)
const mouseXRel = event.clientX - rect.left;

// 3. Convert to -1 to +1 range
const webglX = (mouseXRel / rect.width) * 2 - 1;
	skip = false;
   if (globalThis.past_x == null) {
	   skip = true;
   }
   if (! skip) {
	   globalThis.camera.panLeft((webglX - globalThis.past_x) * 180);
			var u_ViewMatrix = globalThis.gl.getUniformLocation(globalThis.gl.program, 'u_ViewMatrix');
			//console.log(camera);
			//console.log(u_ViewMatrix);
			
			gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
			//var gl = getWebGLContext(canvas);
			//var n = initVertexBuffers(globalThis.gl);
			globalThis.gl.clearColor(0.0, 0.0, 0.0, 1.0);
			//gl.clear(gl.COLOR_BUFFER_BIT);
			//initTextures(globalThis.gl, n);
			//globalThis.gl.drawArrays(globalThis.gl.TRIANGLE_STRIP, 0, n);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			render_loop();
   }
   globalThis.past_x = webglX;
});
  
}



function initVertexBuffers(gl) {
	/*
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
     0.5, -0.5,   1.0, 0.0,
  ]);
  var n = 4; // The number of vertices
  */

	var verticesTexCoords = new Float32Array([
    // Vertex coordinates (x, y, z), Texture coordinates (s, t)
    // Front face
    -0.5,  0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,  0.5,   0.0, 0.0,
     0.5,  0.5,  0.5,   1.0, 1.0,
    -0.5, -0.5,  0.5,   0.0, 0.0,
     0.5, -0.5,  0.5,   1.0, 0.0,
     0.5,  0.5,  0.5,   1.0, 1.0,
    // ... Repeat for the other 5 faces (Back, Left, Right, Top, Bottom)
    // changing the Z and swapping X/Y accordingly.
	
	// Back face (z = -0.5)
  -0.5,  0.5, -0.5,   1.0, 1.0,
  -0.5, -0.5, -0.5,   1.0, 0.0,
   0.5,  0.5, -0.5,   0.0, 1.0,
  -0.5, -0.5, -0.5,   1.0, 0.0,
   0.5, -0.5, -0.5,   0.0, 0.0,
   0.5,  0.5, -0.5,   0.0, 1.0,

  // Top face (y = 0.5)
  -0.5,  0.5, -0.5,   0.0, 1.0,
  -0.5,  0.5,  0.5,   0.0, 0.0,
   0.5,  0.5, -0.5,   1.0, 1.0,
  -0.5,  0.5,  0.5,   0.0, 0.0,
   0.5,  0.5,  0.5,   1.0, 0.0,
   0.5,  0.5, -0.5,   1.0, 1.0,

  // Bottom face (y = -0.5)
  -0.5, -0.5, -0.5,   1.0, 1.0,
  -0.5, -0.5,  0.5,   1.0, 0.0,
   0.5, -0.5, -0.5,   0.0, 1.0,
  -0.5, -0.5,  0.5,   1.0, 0.0,
   0.5, -0.5,  0.5,   0.0, 0.0,
   0.5, -0.5, -0.5,   0.0, 1.0,

  // Right face (x = 0.5)
   0.5,  0.5,  0.5,   0.0, 1.0,
   0.5, -0.5,  0.5,   0.0, 0.0,
   0.5,  0.5, -0.5,   1.0, 1.0,
   0.5, -0.5,  0.5,   0.0, 0.0,
   0.5, -0.5, -0.5,   1.0, 0.0,
   0.5,  0.5, -0.5,   1.0, 1.0,

  // Left face (x = -0.5)
  -0.5,  0.5,  0.5,   1.0, 1.0,
  -0.5, -0.5,  0.5,   1.0, 0.0,
  -0.5,  0.5, -0.5,   0.0, 1.0,
  -0.5, -0.5,  0.5,   1.0, 0.0,
  -0.5, -0.5, -0.5,   0.0, 0.0,
  -0.5,  0.5, -0.5,   0.0, 1.0
  ]);
  var n = 36; // Update this to 36
  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  globalThis.skyBuffer = vertexTexCoordBuffer;
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object
  

  
  // Example using a library like cuon-matrix.js or gl-matrix
var identityMatrix = new Matrix4(); // Identity by default

var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);
//var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
//gl.uniformMatrix4fv(u_ViewMatrix, false, identityMatrix.elements);
//var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
//gl.uniformMatrix4fv(u_ViewMatrix, false, identityMatrix.elements);
var projectionMatrixValues = new Float32Array([
  2.414213, 0.000000, 0.000000, 0.000000, // Column 1
  0.000000, 2.414213, 0.000000, 0.000000, // Column 2
  0.000000, 0.000000, -1.002002, -1.00000, // Column 3
  0.000000, 0.000000, -0.200200, 0.000000  // Column 4
]);

// Send it to your shader:
var u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrixValues);

//var u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
//gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityMatrix.elements);

  return n;
}

function initTextures(gl, n) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image); };
  // Tell the browser to load an image
  //Changes
  image.src = 'resources/sky.jpg';
  
  // Create second texture
  var texture1 = gl.createTexture();
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  
  var image1 = new Image();
  image1.onload = function() {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE1); // Use Unit 1
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
    
    // Start your render loop once images are ready
    render_loop(); 
  };
  image1.src = 'resources/water.jpg';
  





  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  const textured_location = gl.getUniformLocation(globalThis.gl.program, "u_myBoolean");
  globalThis.gl.uniform1i(textured_location, 1);

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
  render_loop();
}

function createRectPrism(xMin, yMin, zMin, xLen, yLen, zLen) {
    const xMax = xMin + xLen;
    const yMax = yMin + yLen;
    const zMax = zMin + zLen;

    // Define 36 vertices (6 faces, 2 triangles per face)
    // Each vertex is x, y, z
    const vertices = new Float32Array([
        // Front face
        xMin, yMin, zMax, xMax, yMin, zMax, xMax, yMax, zMax,
        xMin, yMin, zMax, xMax, yMax, zMax, xMin, yMax, zMax,
        // Back face
        xMin, yMin, zMin, xMax, yMin, zMin, xMax, yMax, zMin,
        xMin, yMin, zMin, xMax, yMax, zMin, xMin, yMax, zMin,
        // Top face
        xMin, yMax, zMin, xMax, yMax, zMin, xMax, yMax, zMax,
        xMin, yMax, zMin, xMax, yMax, zMax, xMin, yMax, zMax,
        // Bottom face
        xMin, yMin, zMin, xMax, yMin, zMin, xMax, yMin, zMax,
        xMin, yMin, zMin, xMax, yMin, zMax, xMin, yMin, zMax,
        // Right face
        xMax, yMin, zMin, xMax, yMax, zMin, xMax, yMax, zMax,
        xMax, yMin, zMin, xMax, yMax, zMax, xMax, yMin, zMax,
        // Left face
        xMin, yMin, zMin, xMin, yMax, zMin, xMin, yMax, zMax,
        xMin, yMin, zMin, xMin, yMax, zMax, xMin, yMin, zMax
    ]);

    return vertices;
}

	/*
	var gl = globalThis.gl;
    var program = gl.program;
    var FSIZE = 4; // Bytes per float
	
	var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    if (globalThis.camera) {
        gl.uniformMatrix4fv(u_ViewMatrix, false, globalThis.camera.viewMatrix.elements);
    }

    // 1. Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 2. Get Locations
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    var u_myBoolean = gl.getUniformLocation(program, 'u_myBoolean');
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

    // --- DRAW SKY BOX FIRST ---
    // STEP A: Re-bind the saved Sky Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, globalThis.skyBuffer);
    
    // STEP B: Reset pointers (Sky has 5 elements: 3 Pos, 2 Tex)
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);
    
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
    gl.enableVertexAttribArray(a_TexCoord);

    // STEP C: Set Sky Uniforms
    var skyMatrix = new Matrix4(); 
    // Recommended: Scale sky up so you don't walk through the walls immediately
    skyMatrix.setScale(50, 50, 50); 
    gl.uniformMatrix4fv(u_ModelMatrix, false, skyMatrix.elements);
    gl.uniform1i(u_myBoolean, 1); // Tell shader: USE TEXTURE

    gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	 var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    gl.disableVertexAttribArray(a_TexCoord); 
	
	var identityMatrix = new Matrix4(); // Identity by default
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);
//var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
//gl.uniformMatrix4fv(u_ViewMatrix, false, identityMatrix.elements);
//var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
//gl.uniformMatrix4fv(u_ViewMatrix, false, identityMatrix.elements);
	var projectionMatrixValues = new Float32Array([
  2.414213, 0.000000, 0.000000, 0.000000, // Column 1
  0.000000, 2.414213, 0.000000, 0.000000, // Column 2
  0.000000, 0.000000, -1.002002, -1.00000, // Column 3
  0.000000, 0.000000, -0.200200, 0.000000  // Column 4
]);

// Send it to your shader:
	var u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrixValues);
	for (let i = 0; i < globalThis.shapes.length; i = i + 1) {
		positionBuffer = globalThis.gl.createBuffer();
		globalThis.gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		globalThis.gl.bufferData(gl.ARRAY_BUFFER, globalThis.shapes[i], gl.STATIC_DRAW);



//program = gl.createProgram();
/*
const shader = gl.createShader(gl.VERTEX_SHADER); // Correct declaration
gl.attachShader(program, shader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}

// Get attribute location for 'aPosition'
const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0); // 2 components per vertex
*/

//gl.useProgram(program);

//gl.clear(gl.DEPTH_BUFFER_BIT); 
/*
		var a_Position = globalThis.gl.getAttribLocation(gl.program, 'a_Position');
		var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
		globalThis.gl.enableVertexAttribArray(a_Position);
		globalThis.gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		globalThis.gl.enableVertexAttribArray(a_Position);
		const textured_location = gl.getUniformLocation(globalThis.gl.program, "u_myBoolean");
		if (!globalThis.is_textured[i]) {	
			const currentTime = 0; // The float value you want to pass
			globalThis.gl.uniform1i(textured_location, currentTime);
			globalThis.gl.uniform4f(u_FragColor, globalThis.colors[i][0], globalThis.colors[i][1], globalThis.colors[i][2], 1.0);
		}
		globalThis.gl.drawArrays(gl.TRIANGLES, 0, 36); 
	}
	*/
	// 1. Create a single buffer for shapes ONCE outside the loop to prevent memory leaks
var globalShapeBuffer = null;

function render_loop() {
	start = Date.now();
	/*
    var gl = globalThis.gl;
    var program = gl.program;
    var FSIZE = 4; // Bytes per float

    // Initialize the shape buffer if it doesn't exist yet
    if (!globalShapeBuffer) {
        globalShapeBuffer = gl.createBuffer();
    }

    // 2. FORCE UPDATE MATRICES (Ensures buttons move the camera)
    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    var u_ProjectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatrix");
    
    if (globalThis.camera) {
        gl.uniformMatrix4fv(u_ViewMatrix, false, globalThis.camera.viewMatrix.elements);
    }

    var projectionMatrixValues = new Float32Array([
        2.414213, 0.000000, 0.000000, 0.000000,
        0.000000, 2.414213, 0.000000, 0.000000,
        0.000000, 0.000000, -1.002002, -1.00000,
        0.000000, 0.000000, -0.200200, 0.000000
    ]);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrixValues);

    // 3. CLEAR CANVAS
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    var u_myBoolean = gl.getUniformLocation(program, 'u_myBoolean');
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

    // --- DRAW SKY BOX ---
    gl.bindBuffer(gl.ARRAY_BUFFER, globalThis.skyBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
    gl.enableVertexAttribArray(a_TexCoord);

    var skyMatrix = new Matrix4(); 
    skyMatrix.setScale(50, 50, 50); 
    gl.uniformMatrix4fv(u_ModelMatrix, false, skyMatrix.elements);
    gl.uniform1i(u_myBoolean, 1); // Enable Texture
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    // --- CRITICAL FIX: DISABLE TEXTURE ATTRIBUTE FOR SHAPES ---
    gl.disableVertexAttribArray(a_TexCoord); 

    // --- DRAW SHAPES LOOP ---
    var identityMatrix = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);

    for (let i = 0; i < globalThis.shapes.length; i++) {
        // Reuse the same buffer instead of createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, globalShapeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, globalThis.shapes[i], gl.STATIC_DRAW);

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        if (!globalThis.is_textured[i]) {	
            gl.uniform1i(u_myBoolean, 0); // Disable Texture
            gl.uniform4f(u_FragColor, globalThis.colors[i][0], globalThis.colors[i][1], globalThis.colors[i][2], 1.0);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 36); 
    }
	*/
	var gl = globalThis.gl;
    var program = gl.program;
    var FSIZE = 4; 

    //if (!gl) return;
    //if (!globalShapeBuffer) globalShapeBuffer = gl.createBuffer();
	globalShapeBuffer = gl.createBuffer();

    // 2. FORCE UPDATE MATRICES (Ensures buttons move the camera)
    var u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    if (globalThis.camera) {
        // Pull the latest matrix from the camera object
        gl.uniformMatrix4fv(u_ViewMatrix, false, globalThis.camera.viewMatrix.elements);
    }

    var u_ProjectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatrix");
    var projectionMatrixValues = new Float32Array([
        2.414213, 0.000000, 0.000000, 0.000000,
        0.000000, 2.414213, 0.000000, 0.000000,
        0.000000, 0.000000, -1.002002, -1.00000,
        0.000000, 0.000000, -0.200200, 0.000000
    ]);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrixValues);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    var u_myBoolean = gl.getUniformLocation(program, 'u_myBoolean');
    var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    var u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

    // --- DRAW SKY BOX ---
    gl.bindBuffer(gl.ARRAY_BUFFER, globalThis.skyBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
    gl.enableVertexAttribArray(a_TexCoord);

    var skyMatrix = new Matrix4(); 
    skyMatrix.setScale(50, 50, 50); 
    gl.uniformMatrix4fv(u_ModelMatrix, false, skyMatrix.elements);
    gl.uniform1i(u_myBoolean, 1); // Enable Texture
    gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	//Changes
  // Draw Block 1 (The Sky/Original) using Texture Unit 0
  drawBlock(gl, 36, 0, 0, 0, 1, 1, 1, 0);

  // Draw Block 2 (Custom) using Texture Unit 1
  // Example: xMin: 1, yMin: 0, zMin: 0, Lengths: 0.5
  drawBlock(gl, 36, 1.0, 0.0, 0.0, 0.5, 0.5, 0.5, 1);

    // --- CRITICAL FIX: DISABLE TEXTURE ATTRIBUTE FOR SHAPES ---
    gl.disableVertexAttribArray(a_TexCoord); 

    // --- DRAW SHAPES LOOP (BROWN BOX) ---
    var identityMatrix = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);

    for (let i = 0; i < globalThis.shapes.length; i++) {
        // Reuse the same buffer instead of createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, globalShapeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, globalThis.shapes[i], gl.STATIC_DRAW);

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        if (!globalThis.is_textured[i]) {	
            gl.uniform1i(u_myBoolean, 0); // Disable Texture logic
            gl.uniform4f(u_FragColor, globalThis.colors[i][0], globalThis.colors[i][1], globalThis.colors[i][2], 1.0);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 36); 
    }
	end = Date.now();
	console.log("FPS: ", 1 / ((end-start)/1000));
	
}

function drawBlock(gl, n, xMin, yMin, zMin, xLen, yLen, zLen, textureUnit) {
	/*
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  
  let modelMatrix = new Matrix4();
  
  // 1. Move to the target position
  // We add half-length because your cube is centered at 0
  modelMatrix.translate(xMin + xLen/2, yMin + yLen/2, zMin + zLen/2);
  
  // 2. Scale to the desired dimensions
  modelMatrix.scale(xLen, yLen, zLen);
  
  // Send matrix and texture unit to shaders
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.uniform1i(u_Sampler, textureUnit); 
  
  gl.drawArrays(gl.TRIANGLES, 0, n);
  */
   var program = gl.program;
  
  // Ensure we are using the buffer that has BOTH positions and texture coords
  gl.bindBuffer(gl.ARRAY_BUFFER, globalThis.skyBuffer);
  
  // Re-enable and point to attributes (assuming 5 floats per vertex: 3 pos, 2 tex)
  var FSIZE = 4;
  var a_Position = gl.getAttribLocation(program, 'a_Position');
  var a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(a_TexCoord);

  // Set Uniforms
  var u_myBoolean = gl.getUniformLocation(program, 'u_myBoolean');
  var u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
  gl.uniform1i(u_myBoolean, 1);       // Turn texture logic ON
  gl.uniform1i(u_Sampler, textureUnit); // Set to 1 for water, 0 for sky
  
  // Transformation Matrix
  let modelMatrix = new Matrix4();
  modelMatrix.translate(xMin + xLen/2, yMin + yLen/2, zMin + zLen/2);
  modelMatrix.scale(xLen, yLen, zLen);
  
  var u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
