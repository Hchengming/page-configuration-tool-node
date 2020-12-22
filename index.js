const express = require('express')
const app = express()
const fs = require('fs')

const bodyParser = require('body-parser') //加载body-parser数据处理模块
app.use(bodyParser.json()) //设置中间件的请求数据格式
app.use(bodyParser.urlencoded({ extended: true })) //设置编码格式扩展

//设置跨域请求头
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
    )
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})

// 加载中间件     express.static(静态文件夹)
// app.use(express.static('public'))

app.listen(4000, (req, res) => {
    console.log('服务器已启动')
})

//初始页面图表数据操作
const chartList = require('./routes/chartList')
app.use('/busSecondmasterpageconfig', chartList)

//菜单操作
const menu = require('./routes/menu')
app.use('/menu', menu)

//顶部栏操作
const topBar = require('./routes/topBar')
app.use('/busElementConfig', topBar)

//应用接口
const application = require('./routes/application')
app.use('/application', application)

//数据视图接口
const dataView = require('./routes/dataView')
app.use('/dataView', dataView)

//测试数据接口
const testData = require('./routes/testData')
app.use('/testData', testData)

//菜单配置接口
const busMenuSetting = require('./routes/menuSetting')
app.use('/busMenuSetting', busMenuSetting)

//项目主题配置接口
const busThemeConfig = require('./routes/theme')
app.use('/busThemeConfig', busThemeConfig)

//模块交互
const jhConfig = require('./routes/interactive')
app.use('/jhConfig', jhConfig)