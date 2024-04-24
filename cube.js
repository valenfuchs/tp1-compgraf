import { InitShaderProgram } from "./utils.js";
import { initBuffers } from "./init-cube-buffers.js";
import {
  multiplyMatrices,
  indentityMatrix,
  modelYRotationMatrix,
  modelTranslationMatrix,
  projectionMatrix,
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

  // Dibujamos los segmentos de linea
  draw(runTime, points) {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    this.gl.clearDepth(1.0); // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const left = -1;
    const right = 1;
    const bottom = -1;
    const top = 1;
    const near = -2;
    const far = 1;

    let mvp = indentityMatrix();

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
