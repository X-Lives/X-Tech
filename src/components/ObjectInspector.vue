<template>
  <div class="objectInspector">
    <div class="info">
      <h2>{{object.baseName()}}</h2>
      <h3 v-if="object.subName()">{{object.subName()}}</h3>
      <ObjectImage :object="object" scaleUpTo="128" />
      <h3 v-if="!object.data">加载中...</h3>

      <div class="sounds" v-if="object.data && object.data.sounds">
        <div class="sound" v-for="sound in object.data.sounds" @click="playSound(sound)" title="播放声音" v-tippy>
          <audio :id="'sound' + sound" @ended="finishSound(sound)">
            <source :src="soundPath(sound, 'mp3')" type="audio/mp3">
            <source :src="soundPath(sound, 'ogg')" type="audio/ogg">
          </audio>
          <img src="../assets/sound.svg" width="22" height="20" alt="Play Sound" />
        </div>
      </div>

      <ul v-if="object.data">
        <li v-if="foodWithBothBonus">
          食物: {{foodBase}}
          <span class="details"> + {{foodBaseBonus}} 奖励</span>
        </li>
        <li v-if="object.data.heatValue">热量: {{object.data.heatValue}}</li>
        <li v-if="object.clothingPart()">衣物: {{object.clothingPart()}}</li>
        <li v-if="object.hasInsulation()">隔热: {{object.insulationPercent()}}%</li>
        <li v-if="moveDistanceText">
          移动距离: {{moveDistanceText}}
          <span class="helpTip" v-tippy :title="moveDistanceTip" v-if="moveDistanceTip">?</span>
        </li>
        <li v-if="moveType">移动行为: {{moveType}}</li>
        <li v-if="numUses">
          Number of {{useWord}}s: {{numUses}}
          <span class="helpTip" v-tippy :title="numMovesTip" v-if="numMovesTip">?</span>
        </li>
        <li v-if="totalFood">食物总计: {{totalFood}}</li>
        <li v-if="object.data.useChance">
          消耗耐久几率:
          {{object.data.useChance*100}}%
          <span class="details">(最后一次 100%)</span>
        </li>
        <li v-if="estimatedUses">预计次数 {{useWord}}s: {{estimatedUses}}</li>
        <li v-if="pickupText">{{pickupText}}</li>
        <li v-if="object.data.useDistance">使用距离: {{object.data.useDistance}} tiles</li>
        <li v-if="speedPercent">移动速度: {{speedPercent}}%</li>
        <li v-if="sizeText">{{sizeText}}</li>
        <li v-if="containerText">{{containerText}}</li>
        <li v-if="object.data.blocksWalking">阻碍移动</li>
        <li v-if="object.data.deadlyDistance">致命</li>
        <li v-if="difficultyText">
          难度: {{difficultyText}}
          <span class="helpTip" v-tippy :title="difficultyTip">?</span>
        </li>
        <li v-if="!object.data.craftable">不可合成</li>
        <li>
          物品 ID: {{object.id}}
        </li>
        <li v-if="object.data.version < 20269">
          由 One Hour One Life 添加
          <router-link :to="versionUrl">v{{object.data.version}}</router-link>
        </li>
        <li v-else-if="object.data.version < 20311">
          由 Two Hours One Life 添加
          <router-link :to="versionUrl">v{{object.data.version}}</router-link>
        </li>
        <li v-else-if="object.data.version">
          由 XLives 添加
          <router-link :to="versionUrl">v{{object.data.version}}</router-link>
        </li>
        <li v-else-if="modName">
          由 {{modName}} 添加
        </li>
        <li v-else>
          <router-link to="/versions/unreleased">未发布</router-link>
        </li>
      </ul>
    </div>
    <div class="transitionsPanels" v-if="object.data">
      <div class="transitionsPanel" v-if="object.data.transitionsToward.length > 0 || object.data.mapChance">
        <h3>如何获得</h3>
        <div class="actions" v-if="object.data && (object.data.recipe || object.data.techTree)">
          <router-link :to="object.url('tech-tree')" v-if="object.data.techTree" title="科技树" v-tippy>
            <img src="../assets/techtree.png" width="38" height="36" alt="Tech Tree" />
          </router-link>
          <router-link :to="object.url('recipe')" v-if="object.data.recipe" title="制作配方" v-tippy>
            <img src="../assets/recipe.png" width="41" height="42" alt="Crafting Recipe" />
          </router-link>
          <router-link to="/letters" v-if="isLetterOrSign" title="字母配方" v-tippy>
            <img src="../assets/sign.png" width="40" height="41" alt="Letters Recipe"  />
          </router-link>
        </div>
        <div v-if="object.data.mapChance" class="spawn">
          <div class="spawnChance">
            生成几率: {{spawnText}}
          </div>
          <div class="biomes">
            <router-link v-for="biome in biomes" :to="biome.url()" :title="biomeTitle(biome)" v-tippy class="biome" :key="biome.id">
              <BiomeImage :biome="biome" />
            </router-link>
          </div>
        </div>
        <TransitionsList
          :limit="object.data.mapChance ? '0' : '1'"
          :transitions="object.data.transitionsToward"
          :selectedObject="object" />
      </div>
      <div class="transitionsPanel" v-if="object.data.transitionsTimed.length > 0">
        <h3>随时间变化</h3>
        <TransitionsList
          limit="3"
          :transitions="object.data.transitionsTimed"
          :selectedObject="object" />
      </div>
      <div class="transitionsPanel" v-if="object.data.transitionsAway.length > 0">
        <h3>如何使用</h3>
        <TransitionsList
          limit="10"
          :transitions="object.data.transitionsAway"
          :selectedObject="object" />
      </div>
    </div>
  </div>
