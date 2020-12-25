const fs = require("fs");
const { SourceMapGenerator } = require("source-map");

const sourceDir = "example/source/";
const destinationDir = "example/build/";

const codeFileName = "code.js";
const placeholderFileName = "placeholder.js";
const mapFileName = codeFileName + ".map";

const sourceCodePath = sourceDir + codeFileName;
const sourcePlaceholderPath = sourceDir + placeholderFileName;

const destinationCode = destinationDir + codeFileName;
const destinationMap = destinationDir + mapFileName;

const generateCodeChunks = code => {
  return code.split("\n").map(line => {
    const chunk = [];
    let lastPosition = 0;
    line.split(/(\W+)/ig).forEach(token => {
      chunk.push({
        value: token,
        position: lastPosition,
      });
      lastPosition += token.length;
    });
    return chunk;
  });
};

const generateIndexes = (...arrays) => {
  const maxLength = Math.max(...arrays.map(array => array.length));
  const resultIndexes = [];
  for (let i = 0; i < maxLength; i++) {
    resultIndexes.push(arrays.map(array => Math.floor(array.length / maxLength * i)));
  }
  return resultIndexes;
};

/*
 * 1 - Копіюєм файл і вказуєм ссилку на файл сорсмапа
 */
const appendData = `\n//# sourceMappingURL=${mapFileName}`;
fs.copyFileSync(sourceCodePath, destinationCode);
fs.appendFileSync(destinationCode, appendData);

/*
 * 2 - Генеруєм сорсмапу
 */
const sourceCode = fs.readFileSync(sourceCodePath).toString().trim();
const placeholderCode = fs.readFileSync(sourcePlaceholderPath).toString().trim();

const sourceCodeTokens = generateCodeChunks(sourceCode);
const placeholderCodeTokens = generateCodeChunks(placeholderCode);

const map = new SourceMapGenerator({
  file: codeFileName,
});

const rowsIndexes = generateIndexes(sourceCodeTokens, placeholderCodeTokens);
for (const [sourceRowIndex, placeholderRowIndex] of rowsIndexes) {
  const sourceRow = sourceCodeTokens[sourceRowIndex];
  const placeholderRow = placeholderCodeTokens[placeholderRowIndex];
  
  const chunkIndexes = generateIndexes(sourceRow, placeholderRow);
  for (const [sourceChunkIndex, placeholderChunkIndex] of chunkIndexes) {
    const sourceChunk = sourceRow[sourceChunkIndex];
    const placeholderChunk = placeholderRow[placeholderChunkIndex];
    
    map.addMapping({
      source: codeFileName,
      name: placeholderChunk.value,
      original: {
        line: sourceRowIndex + 1,
        column: sourceChunk.position,
      },
      generated: {
        line: placeholderRowIndex + 1,
        column: placeholderChunk.position,
      },
    });
    map.setSourceContent(codeFileName, placeholderCode);
  }
}

fs.writeFileSync(destinationMap, map.toString());
