function multiplyMatrices(matrix1, matrix2) {
  let result = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          for (let k = 0; k < 4; k++) {
              result[j * 4 + i] += matrix1[k * 4 + i] * matrix2[j * 4 + k];
              }
      }
  }
  return result;
}

function indentityMatrix() {
  return [1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1];
}

function modelYRotationMatrix(angle) {
  return [Math.cos(angle), 0, -Math.sin(angle), 0,
          0, 1, 0, 0,
          Math.sin(angle), 0, Math.cos(angle), 0,
          0, 0, 0, 1];
}

function modelTranslationMatrix (displacement) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    displacement[0], displacement[1], 5+displacement[2]*5, 1
  ];
}

function projectionMatrix(l, r, b, t, n, f) {
  let rl = r - l;
  let tb = t - b;
  let fn = n - f;
  return [2/rl, 0, 0, 0,
          0, 2/tb, 0, 0,
          0, 0, 2/fn, 0,
          -(r+l)/rl, -(t+b)/tb, -(f+n)/fn, 1];         
}
/*
function perspectiveProjectionMatrix(l, r, b, t, n, f) {
  return [
      2*n/(r-l), 0, 0, 0,
      0, 2*n/(t-b), 0, 0,
      0, 0, -(f+n)/(f-n), -2*f*n/(f-n),
      0, 0, -1, 0
  ];
}
*/
function perspectiveProjectionMatrix(l, r, b, t, n, f) {
  return [
      n, 0, 0, 0,
      0, n, 0, 0,
      0, 0, (f + n), 1,
      0, 0,  -(f*n), 0];
}


export {
  multiplyMatrices,
  indentityMatrix,
  modelYRotationMatrix,
  modelTranslationMatrix,
  projectionMatrix,
  perspectiveProjectionMatrix,
};