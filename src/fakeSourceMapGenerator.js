const { SourceMapGenerator } = require("source-map");
const { tokenizeCode, generateIndexes } = require("./helpers");
const base64 = require("base-64");

const generateFakeSourceMap = (fileName, originalCode, fakeCode) => {
  const originalCodeTokens = tokenizeCode(originalCode);
  const fakeCodeTokens = tokenizeCode(fakeCode);
  
  const map = new SourceMapGenerator({
    file: fileName,
  });
  map.setSourceContent(fileName, fakeCode);
  
  const rowsIndexes = generateIndexes(originalCodeTokens, fakeCodeTokens);
  for (const [originalRowIndex, fakeRowIndex] of rowsIndexes) {
    const originalRow = originalCodeTokens[originalRowIndex];
    const fakeRow = fakeCodeTokens[fakeRowIndex];
    
    const chunkIndexes = generateIndexes(originalRow, fakeRow);
    for (const [originalChunkIndex, fakeChunkIndex] of chunkIndexes) {
      const originalChunk = originalRow[originalChunkIndex];
      const fakeChunk = fakeRow[fakeChunkIndex];
      
      map.addMapping({
        source: fileName,
        name: fakeChunk.value,
        original: {
          line: originalRowIndex + 1,
          column: originalChunk.position,
        },
        generated: {
          line: fakeRowIndex + 1,
          column: fakeChunk.position,
        },
      });
    }
  }
  
  return map.toString();
};

const generateFileComment = sourceMapFileName => `\n//# sourceMappingURL=${sourceMapFileName}`;
const generateInlineComment = sourceMapCode => `\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64.encode(sourceMapCode)}`;

module.exports = {
  generateFakeSourceMap,
  generateFileComment,
  generateInlineComment,
};
