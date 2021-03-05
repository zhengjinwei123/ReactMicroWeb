const xlsx = require("node-xlsx")
const fs = require("fs")
const path = require("path")

let sheets = xlsx.parse(fs.readFileSync(path.join(__dirname, "locale.xlsx")))

sheets.forEach((sheet) => {
    let lanMap = {}
    let datas = [];
    let keys = [];
    let lanDesc = {};

    for (let rowId in sheet['data']) {
        let row = sheet['data'][rowId]

        if (rowId == 0) {
            lanDesc = row;
        } else if (rowId == 1) {
            keys = row;

            for (let i = 0; i < keys.length; ++i) {
                if (i == 0) {continue;}
                lanMap[keys[i]] = {
                    "language": lanDesc[i] + "(本文件由工具生成,请勿手动修改)"
                }
            }

        } else {
            let obj = {}
            for (let i = 0; i < row.length; i++) {
                obj[keys[i]] = row[i];
            }
            datas.push(obj)
        }     
    }

    for (let i = 0 ; i < datas.length; ++i) {

        let fieldName = datas[i]["name"]
        for (let lanName in datas[i]) {
            if (lanName === "name") {
                continue;
            }
            lanMap[lanName][fieldName] = datas[i][lanName]
         }
    }
    const destDirName = path.join(__dirname, "../src/locales")
    for (let lan in lanMap) {
        fs.writeFile(`${destDirName}/${lan}.json`, JSON.stringify(lanMap[lan]), res => {
            console.log(`gen ${lan}.json to ${destDirName} success`);
        })
    }
})