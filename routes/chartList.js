/*图表组件集增删改查操作*/
const express = require('express')
const router = express.Router()
    // nodejs生成UID（唯一标识符）——node-uuid模块
const UUID = require('node-uuid')

const db = require('../utils/db')
    //模块图表配置数据获取--一级页面图表数据查询事件
router.post('/querySecondMasterPageConfigDataBegin', (req, res) => {
    let reqData = req.body

    db.query(
        'SELECT * FROM charts_list WHERE menuId=? AND (parentModuleId="" OR parentModuleId is null)', [reqData.menuId],
        function(data, fields) {
            res.send({
                code: 20000,
                success: '当前页面图表配置模块查询成功',
                data: data
            })
        }
    )
})

//一级页面新增事件
router.post('/insertSecondMasterPageConfigData', (req, res) => {
    let reqData = req.body.secondMasterPageConfigPOS[0]
        // console.log(reqData)
    let addSql = `insert into charts_list(moduleId,menuId,contentAreaConfig) values(?,?,?)`
    let sqlParams = [
            UUID.v1().replace(/-/g, ''),
            reqData.menuId,
            JSON.stringify(reqData.contentAreaConfig)
        ]
        // console.log(sqlParams)
    db.query(addSql, sqlParams, (data, fields) => {
        res.send({
            code: 20000,
            success: '模块添加成功',
            data: ''
        })
    })
})

//模块删除
router.post('/deleteSecondMasterPageConfigData', (req, res) => {
    let reqData = req.body
    console.log(reqData)
        //  第一步  查出当前菜单下所有模块
    db.query(
        'SELECT * FROM charts_list WHERE menuId=?', [reqData.menuId],
        function(data, fields) {
            // console.log(data)
            // 第二步  遍历循环找出所有需删除的模块id(当前模块以及当前模块所有子孙级)
            let moduleIdArr = [reqData.moduleId]
            const recutsion = moduleId => {
                data.forEach(item => {
                    if (item.parentModuleId && item.parentModuleId == moduleId) {
                        moduleIdArr.push(item.moduleId)
                        recutsion(item.moduleId)
                    }
                })
            }
            recutsion(reqData.moduleId)
                // 第三步 循环删除所有需删除模块
            moduleIdArr.forEach((moduleId, index) => {
                    let deleteSql = `DELETE FROM charts_list WHERE moduleId=?`
                    let params = [moduleId]
                    db.query(deleteSql, params, (data, fields) => {
                        if (index === moduleIdArr.length - 1) {
                            res.send({
                                code: 20000,
                                success: '模块删除成功',
                                data: ''
                            })
                        }
                    })
                })
                /**
                 * 第四步 如果该模块存在父级元素，找出其父级模块。
                 * 若为行下钻，找到父级模块并判断是否还有其他行下钻子模块，若没有，则修改isRowDrillDown=0
                 * 若为单元格下钻，也需判断当前单元格是否还有其他下钻子模块，若没有，则修改drillDownKeyAll值，删除其中的当前字段
                 * */
                //4-1获取父级模块集合
            let parentItem = {}
            data.forEach(item => {
                    if (
                        reqData.parentModuleId &&
                        item.moduleId === reqData.parentModuleId
                    ) {
                        parentItem = item
                    }
                })
                //若没有父级则终止以下操作
            if (!parentItem.moduleId) return false
                //4-2 判断父级模块为单元格下钻还是行下钻
            let settingForm = JSON.parse(parentItem.contentAreaConfig)
            console.log(settingForm.clickToShow)
            if (settingForm.clickToShow === 'row') {
                //4-2-1 行下钻 判断父级是否还有其他行下钻子级
                let rowOffon = false
                data.forEach(item => {
                        if (
                            item.parentModuleId === parentItem.moduleId &&
                            !item.drillDownKeyCurrent &&
                            item.moduleId != reqData.moduleId
                        ) {
                            rowOffon = true
                        }
                    })
                    //4-2-2 若只有当前下钻子级 则修改isRowDrillDown为0
                if (!rowOffon) {
                    db.query(
                        `UPDATE charts_list SET isRowDrillDown=? WHERE moduleId=?`, [null, parentItem.moduleId],
                        (data, fields) => {
                            console.log('行下钻模块删除后父级菜单修改成功')
                        }
                    )
                }
            } else {
                //4-3-1 单元格下钻 判断父级是否还有其他行下钻子级
                let cellOffon = false
                let drillDownKeyCurrent = ''
                data.forEach(item => {
                    if (item.moduleId === reqData.moduleId) {
                        drillDownKeyCurrent = item.drillDownKeyCurrent
                    }
                })
                data.forEach(item => {
                        // console.log(item.drillDownKeyCurrent, reqData.drillDownKeyCurrent)
                        if (
                            item.parentModuleId === parentItem.moduleId &&
                            item.drillDownKeyCurrent === drillDownKeyCurrent &&
                            item.moduleId != reqData.moduleId
                        ) {
                            cellOffon = true
                        }
                    })
                    //4-3-2 若只有当前下钻子级 则修改父级drillDownKeyAll属性，删除当前字段名
                if (!cellOffon) {
                    let drillDownKeyAll = parentItem.drillDownKeyAll ?
                        JSON.parse(parentItem.drillDownKeyAll) : []
                    if (drillDownKeyAll.length > 1) {
                        let index = drillDownKeyAll.indexOf(drillDownKeyCurrent)
                        drillDownKeyAll.splice(index, 1)
                    } else {
                        drillDownKeyAll = []
                    }
                    // console.log(drillDownKeyAll)
                    let drillDownKeyAlls =
                        drillDownKeyAll.length > 0 ? JSON.stringify(drillDownKeyAll) : null
                    let updateSqlParams = [drillDownKeyAlls, parentItem.moduleId]
                    db.query(
                        `UPDATE charts_list SET drillDownKeyAll=? WHERE moduleId=?`,
                        updateSqlParams,
                        (data, fields) => {
                            console.log('单元格下钻模块删除后父级菜单修改成功')
                        }
                    )
                }
            }
            // console.log(parentItem)
        }
    )
})

