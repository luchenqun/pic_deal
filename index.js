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
  "12": "log",
  "13": "",
  "14": "",
  "16": "",
  "17": "",
  "18": "",
  "19": "",
  "20": "",
}
let deal = async function () {
  await fs.ensureDir(FinalDirPath)
  await fs.emptyDir(FinalDirPath)

  try {
    let images = await fs.readdir(ImageDirPath)
    let count = 1
    for (const image of images) {
      let attributes = []
      let name = image.toUpperCase().replace(".PNG", "")
      for (let index = 0; index < 13; index++) {
        const ch = name[index];
        if (ch == 0) continue
        attributes.push({
          "trait_type": MapTraitType[index],
          "value": ch
        })
      }

      let json = {
        attributes,
        "image": `${count}.png`,
        "description": "",
        "name": `Name #${count}`
      }

      await fs.writeJSON(path.join(FinalDirPath, `${count}.json`), json, { spaces: 4 })
      await fs.copyFile(path.join(ImageDirPath, image), path.join(FinalDirPath, `${count}.png`))
      await fs.copyFile(path.join(ImageDirPath, image), path.join(FinalDirPath, `${count}_${image}`))
      count++
    }
  } catch (error) {
    console.log("error", error)
  }
}

deal()