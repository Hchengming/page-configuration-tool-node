const express = require('express')
const router = express.Router()
// nodejs生成UID（唯一标识符）——node-uuid模块
const UUID = require('node-uuid')

const db = require('../utils/db')

//顶部栏模块新增
router.post('/insertElementData', (req, res) => {
  let reqData = req.body

  if (!reqData.moduleId) {
    res.send({
      code: 40001,
      msg: '模块id为空',
      data: ''
    })
    return false
  }
  // console.log(reqData)
  let addSql = `INSERT INTO top_bar(moduleId,elementConfigs) VALUES(?,?)`
  let addSqlParams = [reqData.moduleId, JSON.stringify(reqData.elementConfig)]
  db.query(addSql, addSqlParams, (data, fields) => {
    res.send({
      code: 20000,
      success: '顶部栏添加成功',
      data: ''
    })
  })
})
//顶部栏模块修改
router.post('/updateElementData', (req, res) => {
  let reqData = req.body
  if (!reqData.moduleId) {
    res.send({
      code: 40001,
      msg: '模块id为空',
      data: ''
    })
    return false
  }
  let updateSql = `UPDATE top_bar SET elementConfigs=? WHERE moduleId=?`

  let updateSqlParams = [
    JSON.stringify(reqData.elementConfig),
    reqData.moduleId
  ]
  db.query(updateSql, updateSqlParams, (data, fields) => {
    res.send({
      code: 20000,
      success: '顶部栏修改成功',
      data: ''
    })
  })
})
//顶部栏模块删除
router.post('/deleteElemeteById', (req, res) => {
  let reqData = req.body
  let deleteSql = `DELETE FROM top_bar WHERE moduleId=?`
  let params = [reqData.moduleId]
  db.query(deleteSql, params, (data, fields) => {
    res.send({
      code: 20000,
      success: '顶部栏删除成功',
      data: ''
    })
  })
})
//顶部栏模块查询
router.post('/getElementDataByModuleId', (req, res) => {
  let reqData = req.body
  db.query(
    'SELECT * FROM top_bar WHERE moduleId=?',
    [reqData.moduleId],
    function(data, fields) {
      res.send({
        code: 20000,
        success: '顶部栏查询成功',
        data: data
      })
    }
  )
})
module.exports = router
