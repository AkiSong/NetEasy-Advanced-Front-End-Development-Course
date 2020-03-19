const request  = require('../utils/request.js')

exports.findUserName =  async(username) => {
  const {data} = await request({
    url: '/users',
    method: 'GET',
    params: {
      username
    }
  })
  return data[0]
}

exports.findNickName = async(nickname) => {
  const {data} = await request({
    url: '/users',
    method: 'GET',
    params: {
      nickname
    }
  })
  return data[0]
}

exports.createUser = async(req) => {
  const {username, nickname, password} = req
  const {data} = await request({
    url: '/users',
    method: 'POST',
    data:{
      username,
      nickname,
      password
    }
  })
  return data
}