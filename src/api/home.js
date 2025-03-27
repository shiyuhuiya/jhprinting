import request from '@/utils/request'
export const getDetail = () => {
  return request.get('/page/detail', { params: { pageId: 0 } })
}
// export default {
//   name:'tom'
// }
