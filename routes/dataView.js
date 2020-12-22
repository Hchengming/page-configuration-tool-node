// 数据视图请求接口模拟
// 应用接口测试数据
const express = require('express')
const router = express.Router()

const dataMore = require('../json/data.json')

let viewList = [{
        id: '001',
        viewCode: '重庆区县开发区面积统计',
    },
    {
        id: '002',
        viewCode: '小区户主信息统计',
    },
]
let paramsList = [{
        viewId: '001',
        data: [
            { paramCode: "qxmj", paramName: "开发面积" },
            { paramCode: "qxmc", paramName: "区县名称" },
        ]
    },
    {
        viewId: '002',
        data: [
            { paramCode: "xm", paramName: "姓名" },
            { paramCode: "nl", paramName: "年龄" },
        ]
    },
]
let viewData = [{
            viewId: '001',
            data: {
                list: dataMore.getKfqydqkDataByKfqflqk,
                total: dataMore.getKfqydqkDataByKfqflqk.length,
            },
        },
        {
            viewId: '002',
            data: {
                list: dataMore.page1,
                total: dataMore.page1.length,
            },
        },
    ]
    // 1、获取视图列表
router.get('/viewList', (req, res) => {
    let reqData = req.query
    console.log(reqData)
    res.send({
        code: 20000,
        success: '视图列表查询成功',
        data: {
            total: 2,
            records: viewList,
        },
    })
})

//2、获取视图参数
router.get('/paramlist', (req, res) => {
    let reqData = req.query
    console.log(reqData)
    let resData = null
    paramsList.forEach((item) => {
        if (reqData.viewId === item.viewId) {
            resData = item.data
        }
    })
    res.send({
        code: 20000,
        success: '视图参数获取成功',
        data: resData,
    })
})

//3、数据获取
router.post('/searchResult', (req, res) => {
    let reqData = req.body
    let resData = null
    viewData.forEach((item) => {
        if (reqData.viewId === item.viewId) {
            resData = item.data
        }
    })
    res.send({
        code: 20000,
        success: '视图参数获取成功',
        data: resData,
    })
})
module.exports = router