const User = require('../service/user.js')
var svgCaptcha = require('svg-captcha');

exports.showIndex = async (req, res, next) => {
  res.render('index.html')
}

exports.showLogin = async (req, res, next) => {
  res.render('signin.html')
}

exports.signup = async (req, res, next) => {
  // 获取表单数据
  const {username, password, nickname, verify_code} = req.body;
  // 校验用户名是否被占用
  if(await User.findUserName(username)){
    return res.status(200).json({
      code: 1,
      message: '用户名已存在'
    })
  }
  // 检验昵称
  if(await User.findNickName(nickname)){
    return res.status(200).json({
      code: 2,
      message: '昵称已存在'
    })
  }
  // 创建用户
  if(await User.createUser(req.body)._id){
    return res.status(200).json({
      code: 0,
      message: '注册成功'
    })
  }
}

exports.captcha = (req, res, next) => {
   var captcha = svgCaptcha.create();
    // req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
}