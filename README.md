# X-Tech

> XLives/2HOL/OHOL Crafting Reference

View here: `2HOL`https://twotech.twohoursonelife.com `OHOL`https://onetech.info/

~~This site is built using the game data directly from [the game data repository](https://github.com/twohoursonelife/OneLifeData7).~~
It shows the relationships between items, and lets you explore how things are crafted.

Unlike the wiki, which contains "wisdom" about the game, this site contains only "knowledge".
~~This is a reference. For a better guide, go to the [game wiki](https://twohoursonelife.fandom.com/wiki/Two_Hours,_One_Life_Wiki).~~


## Install Setup
> [!NOTE]\
> This tech was tested successfully on `WSL2 Ubuntu20.04.6LTS`.

Install `npm` & `nodeJS v18.x`.
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

Use Git to pull repositories.  
If Git is **not installed**, run: 
```bash
sudo apt-get install -y git
```
Then pull the repositories.
```bash
git clone https://github.com/X-Lives/X-Tech.git
```

Go to this directory.
```bash
cd X-Tech
```

Installation dependency.
```bash
npm install canvas
npm install imagemagick
```


## Build Setup

The project is split into two parts:
- A node script that processes the latest data from the game data repository
- The site itself, built in VueJS


### Site

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
# to simulate edge subdomain visit edge.lvh.me:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


### Processing Script

The script is under the folder `process`. It will pull the latest data from the game data repository (if provided `download` as a command line argument), and then generate JSON files for the objects. It will also composite the sprites and create PNGs for each object in the game.

To get it running, you will need to install [ImageMagick](https://www.imagemagick.org/script/index.php), [Canvas dependencies](https://github.com/Automattic/node-canvas/blob/v1.x/Readme.md#installation), and [SoX](http://sox.sourceforge.net) and then:

``` bash
cd process

# install dependencies
npm install

cd ..

# run script including downloading latest data and processing sprites
node process download

# if you want to re-process the sprites without downloading data
node process sprites

# if you want to re-process the sounds without downloading data
node process sounds

# or process without generating sprites
node process
```

### Modded Support

_Following forking this project, the following is less supported and we do not make use of this ourselves._

If you have a modded version of `OneLifeData7`, consider forking this repository and setting these environment variables before processing:

``` bash
export ONETECH_MOD_NAME="My Awesome Mod"
export ONETECH_MOD_URL="https://my-awesome-mod.com"
export ONETECH_PROCESS_GIT_PATH="/path/to/my/awesome-mod-data"
# or
export ONETECH_PROCESS_GIT_URL="https://github.com/my/awesome-mod-data"
```

After you have run the process and build scripts, push the changes up to your own fork. If you want to use GitHub Pages, you will need to remove `static` from `.gitignore`, and then you can go to the GitHub project settings and setup GitHub Pages to use the master branch. This will make the site publicly accessible.


### `zh_cn`
# X-Tech

> XLives/2HOL/OHOL 制作参考

在此查看： `2HOL`https://twotech.twohoursonelife.com `OHOL`https://onetech.info/

~~本网站直接使用[游戏数据储存库](https://github.com/twohoursonelife/OneLifeData7)中的游戏数据构建而成。~~
它可以显示物品之间的关系，让您探索物品是如何制作的。

与包含游戏 "智慧 "的维基不同，本网站只包含 "知识"。
~~这只是一个参考。如需更好的指南，请访问 [game wiki](https://twohoursonelife.fandom.com/wiki/Two_Hours,_One_Life_Wiki).~~


## 安装设置
> [!NOTE]\
> 本网站已在 `WSL2 Ubuntu20.04.6LTS` 上成功测试。

安装 `npm` 和 `nodeJS v18.x`。
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

使用 Git 拉取仓库。  
如果**未安装** Git，请运行：
```bash
sudo apt-get install -y git
```
然后拉取仓库。
```bash
git clone https://github.com/X-Lives/X-Tech.git
```

转到这个目录。
```bash
cd X-Tech
```

安装依赖。
```bash
npm install canvas
npm install imagemagick
```


## 构建设置

该项目分为两部分：
- 处理来自游戏数据存储库的最新数据的节点脚本
- 使用 VueJS 构建的网站本身


### 网站

```bash
# 安装依赖项
npm install

# 在 localhost:8080 热重载服务
# 要模拟边缘子域，请访问 edge.lvh.me:8080
npm run dev

# 为生产构建并进行最小化
npm run build
```

有关工作原理的详细解释，请查阅 [docs for vue-loader](http://vuejs.github.io/vue-loader)。


### 处理脚本

该脚本位于 `process` 文件夹下。它将从游戏数据存储库中提取最新数据（如果提供了 `download` 作为命令行参数），然后为对象生成 JSON 文件。它还会合成精灵，并为游戏中的每个对象创建 PNG。

要让它运行，您需要安装 [ImageMagick](https://www.imagemagick.org/script/index.php)、[Canvas 依赖项](https://github.com/Automattic/node-canvas/blob/v1.x/Readme.md#installation) 和 [SoX](http://sox.sourceforge.net) 然后：

```bash
cd process

# 安装依赖项
npm install

cd ..

# 运行脚本，包括下载最新数据和处理图元组合
node process download

# 如果想在不下载数据的情况下重新处理图元组合
node process sprites

# 如果要重新处理声音而不下载数据
node process sounds

# 或在不生成图元组合的情况下进行处理
node process
```

### 改进支持

fork 此项目后，以下内容将不再受到支持，我们自己也不会使用。

如果你有修改过的 `OneLifeData7` 版本，请考虑分叉此版本库，并在处理前设置这些环境变量：

``` bash
export ONETECH_MOD_NAME="My Awesome Mod"
export ONETECH_MOD_URL="https://my-awesome-mod.com"
export ONETECH_PROCESS_GIT_PATH="/path/to/my/awesome-mod-data"
# 或者
export ONETECH_PROCESS_GIT_URL="https://github.com/my/awesome-mod-data"
```

运行进程和构建脚本后，将更改推送到自己的 fork。如果你想使用 GitHub Pages，需要从 `.gitignore` 中移除 `static`，然后进入 GitHub 项目设置，将 GitHub Pages 设置为使用主分支。这样网站就可以公开访问了。
