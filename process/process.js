if (!process.env.ONETECH_FOOD_BONUS) {
  process.env.ONETECH_FOOD_BONUS = 0;
}

const MainProcessor = require('./src/MainProcessor');

const processor = new MainProcessor(__dirname);

processor.doDownload = process.argv.includes('download');
processor.doSprites = processor.doDownload || process.argv.includes('sprites');
processor.doSounds = processor.doDownload || process.argv.includes('sounds');

console.log("--- 处理静态数据边缘 ---");
const unprocessedVersion = processor.process(null);

if (unprocessedVersion) {
  processor.doDownload = false;
  console.log(`--- 处理静态数据对于 v${unprocessedVersion.id} ---`);
  processor.process(unprocessedVersion);
}
