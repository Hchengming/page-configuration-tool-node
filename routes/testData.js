/*图表组件集增删改查操作*/
const express = require('express')
const router = express.Router()
// nodejs生成UID（唯一标识符）——node-uuid模块
const textDataObj = require('../json/data.json')

//不带分页图表数据1--开发区分类统计
router.post('/getKfqfltjData', (req, res) => {
  let data = [
    {
      title: '国家级',
      gs: 13,
      mj: 23456.16,
      jk:2334.51
    },
    {
      title: '省级',
      gs: 87,
      mj: 23456.16,
      jk:1234.45
    },
    {
      title: '产业融合型',
      gs: 36,
      mj: 23456.16,
      jk:7896.03
    },
    {
      title: '工业主导型',
      gs: 64,
      mj: 23456.16,
      jk:1238.89
    }
  ]
  res.send({
    code: 20000,
    success: '数据查询成功',
    data: data
  })
})

//不带分页图表数据2--各区县开发面积统计
router.post('/getKfqydqkDataByKfqflqk', (req, res) => {
  res.send({
    code: 20000,
    success: '数据查询成功',
    data: textDataObj['getKfqydqkDataByKfqflqk']
  })
})

//顶部栏测试数据1
router.post('/topBar1', (req, res) => {
  res.send({
    code: 20000,
    success: '数据查询成功',
    data: textDataObj['topBar1']
  })
})

//顶部栏测试数据2
router.post('/topBar2', (req, res) => {
  res.send({
    code: 20000,
    success: '数据查询成功',
    data: textDataObj['topBar2']
  })
})

//分页测试数据
router.post('/page1', (req, res) => {
  res.send({
    code: 20000,
    success: '数据查询成功',
    data: {
      list: textDataObj['page1'],
      total: 20
    }
  })
})

//详情表格展示数据
router.post('/details', (req, res) => {
  res.send({
    code: 20000,
    success: '数据查询成功',
    data: textDataObj['details']
  })
})

module.exports = router
