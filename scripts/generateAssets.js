const fs = require('fs')
const path = require('path').resolve(__dirname, '..')

const defaultConfig = {
    defaultConfig: { 
        gamePath: "", 
        modsPath: "", 
        executeable: "",
    } 
}

module.exports = { 
    generateAssets: async (forgeConfig, platform, arch) => {
        console.log('generateAssets')
        if(!fs.existsSync(`${path}/config.json`)) {
            fs.writeFileSync(`${path}/config.json`, JSON.stringify(defaultConfig))
        }
    }, 
    
}