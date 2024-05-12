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

function modelTranslationMatrix(displacement) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    displacement[0], displacement[1], displacement[2], 1
  ];
}

function modelTranslationMatrix2(displacement) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    displacement[0], displacement[1], 5+displacement[2]*5, 1 
  ]; // Cualquier desplazamiento en la dirección z se amplificará en comparación con modelTranslationMatrix
}

function projectionMatrix(l, r, b, t, n, f) {
  let rl = r - l;
  let tb = t - b;
  let fn = f - n;
  // NOTA: Usamos f - n porque venía dado en el código original. Probamos usar n - f (como estaba en las fórmulas de la teórica) y notamos
  //        que la pared del cubo más cercana al observador "desaparece". Las paredes que normalmente se encuentran más lejos 
  //        según la orientación estándar ahora se consideran más cercanas debido a la inversión en la orientación sobre el eje z de la proyección.
  return [2/rl, 0, 0, 0,
          0, 2/tb, 0, 0,
          0, 0, 2/fn, 0,
          -(r+l)/rl, -(t+b)/tb, -(f+n)/fn, 1];         
}

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
  modelTranslationMatrix2,
  projectionMatrix,
  perspectiveProjectionMatrix,
};