//菜单数据递归遍历重组
const menuRecursion = function(data) {
  let menuData = []
  let finrMenuArr = [] //所有子级菜单
  data.forEach(items => {
    if (items.parentMenuId && items.parentMenuId.replace(/\s*/g, '')) {
      items.children = []
      finrMenuArr.push(items)
    } else {
      items.children = []
      menuData.push(items)
    }
  })

  const recutsion = itemData => {
    //递归遍历整理树形菜单数据
    itemData.forEach(items => {
      finrMenuArr.forEach(item => {
        if (items.menuId === item.parentMenuId) {
          item.children = []
          items.children.push(item)
        }
      })
    })
    itemData.forEach(items => {
      if (items.children.length > 0) {
        recutsion(items.children)
      }
    })
  }

  recutsion(menuData)
  return menuData
}

module.exports = { menuRecursion: menuRecursion }
