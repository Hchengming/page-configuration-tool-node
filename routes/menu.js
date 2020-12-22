const express = require('express')
const router = express.Router()
    // nodejs生成UID（唯一标识符）——node-uuid模块
const UUID = require('node-uuid')

const db = require('../utils/db')
const common = require('../utils/common')

//菜单数据查询事件
router.post('/insertMenu', (req, res) => {
    let reqData = req.body
        // console.log(reqData)
    db.query('SELECT * FROM menu_list where answerId=?', [reqData.answerId], function(data, fields) {
        // console.log(JSON.stringify(common.menuRecursion(data)))
        res.send({
            code: 20000,
            success: '菜单查询成功',
            data: common.menuRecursion(data)
        })
    })
})

//菜单新增事件
router.post('/addMenu', (req, res) => {
    let reqData = req.body
    if (!reqData.menuName || !reqData.menuCode) {
        res.send({
            code: 40001,
            msg: '菜单名称、编码不能为空',
            data: ''
        })
        return false
    }
    let addSql = `INSERT INTO menu_list(menuName,menuCode,menuIcon,menuId,parentMenuId,answerId) VALUES(?,?,?,?,?,?)`

    let addSqlParams = [
        reqData.menuName,
        reqData.menuCode,
        reqData.menuIcon ? reqData.menuIcon : '',
        UUID.v1().replace(/-/g, ''),
        reqData.menuId ? reqData.menuId : '',
        reqData.answerId
    ]
    db.query(addSql, addSqlParams, (data, fields) => {
        res.send({
            code: 20000,
            success: '菜单添加成功',
            data: ''
        })
    })
})

//菜单修改事件
router.post('/updateMenu', (req, res) => {
    let reqData = req.body
    let updateSql = `UPDATE menu_list SET menuName=?,menuCode=?,menuIcon=? WHERE menuId=?`

    let updateSqlParams = [
        reqData.menuName,
        reqData.menuCode,
        reqData.menuIcon ? reqData.menuIcon : '',
        reqData.menuId
    ]
    db.query(updateSql, updateSqlParams, (data, fields) => {
        res.send({
            code: 20000,
            success: '菜单修改成功',
            data: ''
        })
    })
})

//菜单删除事件
router.post('/deleteMenu', (req, res) => {
    let reqData = req.body
    let deleteSql = `DELETE FROM menu_list WHERE menuId=?`
    let params = [reqData.menuId]
    db.query(deleteSql, params, (data, fields) => {
        res.send({
            code: 20000,
            success: '菜单删除成功',
            data: ''
        })
    })
})
module.exports = router