</template>

<script>
import GameObject from '../models/GameObject';
import Biome from '../models/Biome';

import ObjectImage from './ObjectImage';
import BiomeImage from './BiomeImage';
import TransitionsList from './TransitionsList';

export default {
  components: {
    ObjectImage,
    BiomeImage,
    TransitionsList,
  },
  data() {
    return {
      object: GameObject.findAndLoad(this.$route.params.id),
    };
  },
  created() {
    if (!this.object)
      this.$router.replace("/not-found");
  },
  watch: {
    '$route' (to, from) {
      this.object = GameObject.findAndLoad(this.$route.params.id);
    }
  },
  computed: {
    spawnText() {
      return this.object.spawnText();
    },
    difficultyText() {
      if (!this.object.difficulty) return;
      const levels = [
        "极其简单",
        "非常简单",
        "简单",
        "较为简单",
        "中等",
        "较为困难",
        "困难",
        "非常困难",
        "极为困难",
      ];
      return levels[Math.floor(this.object.difficulty*levels.length)];
    },
    difficultyTip() {
      const stepWord = this.object.data.depth == 1 ? "步骤" : "步骤";
      return `${this.object.data.depth} ${stepWord} 难度`;
    },
    moveDistanceText() {
      if (!this.object.data.moveDistance) return;
      const tiles = this.object.data.moveDistance > 1 ? "格数" : "格数";
      return this.object.data.moveDistance + " " + tiles;
    },
    moveDistanceTip() {
      if (!this.object.data.moveDistance) return;
      return "走过物体时最多 +4 格";
    },
    moveType() {
      if (!this.object.data.moveType) return;
      const types = ["无", "追逐", "逃逸", "随机", "向北", "向南", "向东", "向西"];
      return types[this.object.data.moveType];
    },
    numUses() {
      if (!this.object.data.numUses) return;
      return this.object.data.numUses;
    },
    estimatedUses() {
      if (!this.object.data.useChance) return;
      return Math.round((this.numUses - 1) * (1/this.object.data.useChance)) + 1;
    },
    useWord() {
      if (this.object.data.moveDistance) return "移动";
      return "使用";
    },
    moveTip() {
      if (!this.object.data.moveDistance) return;
      return '参见 “随时间变化” 下的 “最后一次” 转换';
    },
    numMovesTip() {
      if (!this.object.data.moveDistance) return;
      return '参见 “随时间变化” 下的 “最后一次” 转换';
    },
    sizeText() {
      if (!this.object.data.size) {
        if (!this.object.data.minPickupAge) return;
        return "不能放入容器中";
      }
      return `物品尺寸: ${this.object.size()}`;
    },
    containerText() {
      if (!this.object.data.numSlots) return;
      return `容纳 ${this.object.data.numSlots} ${this.object.slotSize()} items`;
    },
    pickupText() {
      if (!this.object.data.minPickupAge) return;
      return `拾取年龄: ${this.object.data.minPickupAge}`;
    },
    isLetterOrSign() {
      return this.object.name.includes("Letter") || this.object.name.includes("Sign");
    },
    versionUrl() {
      return "/versions/" + this.object.data.version;
    },
    modName() {
      return process.env.ONETECH_MOD_NAME;
    },
    foodEatBonus() {
      return GameObject.foodEatBonus;
    },
    foodBaseBonus() {
      if (!this.object.data.foodValue) return;
      return this.object.data.foodValue[1];
    },
    foodBase() {
      if (!this.object.data.foodValue) return;
      return this.object.data.foodValue[0];
    },
    foodWithBothBonus() {
      if (!this.foodBase) return;
      return this.foodBase + this.foodBaseBonus + this.foodEatBonus;
    },
    foodTip() {
      return `${this.foodBase} base + ${this.foodBaseBonus} base bonus + ${this.foodEatBonus} eat bonus`;
    },
    totalFood() {
      if (!this.foodValue || !this.numUses) return;
      return this.foodValue * this.numUses;
    },
    speedPercent() {
      if (!this.object.data.speedMult) return;
      return this.object.data.speedMult * 100;
    },
    biomes() {
      if (!this.object.data.biomes) return [];
      return this.object.data.biomes.map(biomeData => Biome.find(biomeData.id.toString()));
    },
  },
  methods: {
    soundPath(id, extension) {
      return `${global.staticPath}/sounds/${id}.${extension}`;
    },
    playSound(id) {
      const sound = document.getElementById(`sound${id}`);
      if (sound.paused) {
        sound.load();
        sound.play();
        sound.parentElement.classList.add("playing");
      } else {
        sound.pause();
        sound.currentTime = 0;
        sound.parentElement.classList.remove("playing");
      }
    },
    finishSound(id) {
      const sound = document.getElementById(`sound${id}`);
      sound.parentElement.classList.remove("playing");
    },
    biomeTitle(biome) {
      const biomeData = this.object.data.biomes.find(biomeData => biomeData.id == biome.id);
      return `${biome.name} (${this.object.toPercent(biomeData.spawnChance, 2)}%)`;
    }
  },
  metaInfo() {
    return {title: this.object.name};
  }
}
</script>

