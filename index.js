const fs = require('fs-extra')
const path = require('path')
const ImageDirPath = "./images"
const FinalDirPath = "./final"
const MapTraitType = {
  "0": "background",
  "1": "face",
  "2": "服装",
  "3": "胸花",
  "4": "eyes",
  "5": "mouth",
  "6": "脸部装饰",
  "7": "hair",
  "8": "头饰",
  "9": "ear",
  "10": "hand",
  "11": "shoulder",
  "12": "logo"
  // 最多13个
}

const ValutTypeIndex = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "A": "10",
  "B": "11",
  "C": "12",
  "D": "13",
  "E": "14",
  "F": "16",
  "G": "17",
  "H": "18",
  "J": "19",
  "K": "20",
  "L": "21",
  "M": "22",
  "N": "23",
  "O": "24",
  "P": "25"
}

const ValueType = {
  "0": ["教堂", "废墟1", "废墟2", "废墟3", "教堂2", "教堂3", "森林", "宴厅", "战场", "黑夜蝙蝠", "黑夜狼眼", "红", "黄", "蓝", "紫色"],
  "1": ["脸1", "脸2", "脸3", "脸4"],
  "2": ["服装", "T恤", "玫瑰西装", "橙色衣服", "格子衣服 红", "背心", "毛大衣", "蓝色衣服", "绿色毛衣", "蓝色 新西装", "绿色 新西装", "披风", "卫衣", "西装（红色）", "西装", "夹克 （绿色）", "卫衣F", "黄色西装", "卫衣3", "卫衣4", "西装（蓝色）", "黄色衣服", "T恤2", "夹克 （绿色）", "黄西服"],
  "3": ["蝴蝶装饰", "甲壳虫", "骷髅头", "玫瑰花", "鸟羽毛", "血色蝴蝶", "血色羽毛"],
  "4": ["眼睛1", "眼睛2", "眼睛3", "眼睛4", "机械眼", "猫眼睛", "流血眼睛"],
  "5": ["舌头", "雪茄", "香烟", "血液"],
  "6": ["01纹身", "v字", "电锯惊魂 面具", "脸部装饰（血液）", "口罩（红色）", "血液", "脸部装饰（纹身）", "面具", "面具3", "面具4", "三眼", "吸血鬼 正稿", "眼镜", "面具", "文字", "文字", "文字"],
  "7": ["01 白色背头", "01 粉色背头", "01 黄色背头", "01 蓝色背头", "白色头发 翘起", "粉色头发 翘起", "红色头发", "卷发 翘起", "蓝色头发 翘起", "三七分 1", "三七分 2", "三七分 3", "三七分 4"],
  "8": ["01圣诞帽", "02橙色帽子", "03贝雷帽", "04风帽", "皇冠  金色", "皇冠  银色", "皇冠 红色", "皇冠 蓝色", "皇冠 紫色", "黄绿色军帽", "军帽", "礼帽棕色", "鸭舌帽（红色）", "鸭舌帽（蓝色）", "透明", "咖啡色礼帽", "鸭舌帽（黑色）", "绿色礼帽", "紫色礼帽"],
  "9": ["普通耳朵 ", "普通耳朵(带耳环)", "缺耳 (带耳环)", "缺耳"],
  "10": ["白银斧头", "鞭子", "刀", "斧头-榔头", "红酒杯", "画笔", "金币 钱袋", "骷髅手杖", "猫爪", "玫瑰花", "魔法棒", "魔法瓶", "书", "小提琴"],
  "11": ["白狐", "白猫", "蝙蝠", "黑猫", "红蝙蝠", "狼头", "乌鸦"],
  "12": ["阿萨迈", "布鲁赫", "茨密西", "梵卓", "冈格罗", "勒森布拉", "雷弗诺", "迈卡维安", "诺菲勒", "乔凡尼", "瑞默尔", "托瑞多", "羲太"]
}

let statisticPosition = {}
let statisticOption = {}

let deal = async function () {
  await fs.ensureDir(FinalDirPath)
  await fs.emptyDir(FinalDirPath)

  // 初始化统计数据
  for (const key in MapTraitType) {
    statisticPosition[MapTraitType[key]] = 0
  }
  for (const key in ValueType) {
    for (const value of ValueType[key]) {
      statisticOption[value] = 0
    }
  }

  try {
    let images = await fs.readdir(ImageDirPath)
    let count = 1
    for (const image of images) {
      if (!image.toUpperCase().includes(".PNG")) {
        continue
      }

      let name = image.toUpperCase().replace(".PNG", "")

      let attributes = []
      console.log("name", name)
      for (let index = 0; index < 13; index++) {
        const ch = name[index];
        if (ch == 0) continue
        const valueList = ValueType[index]
        const trait_type = MapTraitType[index]
        const value = valueList[ValutTypeIndex[ch] - 1]
        if (value) {
          statisticPosition[trait_type]++;
          statisticOption[value]++;
          console.log(trait_type, value)
          attributes.push({ trait_type, value })
        }
      }

      let json = {
        attributes,
        "image": `ipfs://QmYWLWUFTXyK7i29ragN7YvCKCNBHJxeadsfgca7TtbUc9/${count}.png`,
        "description": "description of NFT",
        "name": `Name #${count}`
      }

      await fs.writeJSON(path.join(FinalDirPath, `${count}.json`), json, { spaces: 4 })
      await fs.copyFile(path.join(ImageDirPath, image), path.join(FinalDirPath, `${count}.png`))
      // await fs.copyFile(path.join(ImageDirPath, image), path.join(FinalDirPath, `${count}_${image}`))
      count++
    }
    await fs.writeJSON(path.join(FinalDirPath, `statisticPosition.json`), statisticPosition, { spaces: 4 })
    await fs.writeJSON(path.join(FinalDirPath, `statisticOption.json`), statisticOption, { spaces: 4 })

  } catch (error) {
    console.log("error", error)
  }
}

deal()