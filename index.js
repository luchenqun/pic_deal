const fs = require("fs-extra");
const path = require("path");
const ImageDirPath = "./images";
const FinalDirPath = "./final";
const FinalPicDirPath = "./final/pic";
const FinalJsonDirPath = "./final/json";
const MapTraitType = {
  0: "background",
  1: "skin",
  2: "shirt",
  3: "brooch",
  4: "eyes",
  5: "mouth",
  6: "face decoration",
  7: "hair",
  8: "headwear",
  9: "ear",
  10: "hand",
  11: "shoulder",
  12: "race",
  // 最多13个
};

const ValutTypeIndex = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  A: "10",
  B: "11",
  C: "12",
  D: "13",
  E: "14",
  F: "16",
  G: "17",
  H: "18",
  J: "19",
  K: "20",
  L: "21",
  M: "22",
  N: "23",
  O: "24",
  P: "25",
};

const ValueType = {
  0: ["Purple Church Background", "Early Morning Ruins Background", "Black Night Ruins Background", "Dusk ruins background", "Early Morning Church Background", "Dark Night Church Background", "Green forest background", "Banquet room background", "War Background", "Black Bat Background", "Black Wolf Eyes Background", "Fuchsia background", "Yellow background", "Blue background", "Purple background", "Cyan background"],
  1: ["white skinned face", "Green face", "Grey face", "Brown Face"],
  2: ["White T-shirt", "Rose Suit", "Orange casual wear", "Plaid Shirt", "White Vest", "Brown wool coat", "Blue Jacket", "Green casual suit with scarf", "Blue Casual Suit", "Green Casual Suit", "Brown cloak", "Blue Sweatshirt", "Dark red suit", "Coffee colored suit", "Green Jacket", "Green Sweatshirt", "Yellow leisure suit", "Coffee sweatshirt", "Grey Sweatshirt", "Blue Suit", "Yellow casual wear", "Grey bodysuit", "Black Jacket"],
  3: ["Butterfly", "Beetle", "Skull", "Roses", "Bird Feathers", "Scarlet Butterfly", "Scarlet Feather"],
  4: ["Green Eyes", "Blue Eyes", "Red Eyes", "Purple Eyes", "Mechanical Eye", "Cat eyes", "Bleeding Eyes"],
  5: ["Tongue", "Cigar", "Cigarettes", "Wolf Tooth"],
  6: ["Cross Tattoo", "V mask", "Chainsaw Mask", "Blood-shaped tattoo", "Red mask", "White mask", "Leaf-shaped tattoos", "Grey Mask", "Red Mask", "Green Mask", "The Third Eye", "Cat Face", "Sunglasses", "Clown Mask", "A-shaped tattoo", "Fishbone tattoo", "Alien Tattoo"],
  7: ["White slicked-back hair", "purple slicked-back hair", "yellow slicked-back hair", "blue slicked-back hair", "White Stinger", "Pink Stinger", "Red curly hair", "Grey curly hair", "Blue Stinger", "Black split ends", "Red split head", "Green split head", "Brown parted hair"],
  8: ["Christmas Hat", "Orange military cap", "Red beret", "Blue Hat", "Golden Crown", "Silver Crown", "Red Crown", "Blue Crown", "Purple Crown", "Yellow and green military cap", "Brown bowler hat", "Red duck tongue cap", "Blue duck tongue cap", "Transparent", "Coffee-colored bowler hat", "Brown duck tongue cap", "Green Bowler Hat", "Purple bowler hat"],
  9: ["Common Ears ", "Ordinary ears (with earrings)", "Missing ear (with earring)", "missing ear"],
  10: ["Silver Axe", "Whip", "Sharp Knives", "Hammer", "Wine glasses", "brushes", "Money Bags", "Skeleton Cane", "Cat Paws", "Roses", "Magic Wand", "Magic Bottle", "Book", "Violin"],
  11: ["White Fox", "White Cat", "Black Bat", "Black Cat", "Red Bat", "Wolf Head", "Crow"],
  12: ["Assamite", "Brujah", "Tzimisce", "Ventrue", "Gangrel", "Lasombra", "Ravnos", "Malkavian", "Nosferatu", "Giovanni", "Tremere", "Toreador", "Setites"],
};

let statisticPosition = {};
let statisticOption = {};
let statisticData = { count: 0 };

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList); //递归读取文件
    } else {
      if (fullPath.toUpperCase().endsWith(".PNG")) {
        filesList.push(fullPath)
      }
    }
  });
  return filesList;
}

function shuffleSwap(arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    var rand = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[rand]] = [arr[rand], arr[i]];
  }
  return arr;
}

let deal = async function () {
  await fs.emptyDir(FinalDirPath);
  await fs.ensureDir(FinalDirPath);
  await fs.ensureDir(FinalPicDirPath);
  await fs.ensureDir(FinalJsonDirPath);

  // 初始化统计数据
  for (const key in MapTraitType) {
    statisticPosition[MapTraitType[key]] = 0;
  }
  for (const key in ValueType) {
    for (const value of ValueType[key]) {
      statisticOption[value] = 0;
    }
  }

  try {
    let images = [];
    readFileList(ImageDirPath, images);
    shuffleSwap(images)
    if (images.length == 0) {
      console.log("请将所有图片放到images目录")
    }

    let count = 1;
    for (const image of images) {
      if (!image.toUpperCase().endsWith(".PNG")) {
        continue;
      }

      let name = path.basename(image).toUpperCase().replace(".PNG", "");
      // console.log(image, name)
      let attributes = [];
      // console.log("name", name)
      for (let index = 0; index < 13; index++) {
        const ch = name[index];
        if (ch == 0) continue;
        const valueList = ValueType[index];
        const trait_type = MapTraitType[index];
        const value = valueList[ValutTypeIndex[ch] - 1];
        if (value) {
          statisticPosition[trait_type]++;
          statisticOption[value]++;
          // console.log(trait_type, value)
          attributes.push({ trait_type, value });
        }
      }

      let json = {
        attributes,
        image: `ipfs://QmYWLWUFTXyK7i29ragN7YvCKCNBHJxeadsfgca7TtbUc9/${count}.png`,
        description: "description of NFT",
        name: `Name #${count}`,
      };

      await fs.writeJSON(path.join(FinalJsonDirPath, `${count}.json`), json, { spaces: 4 });
      await fs.copyFile(image, path.join(FinalPicDirPath, `${count}.png`));
      statisticData[image] = `${count}.png`;
      count++;
      if (count % 100 == 0) {
        console.log("已处理 " + count + " 张图片")
      }
    }
    statisticData.count = count - 1;
    await fs.writeJSON(path.join(FinalDirPath, `statisticData.json`), statisticData, { spaces: 4 });
    await fs.writeJSON(path.join(FinalDirPath, `statisticPosition.json`), statisticPosition, { spaces: 4 });
    await fs.writeJSON(path.join(FinalDirPath, `statisticOption.json`), statisticOption, { spaces: 4 });
    console.log("已全部处理完毕放入final目录，总共处理" + (count - 1) + "张图片")
  } catch (error) {
    console.log("error", error);
  }
};

deal();