<style scoped lang="scss">
  .objectInspector {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .objectInspector .info {
    flex: 1 1 0;

    background-color: #2b2b2b;
    margin: 10px 0;
    border-radius: 5px;

    padding-bottom: 30px;
  }
  .objectInspector .info > h2 {
    text-align: center;
    font-weight: bolder;
    margin-bottom: 0;
  }
  .objectInspector .info > h3 {
    text-align: center;
    font-weight: lighter;
    font-style: italic;
    margin: 0;
  }
  .objectInspector .info > .imgContainer {
    width: 100%;
    height: 256px;
  }

  .objectInspector .sounds {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }

  .objectInspector .sound {
    margin: 0 8px;
    cursor: pointer;
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: solid 1px transparent;
    background-color: #505050;
    &:hover {
      background-color: #666;
      border: solid 1px #eee;
    }
    &.playing {
      background-color: #d00;
    }
  }

  .objectInspector .info > ul {
    padding: 0;
    margin: 0 30px;
    font-size: 1.2rem;
    list-style-type: none;
  }
  .objectInspector .info li {
    text-align: center;
    padding: 2px 0;
  }
  .objectInspector .info li .details {
    color: #999;
  }

  .objectInspector .actions {
    display: flex;
    justify-content: center;
    padding: 10px;
    background-color: #2b2b2b;
    border-radius: 5px;
    margin-top: 10px;
  }
  .objectInspector .actions a {
    display: block;
    margin: 0 10px;
    padding: 8px 10px;
    background-color: #505050;
    border: 1px solid transparent;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  .objectInspector .actions a:hover {
    border: 1px solid #eee;
    background-color: #666;
  }
  .objectInspector .actions a img {
    display: block;
  }

  .objectInspector .info .helpTip {
    display: inline-block;
    width: 1.18rem;
    height: 1.18rem;
    font-size: 0.9rem;
    border: 1px solid #999;
    border-radius: 0.6rem;
    background-color: #222;
    vertical-align: 0.15rem;
    margin-left: 3px;
  }
  .objectInspector .info .helpTip:hover {
    background-color: #555;
    cursor: default;
  }

  .objectInspector .transitionsPanel {
    background-color: #222;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .objectInspector .transitionsPanel > h3 {
    font-size: 18px;
    margin: 0;
    padding: 0;
    text-align: center;
  }

  .objectInspector .spawn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: #2b2b2b;
    border-radius: 5px;
    margin-top: 10px;
  }

  .objectInspector .spawnChance {
    margin-bottom: 10px;
  }

  .objectInspector .biomes {
    display: flex;
    flex-wrap: wrap;
  }

  .objectInspector .biome {
    margin: 0 5px;
    width: 54px;
    height: 54px;
  }

  .objectInspector .biomeImage {
    border-radius: 5px;
    border: solid 1px transparent;
  }

  .objectInspector .biomeImage:hover {
    border: solid 1px white;
  }

  .objectInspector .playSound {
    text-decoration: underline;
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    .objectInspector {
      flex-direction: column;
      align-items: center;
    }

    .objectInspector .info {
      width: 100%;
    }

    .objectInspector .info > ul {
      font-size: 1.1rem;
    }

    .objectInspector .transitionsPanel {
      margin-left: 0;
    }
  }
</style>
