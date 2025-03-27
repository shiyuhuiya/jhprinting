//把持久化操作封装成函数，因为这部分代码确实太长，万物可封装
//按需导出一些函数
const INFO_KEY = 'heima-shopping-info'
export const getInfo = () => {
  const defaultInfo = { token: '', userId: '' }
  const info = localStorage.getItem(INFO_KEY)
  if(info!==null){
    return JSON.parse(info)
  }
  return defaultInfo
}
export const setUserInfo = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

const HISTORY_KEY = 'history'
export const getHistory = () => {
  const res = localStorage.getItem(HISTORY_KEY)
  return res ? JSON.parse(res) : []
}
export const setHistory = (list) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
}
export const removeHistory = () => {
  localStorage.removeItem(HISTORY_KEY)
}