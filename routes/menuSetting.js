// 菜单配置
const express = require('express')
const router = express.Router()

const db = require('../utils/db')

//菜单配置数据新增事件
router.post('/insertMenuSettingData', (req, res) => {
  let reqData = req.body
  let addSql = `insert into menu_setting(menuId,jsjbxx,menuMap) values(?,?,?)`
  let sqlParams = [
    reqData.menuId,
    reqData.jsjbxx,
    reqData.menuMap ? JSON.stringify(reqData.menuMap) : ''
  ]
  db.query(addSql, sqlParams, (data, fields) => {
    res.send({
      code: 20000,
      success: '菜单配置添加成功',
      data: ''
    })
  })
})
//菜单修改事件
router.post('/updateMenuSettingData', (req, res) => {
  let reqData = req.body
  let addSql = `UPDATE menu_setting SET jsjbxx=?,menuMap=? WHERE menuId=?`
  let sqlParams = [
    reqData.jsjbxx,
    reqData.menuMap ? JSON.stringify(reqData.menuMap) : '{}',
    reqData.menuId
  ]
  db.query(addSql, sqlParams, (data, fields) => {
    res.send({
      code: 20000,
      success: '菜单配置修改成功',
      data: ''
    })
  })
})
//

//菜单查询事件
router.post('/getMenuSettingDataByModuleId', (req, res) => {
  let reqData = req.body
  let addSql = `SELECT * FROM menu_setting WHERE menuId=?`
  let sqlParams = [reqData.menuId]
  db.query(addSql, sqlParams, (data, fields) => {
    res.send({
      code: 20000,
      success: '菜单配置查询成功',
      data: data[0]
    })
  })
})

module.exports = router
