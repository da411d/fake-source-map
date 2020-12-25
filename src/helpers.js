/**
 * Перетворює код на масив рядків, що містить масив об'єктів-токенів.
 * Об'єкт токен містить значення та позицію від початку рядка.
 */
const tokenizeCode = code => {
  return code.split("\n").map(line => {
    const tokens = [];
    let lastPosition = 0;
    line.split(/(\W+)/ig).forEach(token => {
      tokens.push({
        value: token,
        position: lastPosition,
      });
      lastPosition += token.length;
    });
    return tokens;
  });
};

/**
 * Створює масив індексів, щоб рівномірно співвіднести один до одного кілька масивів.
 * Повертає масив масивів *індексів* для кожного масива.
 * Наприклад:
 * generateIndexes([1, 1, 1], [2, 2, 2, 2, 2, 2])
 * [
 *   [0, 0],
 *   [0, 1],
 *   [1, 2],
 *   [1, 3],
 *   [2, 4],
 *   [2, 5]
 * ]
 */
const generateIndexes = (...arrays) => {
  const maxLength = Math.max(...arrays.map(array => array.length));
  const resultIndexes = [];
  for (let i = 0; i < maxLength; i++) {
    resultIndexes.push(arrays.map(array => Math.floor(array.length / maxLength * i)));
  }
  return resultIndexes;
};

module.exports = {
  tokenizeCode,
  generateIndexes,
};
