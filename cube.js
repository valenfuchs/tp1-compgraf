import { InitShaderProgram } from "./utils.js";
import { initBuffers } from "./init-cube-buffers.js";
import {
  multiplyMatrices,
  indentityMatrix,
  modelYRotationMatrix,
  modelTranslationMatrix,
  modelTranslationMatrix2,
  projectionMatrix,
  perspectiveProjectionMatrix
} from "./matrices.js";

// Clase muy similar a CurveDrawer. Pueden utilizarla como modelo para resolver el TP.
class CubeDrawer {
  // Inicialización de los shaders y buffers
  constructor(gl) {
    this.gl = gl;
    // Initialize a shader program
    let prog = InitShaderProgram(vsSource, fsSource, this.gl);

    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    this.programInfo = {
      program: prog,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(prog, "aVertexPosition"),
        vertexColor: this.gl.getAttribLocation(prog, "aVertexColor"),
      },
      uniformLocations: {
        mvp: this.gl.getUniformLocation(prog, "umvp"),
      },
    };

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    this.buffers = initBuffers(gl);
  }

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  setPositionAttribute() {
    const numComponents = 3; // pull out 2 values per iteration
    const type = this.gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    // Bind the buffer currently bound to gl.ARRAY_BUFFER to a generic vertex attribute of the
    // current vertex buffer object and specify its layout.
    // vertexAttribPointer(index, size, type, normalized, stride, offset)
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    // Turn on the generic vertex attribute array at the specified index into the list of
    // attribute arrays. (It is disabled by default)
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  setColorAttribute() {
    const numComponents = 4;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
  }

  getBezierPoints(t, p0, p1, p2, p3) {
    function bezier(t, p0, p1, p2, p3) {
      let x = Math.pow(1-t,3) * p0[0] + 3 * Math.pow(1-t,2) * t * p1[0] + 3 * (1-t) * Math.pow(t,2) * p2[0] + Math.pow(t,3) * p3[0];
      let y = Math.pow(1-t,3) * p0[1] + 3 * Math.pow(1-t,2) * t * p1[1] + 3 * (1-t) * Math.pow(t,2) * p2[1] + Math.pow(t,3) * p3[1];
      return [x, y, 0];
    }
    let bezierPoint = bezier(t, p0, p1, p2, p3);
    return bezierPoint;
  }

  getBezierPoints2(t, p0, p1, p2, p3) {
    function bezier(t, p0, p1, p2, p3) {
      let x = Math.pow(1-t,3) * p0[0] + 3 * Math.pow(1-t,2) * t * p1[0] + 3 * (1-t) * Math.pow(t,2) * p2[0] + Math.pow(t,3) * p3[0];
      let y = Math.pow(1-t,3) * p0[1] + 3 * Math.pow(1-t,2) * t * p1[1] + 3 * (1-t) * Math.pow(t,2) * p2[1] + Math.pow(t,3) * p3[1];
      return [0, y, x]; //se desplaza en z el punto de la bezier en x 
    }
    let bezierPoint = bezier(t, p0, p1, p2, p3);
    return bezierPoint;
  }

  // Dibujamos los segmentos de linea
  draw(runTime, points) {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    this.gl.clearDepth(1.0); // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Punto 1

    // const left = -4;
    // const right = 4;
    // const bottom = -4;
    // const top = 4;
    // const near = -2;
    // const far = 1;

    //let mvp = projectionMatrix(left, right, bottom, top, near, far);

    // Punto 2 - Hacemos girar el cubo sobre el eje y
    //let mvp = multiplyMatrices(projectionMatrix(left, right, bottom, top, near, far), modelYRotationMatrix(runTime));

    // Redefinimos los parametros para una mejor visualizacion
    const left = -1;
    const right = 1;
    const bottom = -1;
    const top = 1;
    const near = -1;
    const far = 1;

    // Punto 4 - Dezplazamos el cubo verticalmente sobre la bezier

    // Usamos el tiempo de ejecucion como parametro. Usamos Math.abs(Math.sin()) para normalizar el tiempo de ejecución entre 0 y 1.
    //const t = Math.abs(Math.sin(runTime));

    // Obtenemos los puntos de la curva bezier
    //const bezierPoints = this.getBezierPoints(t, points[0], points[1], points[2], points[3]);

    //let modelMatrix = multiplyMatrices(modelTranslationMatrix(bezierPoints), modelYRotationMatrix(runTime));
    //let mvp = multiplyMatrices(projectionMatrix(left, right, bottom, top, near, far), modelMatrix);

    // Punto 5 - Cambiamos la proyeccion ortografica a una de perspectiva
  
    //let modelMatrix = multiplyMatrices(modelTranslationMatrix2(bezierPoints), modelYRotationMatrix(runTime));

    // Componemos la transformacion perspectiva y la proyeccion ortografica
    //let mvp = multiplyMatrices(perspectiveProjectionMatrix(left, right, bottom, top, near, far), modelMatrix);
    //mvp = multiplyMatrices(projectionMatrix(left, right, bottom, top, near, far), mvp);

    // Puntos 7 y 8
    // Usando coseno el cubo rebota al principio y al final de la curva
    const t = Math.abs(Math.cos(runTime));

    // Obtenemos los puntos de bezier utilizando la nueva funcion
    const bezierPoints = this.getBezierPoints2(t, points[0], points[1], points[2], points[3]);
    
    // Calcula la matriz de traslación basada en los puntos de la curva de Bézier
    const translationMatrix = modelTranslationMatrix2(bezierPoints);

    // Combina la matriz de traslación y la matriz de rotación
    let modelMatrix = multiplyMatrices(translationMatrix, modelYRotationMatrix(runTime));

    // Transladar el cubo a la posición de la curva de Bezier
    let mvp = multiplyMatrices(perspectiveProjectionMatrix(left, right, bottom, top, near, far), modelMatrix);
    mvp = multiplyMatrices(projectionMatrix(left, right, bottom, top, near, far), mvp);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    this.setPositionAttribute();
    this.setColorAttribute();

    // Tell WebGL which indices to use to index the vertices
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);

    // Seleccionamos el shader
    this.gl.useProgram(this.programInfo.program);

    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.mvp, false, mvp);

    const vertexCount = 36;
    const type = this.gl.UNSIGNED_SHORT;
    const offset = 0;
    // gl.TRIANGLES: Draws a triangle for a group of three vertices.
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);

  }
}

var vsSource = /*glsl*/ `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 umvp;
    varying lowp vec4 vColor;

    void main(void) {
        gl_Position = umvp * aVertexPosition;
        vColor = aVertexColor;
    }
`;

var fsSource = /*glsl*/ `
    precision mediump float;
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`;

export { CubeDrawer };