//模块配置修改事件
router.post('/updateSecondMasterPageConfigData', (req, res) => {
    let reqData = req.body.secondMasterPageConfigPOS[0]
        //1 模块配置修改
    if (reqData.contentAreaConfig) {
        let updateSql = `UPDATE charts_list SET contentAreaConfig=? WHERE moduleId=?`
        let updateSqlParams = [
            JSON.stringify(reqData.contentAreaConfig),
            reqData.moduleId
        ]
        db.query(updateSql, updateSqlParams, (data, fields) => {
            res.send({
                code: 20000,
                success: '模块配置修改成功',
                data: ''
            })
        })
    } else if (reqData.conditionAreaConfig) {
        //2 筛选配置数据修改
        let sql = `UPDATE charts_list SET conditionAreaConfig=? WHERE moduleId=?`
        let params = [JSON.stringify(reqData.conditionAreaConfig), reqData.moduleId]
        db.query(sql, params, function(data, fields) {
            res.send({
                code: 20000,
                success: '筛选数据保存成功',
                data: data
            })
        })
    }
})

//二级页面新增事件
router.post('/insertDrillDownData', (req, res) => {
    let reqData = req.body
        //1、查出当前模块的父级元素
    db.query(
        'SELECT * FROM charts_list WHERE moduleId=?', [reqData.parentModuleId],
        function(data, fields) {
            let parentsItem = data[0]
                // console.log(parentsItem)
                //2、判断新增子页面未行下钻还是单元格下钻 修改父级模块对应的drillDownKeyCurrent或isRowDrillDown的值
            let parentUpdateSql, parentUpdateparams
                //2-1两种情况sql处理
            if (reqData.drillDownKeyCurrent) {
                //单元格下钻
                let parentsDrillDownKeyAll = parentsItem.drillDownKeyAll ?
                    JSON.parse(parentsItem.drillDownKeyAll) : []
                if (
                    parentsDrillDownKeyAll.indexOf(reqData.drillDownKeyCurrent) === -1
                ) {
                    parentsDrillDownKeyAll.push(reqData.drillDownKeyCurrent)
                }
                parentUpdateSql = `UPDATE charts_list SET drillDownKeyAll=? WHERE moduleId=?`
                parentUpdateparams = [
                    JSON.stringify(parentsDrillDownKeyAll),
                    parentsItem.moduleId
                ]
            } else {
                //行下钻
                ;
                (parentUpdateSql = `UPDATE charts_list SET isRowDrillDown=? WHERE moduleId=?`),
                (parentUpdateparams = ['1', parentsItem.moduleId])
            }
            //2-2父级菜单修改完成
            db.query(parentUpdateSql, parentUpdateparams, (data, fields) => {
                console.log('新增下钻模块后父级菜单修改成功')
                    //3 新增下钻子级模块
                let addSql = `insert into charts_list(moduleId,menuId,contentAreaConfig,parentModuleId,drillDownKeyCurrent) values(?,?,?,?,?)`
                let sqlParams = [
                    UUID.v1().replace(/-/g, ''),
                    reqData.menuId,
                    JSON.stringify(reqData.contentAreaConfig),
                    reqData.parentModuleId,
                    reqData.drillDownKeyCurrent ? reqData.drillDownKeyCurrent : null
                ]
                db.query(addSql, sqlParams, (data, fields) => {
                    res.send({
                        code: 20000,
                        success: '模块添加成功',
                        data: ''
                    })
                })
            })
        }
    )
})

//子页面数据查询
router.post('/queryDrillDownData', (req, res) => {
    let reqData = req.body
    let sql, params
        //判断为行下钻还是单元格下钻
    if (reqData.drillDownKeyCurrent) {
        sql =
            'SELECT * FROM charts_list WHERE parentModuleId=? AND drillDownKeyCurrent=?'
        params = [reqData.parentModuleId, reqData.drillDownKeyCurrent]
    } else {
        sql =
            'SELECT * FROM charts_list WHERE parentModuleId=? AND drillDownKeyCurrent IS null'
        params = [reqData.parentModuleId]
    }
    // console.log(sql, params)
    db.query(sql, params, function(data, fields) {
        res.send({
            code: 20000,
            success: '子页面数据查询成功',
            data: data
        })
    })
})

//详情配置
router.post('/insertDetailsAreaConfig', (req, res) => {
    let reqData = req.body
    let sql = `UPDATE charts_list SET detailsAreaConfig=? WHERE moduleId=?`
    let params = [JSON.stringify(reqData.detailsAreaConfig), reqData.moduleId]
    db.query(sql, params, function(data, fields) {
        res.send({
            code: 20000,
            success: '详情配置数据保存成功',
            data: data
        })
    })
})

//筛选数据保存
// router.post('/updateSecondMasterPageConfigData', (req, res) => {
//   let reqData = req.body.secondMasterPageConfigPOS[0]
//   let sql = `UPDATE charts_list SET conditionAreaConfig=? WHERE moduleId=?`
//   let params = [JSON.stringify(reqData.conditionAreaConfig), reqData.moduleId]
//   db.query(sql, params, function(data, fields) {
//     res.send({
//       code: 20000,
//       success: '筛选数据保存成功',
//       data: data
//     })
//   })
// })

module.exports = router