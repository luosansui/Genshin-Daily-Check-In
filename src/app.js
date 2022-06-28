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
//发送请求
const signIn = () => axios({
    method: 'post',
    headers,
    url:`${url}?lang=${cookie.mi18nLang}`,
    data: { act_id }
})
//签到功能
const checkIn = async (count = 0) => {
    try {
        const { data:{ message } } = await signIn()
        if(message === 'OK')tool.log('签到成功')
        else tool.log(message)
    } catch (error) {
        if(count >= 5){
            tool.log(`${count}次重试后仍签到失败,已停止今日签到任务`)
            return
        }
        tool.log(`出现错误: ${error.message}, 30秒后开始第${count + 1}次重试`)
        await new Promise(res => setTimeout(() => res(),30000))
        checkIn(count + 1)
    }
}
//定时签到
const job = new CronJob(`${Math.floor(Math.random() * 59)} 0 0 * * *`,checkIn)
//创建日志目录
tool.mkLog()
//开始作业
job.start()
