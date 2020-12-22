const express = require('express')
const router = express.Router()
    // nodejs生成UID（唯一标识符）——node-uuid模块
const UUID = require('node-uuid')

const db = require('../utils/db')

// 主题配置查询事件
router.post('/selectProjectConfig', (req, res) => {
        let reqData = req.body
        db.query(
            'SELECT * FROM project_config where projectId=?', [reqData.projectId],
            function(data, fields) {
                // console.log(reqData)
                res.send({
                    code: 20000,
                    success: '项目主题查询成功',
                    data: data[0],
                })
            }
        )
    })
    //项目主题编辑事件
router.post('/insertProjectConfigData', (req, res) => {
    let reqData = req.body
    db.query(
        'SELECT * FROM project_config where projectId=?', [reqData.projectId],
        function(data, fields) {
            // console.log(data)
            let sql, params
            reqData.projectConfig = JSON.stringify(reqData.projectConfig)
            if (data.length == 0) {
                sql = `INSERT INTO project_config(projectId,projectConfigs) VALUES(?,?)`
                params = [reqData.projectId, reqData.projectConfig]
            } else {
                sql = `update project_config set projectConfigs=? where projectId=?`
                params = [reqData.projectConfig, reqData.projectId]
            }
            db.query(sql, params, (data, fields) => {
                res.send({
                    code: 20000,
                    success: '主题编辑成功',
                    data: '',
                })
            })
        }
    )
})
module.exports = router