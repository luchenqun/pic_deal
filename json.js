const fs = require("fs-extra");
const path = require("path");
const FinalJsonDirPath = "./final/json";
const Final1000JsonDirPath = "./final/presaleNFT/json";

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList); //递归读取文件
    } else {
      filesList.push(fullPath)
    }
  });
  return filesList;
}

let deal = async function () {
  try {
    {
      let jsons = [];
      readFileList(Final1000JsonDirPath, jsons);
      if (jsons.length == 0) {
        console.log("没有json需要处理")
      }

      let count = 1;
      for (const jsonFile of jsons) {
        let tokenId = path.basename(jsonFile)
        let json = await fs.readJSON(jsonFile)
        json.image = `ipfs://QmUPxZwPbXMRVnCvmA5kxbiQKw9eFF25e2L25uq1qrCtoP/${tokenId}.png`
        json.description = "NightWorld is a world of supernatural horror and intrigue hidden in plain sight. Here, vampires, werewolves, and many other creatures live among us, concealed in the shadows. Vampire Clan is a collection of 10,894 hand-painted unique vampire NFTs. They are randomly generated and stored as ERC-721 tokens on the Ethereum Blockchain!"
        json.name = `Vampire #${tokenId}`
        // console.log(json)
        await fs.writeJSON(jsonFile, json, { spaces: 4 });
        count++;
        if (count % 100 == 0) {
          console.log("已替换presale " + count + " 个JSON文件")
        }
      }
      console.log("已全部处理完毕，总共处理presale " + (count - 1) + "个JSON文件")
    }


    {
      let jsons = [];
      readFileList(FinalJsonDirPath, jsons);
      let count = 1;
      for (const jsonFile of jsons) {
        let tokenId = path.basename(jsonFile)
        let json = await fs.readJSON(jsonFile)
        json.image = `ipfs://QmWX5AoMTeG6pZAdVgcst5XoxnZxqvNBaXtomotPmBuwCK/${tokenId}.png`
        json.description = "NightWorld is a world of supernatural horror and intrigue hidden in plain sight. Here, vampires, werewolves, and many other creatures live among us, concealed in the shadows. Vampire Clan is a collection of 10,894 hand-painted unique vampire NFTs. They are randomly generated and stored as ERC-721 tokens on the Ethereum Blockchain!"
        json.name = `Vampire #${tokenId}`
        // console.log(json)
        await fs.writeJSON(jsonFile, json, { spaces: 4 });
        count++;
        if (count % 100 == 0) {
          console.log("已替换public " + count + " 个JSON文件")
        }
      }
      console.log("已全部处理完毕，总共处理public " + (count - 1) + "个JSON文件")
    }
  } catch (error) {
    console.log("error", error);
  }
};

deal();
