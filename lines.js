import { InitShaderProgram } from "./utils.js";

/********** CLASE PARA DIBUJAR LOS SEGMENTOS ENTRE LOS PUNTOS DE CONTROL USANDO WEBGL **********/

// Clase muy similar a CurveDrawer. Pueden utilizarla como modelo para resolver el TP.
class LineDrawer {
  // Inicialización de los shaders y buffers
  constructor(gl) {
    // Creamos el programa webgl con los shaders para los segmentos de recta
    this.gl = gl;
    this.prog = InitShaderProgram(linesVS, linesFS, this.gl);

    // Obtenemos la ubicación de las varibles uniformes en los shaders,
    // en este caso, la matriz de transformación 'mvp'
    this.mvp = gl.getUniformLocation(this.prog, "mvp");

    // Obtenemos la ubicación de los atributos de los vértices
    // en este caso, la posición 'pos'
    this.vertPos = gl.getAttribLocation(this.prog, "pos"); 

    // Creamos el buffer para los vértices.
    // En este caso no tenemos triángulos, pero si segmentos
    // definidos entre dos puntos.
    this.buffer = gl.createBuffer();

    // Si bien creamos el buffer, no vamos a ponerle contenido en este
    // constructor. La actualziación de la información de los vértices
    // la haremos dentro de updatePoints().
  }

  // Actualización del viewport (se llama al inicialziar la web o al cambiar el tamaño de la pantalla)
  setViewport(width, height) {
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
    //var trans = [ 2/5000,0,0,0,  0,-2/5000,0,0, 0,0,1,0, -1,1,0,1 ];

    // Seteamos la matriz en la variable unforme del shader
    this.gl.useProgram(this.prog);
    this.gl.uniformMatrix4fv(this.mvp, false, trans);
  }

  // Cambiaron los puntos de control, asi que tenemos que actualizar los datos en el buffer
  updatePoints(pt) {
    // Armamos el arreglo
    var p = [];
    for (var i = 0; i < 4; ++i) {
      var x = pt[i].getAttribute("cx");
      var y = pt[i].getAttribute("cy");

      p.push(x);
      p.push(y);
    }

    // Enviamos al buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(p),
      this.gl.STATIC_DRAW
    );
  }

  // Dibujamos los segmentos de linea
  draw() {
    // Seleccionamos el shader
    this.gl.useProgram(this.prog);

    // Binding del buffer de posiciones
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    // Habilitamos el atributo
    this.gl.vertexAttribPointer(this.vertPos, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.vertPos);

    // Dibujamos lineas utilizando primitivas gl.LINE_STRIP
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
    this.gl.drawArrays(this.gl.LINE_STRIP, 0, 4);
    // cuando dice triangle es porq agarra del buffer de vertices grupos detres vertices para hacer un triangulo, aca los conecta de a dos 
  }
}

// Vertex shader de las rectas que unen los puntos de control
// --> se ejecuta para cada vertex que pongamos en el buffer
// Simplemente transforma el vector a coordenadas homogéneas y aplica la matriz de transformación
var linesVS = `
	attribute vec2 pos;  
	uniform mat4 mvp;
	void main()
	{
		gl_Position = mvp * vec4(pos,0,1);
	}
`;

//pos: atributo, cada vertice recibe su posicion en x, y (0 en z, 1 en alpha)
// en la bezier definimos el parametro t de la curva parametrica (t diferente para cada vertice)

// la curva de bezier es la interpolacion de las lineas que unen los puntos de control 

// Fragment shader de las rectas que unen los puntos de control
// Simplemente devuelve un color para cada fragmento, en este caso, rojo
var linesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;

export { LineDrawer };