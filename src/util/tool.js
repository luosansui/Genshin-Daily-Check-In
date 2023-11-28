const fs = require('fs')
const os = require('os')
const path = require('path')
module.exports = {
    o2c: obj=>{
        if(!obj)return ''
        return Object.entries(obj).map(item=>item.join('=')).join('; ')
    },
    c2o: str=>{
        try {
            if(!str)return {}
            return str.split(/;\s*/).reduce((pre,cur)=>{
                const [k,v] = cur.split('=')
                pre[k] = v
                return pre
            },{})
        } catch (error) {
            return {}
        }
    },
    log: (info)=>fs.appendFileSync('./log/sign.log', `${new Date().toLocaleString()} ${info}${os.EOL}`),
    mkLog: ()=>{
        const logPath = path.join(__dirname, '../log')
        fs.existsSync(logPath) || fs.mkdirSync(logPath,{ recursive: true })
    }
}
