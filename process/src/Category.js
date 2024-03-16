"use strict";

class Category {
  constructor(dataText) {
    this.objectIDs = [];
    this.objectWeights = [];
    const lines = dataText.split('\n');
    let headers = true;
    for (let line of lines) {
      if (headers) {
        headers = this.processHeader(line);
      } else {
        this.processObject(line);
      }
    }
  }

  processHeader(line) {
    const parts = line.split('=');
    switch (parts[0]) {
      case "parentID":   this.parentID = parts[1]; break;
      case "pattern":    this.pattern = true; break;
      case "probSet":    this.probSet = true; break;
      case "numObjects": return false; // Done processing headers
      default:           throw `Unknown category header: ${parts[0]}`;
    }
    return true; // Continue processing headers
  }

  processObject(line) {
    const parts = line.split(' ');
    if (parts[0]) {
      this.objectIDs.push(parts[0]);
      if (this.probSet) {
        this.objectWeights.push(parseFloat(parts[1]));
      }
    }
  }

  objectWeight(id) {
    return this.objectWeights[this.objectIDs.indexOf(id)];
  }

  addToObjects(objects) {
    this.parent = objects[this.parentID];
    if (!this.parent) throw "无法找到物体(id)" + this.parentID;
    this.parent.category = this;
    this.objects = [];
    for (let id of this.objectIDs) {
      const object = objects[id];
      if (!object) {
        console.log(`类别/${this.parentID}.txt 中的物体 ID ${id} 无效`)
      } else if (object == this.parent) {
        console.log(`类别不应在 categories/${this.parentID}.txt 中引用自身`)
      } else {
        this.objects.push(object);
        object.categories.push(this);
      }
    }
  }
}

module.exports = Category;
