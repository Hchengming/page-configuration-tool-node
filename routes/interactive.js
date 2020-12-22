const express = require('express')
const router = express.Router()
    // nodejs生成UID（唯一标识符）——node-uuid模块
const UUID = require('node-uuid')

const db = require('../utils/db')

// 主题配置查询事件
router.post('/selectJhConfig', (req, res) => {
        let reqData = req.body
        db.query(
            'SELECT * FROM interactive_setting where moduleId=?', [reqData.moduleId],
            function(data, fields) {
                // console.log(reqData)
                data = data ? data[0] : null
                res.send({
                    code: 20000,
                    success: '当前模块交互配置数据查询成功',
                    data: data,
                })
            }
        )
    })
    //项目主题编辑事件
router.post('/updateJhConfig', (req, res) => {
    let reqData = req.body
    db.query(
        'SELECT * FROM interactive_setting where moduleId=?', [reqData.moduleId],
        function(data, fields) {
            console.log(reqData)
            let sql, params
            reqData.interactiveData = JSON.stringify(reqData.interactiveData)
            if (data.length == 0) {
                sql = `INSERT INTO interactive_setting(moduleId,interactiveData) VALUES(?,?)`
                params = [reqData.moduleId, reqData.interactiveData]
            } else {
                sql = `update interactive_setting set interactiveData=? where moduleId=?`
                params = [reqData.interactiveData, reqData.moduleId]
            }
            db.query(sql, params, (data, fields) => {
                res.send({
                    code: 20000,
                    success: '当前模块交互配置数据编辑成功',
                    data: '',
                })
            })
        }
    )
})
module.exports = router