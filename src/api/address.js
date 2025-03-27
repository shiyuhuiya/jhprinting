import request from '@/utils/request'

// 获取地址列表
export const getAddressList = () => {
  return request.get('/address/list')
}
//默认添加一个
//获取地址id信息
export const getProvince = () => {
  return request.get("/region/tree")
}
export const addAddress = (name, phone, province, city, region, detail) => {
  return request.post('/address/add', {
    "form": {
      "name": name,
      "phone": phone,
      "region": [
        {
          "value": province,
          "label": "上海"
        },
        {
          "value": city,
          "label": "上海市"
        },
        {
          "value": region,
          "label": "徐汇区"
        }
      ],
      "detail": detail
    }
  })
}
//删除收货地址
export const delAddress = (id) => {
  return request.post('/address/remove', {
    "addressId": id
  })
}
export const editAddress = (addressId, name, phone, province, city, region, detail) => {
  return request.post('/address/edit', {
    addressId,
    "form": {
      "name": name,
      "phone": phone,
      "region": [
        {
          "value": province,
          "label": "上海"
        },
        {
          "value": city,
          "label": "上海市"
        },
        {
          "value": region,
          "label": "徐汇区"
        }
      ],
      "detail": detail
    }
  })
}