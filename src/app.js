const axios = require('axios')
const fs = require('fs')
const path = require('path')
const CronJob = require('cron').CronJob
const tool = require('./util/tool')
const { origin,url,cookie,act_id } = JSON.parse(fs.readFileSync(path.join(__dirname, './config/config.json'), {encoding: 'utf-8'}))
const headers = {
    'cookie': tool.o2c(cookie),
    'origin': origin,
    'referer': `${origin}/`,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
}
//创建日志目录
tool.mkLog()
//签到功能
const signIn = ()=> axios({
    method: 'post',
    headers,
    url:`${url}?lang=${cookie.mi18nLang}`,
    data: { act_id }
})
//定时签到
const job = new CronJob(
	'30 0 0 * * *',
	async function() {
        try {
            const { data:{ message } } = await signIn()
            if(message === 'OK')tool.log('签到成功')
            else tool.log(message)
        } catch (error) {
            tool.log(error.message)
        }
	}
)
//开始作业
job.start()