const axios = require("axios");
const CronJob = require("cron").CronJob;
const tool = require("./util/tool");
const { origin, url, cookie, act_id } = require("./config/config.json");
const cookieObj = tool.c2o(cookie);
const headers = {
  cookie,
  origin,
  referer: `${origin}/`,
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
};
//发送请求
const signIn = () => 
  axios({
    method: "post",
    headers,
    url: `${url}?lang=${cookieObj.mi18nLang ?? 'zh-cn'}`,
    data: { act_id },
  });
  
//签到功能
const checkIn = async (count = 0) => {
  try {
    //随机延迟若干秒
    await new Promise((res) =>
      setTimeout(() => res(), Math.ceil(Math.random() * 5) * 1000)
    );
    //开始签到
    const {
      data: { message },
    } = await signIn();
    if (message === "OK") tool.log("签到成功");
    else tool.log(message);
  } catch (error) {
    if (count >= 5) {
      tool.log(`${count}次重试后仍签到失败,已停止今日签到任务`);
      return;
    }
    tool.log(`出现错误: ${error.message}, 30秒后开始第${count + 1}次重试`);
    await new Promise((res) => setTimeout(() => res(), 30000));
    checkIn(count + 1);
  }
};
//定时签到
const job = new CronJob("30 0 0 * * *", checkIn);
//创建日志目录
tool.mkLog();
//开始作业
job.start();