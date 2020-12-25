const fs = require("fs");
const path = require("path");
const argv = require('minimist')(process.argv.slice(2));
const {
  generateFakeSourceMap,
  generateFileComment,
  generateInlineComment,
} = require("./fakeSourceMapGenerator");

const doWork = (config = {}) => {
  let {
    mode,
    originalCodePath,
    fakeCodePath,
    destinationDir,
  } = config;
  
  if (!["file", "inline"].includes(mode)) {
    throw new Error("Incorrect mode. \"file\" and \"inline\" are allowed.");
  }
  
  originalCodePath = path.normalize(originalCodePath);
  if (!fs.existsSync(originalCodePath) || !fs.statSync(originalCodePath).isFile()) {
    throw new Error("File " + originalCodePath + " cannot be accessed.");
  }
  
  fakeCodePath = path.normalize(fakeCodePath);
  if (!fs.existsSync(fakeCodePath) || !fs.statSync(fakeCodePath).isFile()) {
    throw new Error("File " + fakeCodePath + " cannot be accessed.");
  }
  
  destinationDir = path.normalize(destinationDir);
  if (!fs.existsSync(destinationDir) || !fs.statSync(destinationDir).isDirectory()) {
    throw new Error("Directory " + destinationDir + " cannot be accessed.");
  }
  
  const originalCodeFileName = path.basename(originalCodePath);
  const mapFileName = originalCodeFileName + ".map";
  
  const destinationCodePath = path.resolve(destinationDir, originalCodeFileName);
  const destinationMapPath = path.resolve(destinationDir, mapFileName);
  
  const originalCode = fs.readFileSync(originalCodePath).toString().trim();
  const fakeCode = fs.readFileSync(fakeCodePath).toString().trim();
  
  const sourceMap = generateFakeSourceMap(originalCodeFileName, originalCode, fakeCode);
  
  switch (mode) {
    case "file": {
      const appendData = generateFileComment(mapFileName);
      fs.copyFileSync(originalCodePath, destinationCodePath);
      fs.appendFileSync(destinationCodePath, appendData);
      fs.writeFileSync(destinationMapPath, sourceMap);
      break;
    }
    
    case "inline": {
      const appendData = generateInlineComment(sourceMap);
      fs.copyFileSync(originalCodePath, destinationCodePath);
      fs.appendFileSync(destinationCodePath, appendData);
      break;
    }
  }
};

if (require.main === module) {
  const {
    mode, m,
    original, o,
    fake, f,
    destination, d,
  } = argv;
  doWork({
    mode: mode || m,
    originalCodePath: original || o,
    fakeCodePath: fake || f,
    destinationDir: destination || d,
  });
} else {
  module.exports = doWork;
}
