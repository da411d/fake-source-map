# fake-source-map
Генерує фейковий source-map. Тобто код один, а source-map інший.

![screenshot](./images/screenshot.png)

## Використання

### Node.js
```lang-js
const generateFakeSourceMap = require("fake-source-map");

generateFakeSourceMap({
    mode,
    originalCodePath,
    fakeCodePath,
    destinationDir,
});
```

```lang-js
const {
  generateFakeSourceMap,
  generateInlineComment,
  generateFileComment,
} = require("fake-source-map");

const sourceMap = generateFakeSourceMap("someName.js", "/* code */", "/* fake code */");
// "{\"version\":3,\"sources\":[\"code.js\"],..."

generateInlineComment(sourceMap);
// "//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGUuanMiXSwibm..."

generateFileComment("someName.js.map");
// "//# sourceMappingURL=someName.js.map"
```

### CLI
```
node src/index.js --mode=file --original=./script.js --fake=./fake.js --destination=./destination
```
або
```
node src/index.js -m=file -o=./script.js -f=./fake.js -d=./destination
```

## Опції

### mode (`inline | file`)

* inline - SourceMap дописується в кінець файлу в форматі Base64
```
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGUuanMiXSwibm...
```
* file - SourceMap записується в файл, в кінець файлу записується посилання на файл
```
//# sourceMappingURL=code.js.map
```

### originalCodePath

Шлях до оригінального, справжнього файлу.

### fakeCodePath

Шлях до "фальшивого" файлу. 


### destinationDir

Папка, в яку збережеться результат.
