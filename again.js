const fs = require("fs-extra");
const path = require("path");
const ImageDirPath = "./images";
const FinalDirPath = "./again";
const FinalPicDirPath = "./again/pic";
const FinalJsonDirPath = "./again/json";
const Final1000PicDirPath = "./again/presaleNFT/pic";
const Final1000JsonDirPath = "./again/presaleNFT/json";

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
  F: "15",
  G: "16",
  H: "17",
  I: "18",
  J: "19",
  K: "20",
  L: "21",
  M: "22",
  N: "23",
  O: "24",
  P: "25",
  Q: "26",
  R: "27",
  S: "28",
};

const ValueType = {
  "0": [
    "Ruins yellow background",
    "Ruins gray background",
    "Ruins red background",
    "Ruins purple background",
    "Ruins green background",
    "Orange background",
    "Red background",
    "Yellow background",
    "Blue background",
    "Dark blue background",
    "Green background",
    "Purple background",
    "Night bat",
    "Black night wolf eye",
    "Battlefield (yellow)",
    "Battlefield (red)",
    "Green forest",
    "Gray forest",
    "Purple church",
    "Gray church",
    "Ballroom (purple)",
    "Ballroom (red)",
    "Ballroom (ash)",
    "Battlefield (purple)"
  ],
  "1": [
    "Senior man",
    "Old people roll",
    "Old man",
    "Young man roll",
    "Young people",
    "Bark",
    "Old man",
    "Normal face"
  ],
  "2": [
    "Suit (green)",
    "Suit (brown",
    "Suit (blue)",
    "Suit T-shirt (orange",
    "Suit T-shirt (yellow)",
    "Suit T-shirt (purple)",
    "Vest",
    "Jacket 1",
    "Jacket 2",
    "Regular suit (brown)",
    "Regular suit (blue)",
    "Green sweater",
    "Coat",
    "Plaid clothing (powder purple)",
    "Plaid clothing (blue)",
    "Plaid clothes (green)",
    "Plaid clothes (gray)",
    "cloak",
    "Hoodie",
    "Sweater (pink)",
    "Sweater (green)",
    "Sweater (purple)",
    "T-shirt (green)",
    "T-shirt (purple)"
  ],
  "3": [
    "Butterfly",
    "Beetle",
    "Skull",
    "Rose",
    "Bird feather",
    "Bloody butterfly",
    "Bloody feather",
    "Hippocampus"
  ],
  "4": [
    "Green eyes",
    "Blue eye",
    "Red eye",
    "Purple eye",
    "Mechanical eye",
    "Cat eyes",
    "Bleeding"
  ],
  "5": [
    "Tongue",
    "cigar",
    "cigarette",
    "Wolf teeth"
  ],
  "6": [
    "Chain saw",
    "Fox mask",
    "Facial mask",
    "Face decoration (blood)",
    "Mask (red)",
    "Mask (green)",
    "Mask (purple)",
    "Mask (ash)",
    "Three eye",
    "Fish bone tattoo",
    "Heteropathy",
    "A word tattoo",
    "Cross tattoo",
    "clown mask",
    "sunglasses",
    "v word (red)",
    "v word (blue green)",
    "v word (green)",
    "V word gray"
  ],
  "7": [
    "Explosion head (red)",
    "Explosion head (blue)",
    "Explosion head (green)",
    "Explosion head (purple)",
    "Black",
    "Head (red)",
    "Hind (yellow)",
    "Back (blue)",
    "Head (green)",
    "Contrary (silver)",
    "Blade",
    "Curl (black)",
    "Curly hair (red)",
    "Curly hair (blue)",
    "37 points (red)",
    "37 points (blue)",
    "37 points (green)",
    "37 points (purple)",
    "Lightning head (red)",
    "Lightning head (green)",
    "Lightning head silver"
  ],
  "8": [
    "Duck cap (orange)",
    "Duckle cap (red)",
    "Duck cap (green)",
    "Duck cap (purple)",
    "Duck tongue",
    "Crown (red)",
    "Crown (yellow)",
    "Crown (gold)",
    "Crown (blue green)",
    "Crown (green)",
    "Crown (silver)",
    "Crown (purple)",
    "Report children's cap (blue)",
    "Report children's cap (green)",
    "Report children's cap (purple)",
    "Report children's cap (red)",
    "Cap (red)",
    "Cap (green)",
    "Cap (purple)",
    "Military hat (yellow)",
    "Military cap (blue)",
    "Military cap (gray)",
    "Hat brown",
    "Christmas hat",
    "Hat black",
    "Green hat",
    "Hat purple",
    "transparent"
  ],
  "9": [
    "Ordinary ear",
    "Ordinary ear (with earrings)",
    "Lack (with earrings)",
    "Lack"
  ],
  "10": [
    "Silver ax",
    "Silver ax 2",
    "Silver ax 3",
    "Sharp knife 1",
    "Sharp knife 2",
    "whip",
    "Ax 1",
    "Ax 2",
    "Red wine glass 1",
    "Red wine cup 2",
    "brush",
    "wallet",
    "Cane",
    "Cat claw",
    "Rose",
    "Magic stick",
    "Red magic bottle",
    "Book",
    "violin",
    "Violin 2",
    "Red magic bottle starlight",
    "Blue magic bottle starlight",
    "Blue magic bottle starlight"
  ],
  "11": [
    "frog",
    "Scorpion",
    "Black bat",
    "Moof cat",
    "Red bat",
    "Wolf head",
    "Crow",
    "lizard",
    "Spider"
  ],
  "12": [
    "Assamite",
    "Brujah",
    "Tzimisce",
    "Ventrue",
    "Gangrel",
    "Lasombra",
    "Ravnos",
    "Malkavian",
    "Nosferatu",
    "Giovanni",
    "Tremere",
    "Toreador",
    "Setites"
  ]
}

