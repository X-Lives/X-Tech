"use strict";

const GameData = require('./GameData');

class MainProcessor {
  constructor(processDir) {
    this.processDir = processDir;
  }

  staticDir(edge) {
    if (edge && !process.env.ONETECH_MOD_NAME) {
      return this.processDir + "/../public/static-edge";
    }
    return this.processDir + "/../public/static";
  }

  dataDir() {
    return process.env.ONETECH_PROCESS_GIT_PATH || (this.processDir + "/OneLifeData7");
  }

  gitUrl() {
    return process.env.ONETECH_PROCESS_GIT_URL || "https://github.com/X-Lives/X-Data.git";
  }

  process(version) {
    const gameData = new GameData(this.processDir, this.dataDir(), this.staticDir(!version));

    if (this.doDownload) {
      console.log("下载数据...");
      gameData.download(this.gitUrl());
    } else {
      gameData.verifyDownloaded();
    }

    if (version) {
      console.log(`正在检查 v${version.id}...`);
      gameData.checkoutVersion(version);
    } else {
      gameData.checkoutMaster();
    }

    console.log("导入物体...");
    gameData.importObjects();
    gameData.importCategories();
    gameData.importTransitions();
    gameData.importBiomes();

    console.log("填充版本...");
    gameData.populateVersions();

    console.log("计算物体难度...");
    gameData.calculateObjectDepth();

    if (this.doSprites) {
      console.log("转换图元图像...");
      gameData.convertSpriteImages();
      gameData.convertGroundImages();

      console.log("处理图元...");
      gameData.processSprites();
    }

    if (this.doSounds) {
      console.log("转换声音文件...");
      gameData.convertSounds();
    }

    console.log("导出对象...");
    gameData.exportObjects();

    // console.log("Exporting versions...");
    // gameData.exportVersions();

    console.log("导出生物群系...");
    gameData.exportBiomes();

    if (version) {
      console.log("生成站点地图...");
      gameData.generateSitemap();
      return null;
    }

    if (process.env.ONETECH_MOD_NAME) {
      return null;
    }

    return gameData.unprocessedVersion(this.staticDir(false), !this.doDownload);
  }
}

module.exports = MainProcessor;
