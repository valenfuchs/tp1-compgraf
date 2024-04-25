import { InitShaderProgram } from "./utils.js";

// Completar la implementación de esta clase y el correspondiente vertex shader.
// No es necesario modificar el fragment shader a menos que quieran, por ejemplo, modificar el color de la curva.

class CurveDrawer {
  // Inicialización de los shaders y buffers
  constructor(gl) {
    // Creamos el programa webgl con los shaders para los segmentos de recta
    this.gl = gl;
    this.prog = InitShaderProgram(curvesVS, curvesFS, this.gl);

    // Obtenemos la ubicación de las varibles uniformes en los shaders
	// en este caso, son la matriz de transformación 'mvp' y los puntos de control
    this.mvp = gl.getUniformLocation(this.prog, "mvp");
	this.p0 = gl.getUniformLocation(this.prog, "p0");
    this.p1 = gl.getUniformLocation(this.prog, "p1");
    this.p2 = gl.getUniformLocation(this.prog, "p2");
    this.p3 = gl.getUniformLocation(this.prog, "p3");
	// Obtenemos la ubicación del atributo t 
	// obs: atributos son las variables que tienen un valor asociado para cada vértice
    this.t = gl.getAttribLocation(this.prog, "t"); // "es como un puntero a t"
    

	// Muestreo del parámetro t
	//100 intervalos (con distinto t): valores distintos para cada ejecucion del vertex shader
	this.steps = 100; 
	var tv = [];
	for ( var i=0; i<this.steps; ++i ) {
		tv.push( i / (this.steps-1) );
	}
	
	// Creamos el buffer (unico porque tenemos un solo atributo: t)
    this.buffer = gl.createBuffer();

	// Enviamos al buffer
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
  }

	// Actualización del viewport (se llama al inicializar la web o al cambiar el tamaño de la pantalla)
	setViewport( width, height )
	{
		// [Completar] Matriz de transformación.
		// [Completar] Binding del programa y seteo de la variable uniforme para la matriz. 

		// Calculamos la matriz de proyección.
		// Como nos vamos a manejar únicamente en 2D, no tiene sentido utilizar perspectiva.
		// Simplemente inicializamos la matriz para que escale los elementos de la escena
		// al ancho y alto del canvas, invirtiendo la coordeanda y. La matriz está en formato
		// column-major.
		var trans = [
			2 / width,
			0,
			0,
			0,
			0,
			-2 / height,
			0,
			0,
			0,
			0,
			1,
			0,
			-1,
			1,
			0,
			1,
		];
	
		// Seteamos la matriz en la variable unforme del shader
		this.gl.useProgram(this.prog);
		this.gl.uniformMatrix4fv(this.mvp, false, trans);
	}

	updatePoints( pt ) // Escribe los puntos en memoria de gpu
	{
		// Actualización de las variables uniformes para los puntos de control
		// No se olviden de hacer el binding del programa antes de setear las variables 
		// Pueden acceder a las coordenadas de los puntos de control consultando el arreglo pt[]:
		
		//puntos de control p0, p1, p2, p3
		// accedemos a las coordenadas de los puntos de control consultando el arreglo pt[]
		var p0 = [pt[0].getAttribute("cx"), pt[0].getAttribute("cy")];
		var p1 = [pt[1].getAttribute("cx"), pt[1].getAttribute("cy")];
		var p2 = [pt[2].getAttribute("cx"), pt[2].getAttribute("cy")];
		var p3 = [pt[3].getAttribute("cx"), pt[3].getAttribute("cy")];

		// Seteamos la matriz en la variable unforme del shader
		this.gl.useProgram(this.prog);
		this.gl.uniform2fv(this.p0, p0);
		this.gl.uniform2fv(this.p1, p1);
		this.gl.uniform2fv(this.p2, p2);
		this.gl.uniform2fv(this.p3, p3);
	}

	draw()
	{
		// Seleccionamos el shader
		this.gl.useProgram(this.prog);

		// Binding del buffer de posiciones
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

		// Habilitamos el atributo
		this.gl.vertexAttribPointer(this.t, 1, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.t);

		// Dibujamos la curva utilizando gl.LINE_STRIP
		this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.steps);
	}
}

// Vertex Shader
// El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
 
	vec2 bezier(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {
		float t2 = t * t;
		float t3 = t2 * t;
		float mt = 1.0 - t;
		float mt2 = mt * mt;
		float mt3 = mt2 * mt;
		return mt3 * p0 + 3.0 * mt2 * t * p1 + 3.0 * mt * t2 * p2 + t3 * p3;
	}
	
	void main() {
		vec2 position = bezier(p0, p1, p2, p3, t);
		gl_Position = mvp * vec4(position, 0.0, 1.0);
	}

`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(0,0,1,1);
	}
`;


export { CurveDrawer };