let statisticPosition = {};
let statisticOption = {};
let statisticData = { count: 0 };

let deal = async function () {
  await fs.emptyDir(FinalDirPath);
  await fs.ensureDir(FinalDirPath);
  await fs.ensureDir(FinalPicDirPath);
  await fs.ensureDir(FinalJsonDirPath);
  await fs.ensureDir(Final1000PicDirPath);
  await fs.ensureDir(Final1000JsonDirPath);

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
    let images = await fs.readJSON("./final/statisticData.json");
    let count = 1;
    while (count <= 10894) {
      let image = ""
      for (const ipath in images) {
        let pic = images[ipath]
        if (pic == `${count}.png`) {
          image = ipath
          break
        }
      }

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
        const value = valueList[parseInt(ValutTypeIndex[ch]) - 1];
        if (value) {
          statisticPosition[trait_type]++;
          statisticOption[value]++;
          // console.log(trait_type, value)
          attributes.push({ trait_type, value });
        }
      }

      let json = {
        attributes,
        description: "NightWorld is a world of supernatural horror and intrigue hidden in plain sight. Here, vampires, werewolves, and many other creatures live among us, concealed in the shadows. Vampire Clan is a collection of 10,894 hand-painted unique vampire NFTs. They are randomly generated and stored as ERC-721 tokens on the Ethereum Blockchain!",
        name: `Vampire #${count}`,
      };
      if (count <= 1000) {
        json.image = `ipfs://QmUPxZwPbXMRVnCvmA5kxbiQKw9eFF25e2L25uq1qrCtoP/${count}.png`
        await fs.writeJSON(path.join(Final1000JsonDirPath, `${count}`), json, { spaces: 4 });
      } else {
        json.image = `ipfs://QmWX5AoMTeG6pZAdVgcst5XoxnZxqvNBaXtomotPmBuwCK/${count}.png`
        await fs.writeJSON(path.join(FinalJsonDirPath, `${count}`), json, { spaces: 4 });
      }
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
    console.log("已全部处理完毕放入again目录，总共处理" + (count - 1) + "张图片")
  } catch (error) {
    console.log("error", error);
  }
};

deal();
