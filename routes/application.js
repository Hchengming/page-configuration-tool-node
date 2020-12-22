// 应用接口测试数据
const express = require('express')
const router = express.Router()
    // nodejs生成UID（唯一标识符）——node-uuid模块
const UUID = require('node-uuid')
const application = require('../json/application.json')
router.post('/insert', (req, res) => {
    let reqData = req.body
        // console.log('123')
    res.send({
        code: 20000,
        success: '数据查询成功',
        data: application
    })
})

module.exports = router