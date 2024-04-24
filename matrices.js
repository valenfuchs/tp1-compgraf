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
  return indentityMatrix();
}

function modelTranslationMatrix (displacement) {
  return indentityMatrix();
}

function projectionMatrix(l, r, b, t, n, f) {
  let rl = r - l;
  let tb = t - b;
  let fn = f - n;
  return [2/rl, 0, 0, 0,
          0, 2/tb, 0, 0,
          0, 0, 2/fn, 0,
          -(r+l)/rl, -(t+b)/tb, -(f+n)/fn, 1];         
}

export {
  multiplyMatrices,
  indentityMatrix,
  modelYRotationMatrix,
  modelTranslationMatrix,
  projectionMatrix,
};