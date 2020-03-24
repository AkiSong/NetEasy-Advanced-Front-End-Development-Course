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
  const { captcha } = req.session
  // 验证码校验
  if(+new Date() > captcha.expires){
    return res.status(200).json({
      code: 4,
      message: '验证码过期'
    })
  }
  console.log(verify_code);
  if( verify_code.toLowerCase() !== captcha.text.toLowerCase()){
    return res.status(200).json({
      code: 1,
      message: '验证码错误'
    })
  }
  // 校验用户名是否被占用
  if(await User.findUserName(username)){
    return res.status(200).json({
      code: 2,
      message: '用户名已存在'
    })
  }
  // 检验昵称
  if(await User.findNickName(nickname)){
    return res.status(200).json({
      code: 3,
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
    req.session.captcha = {
      text: captcha.text,
      expiress: +new Date() + 15000
    };
    res.type('svg');
    res.status(200).send(captcha.data);
}

exports.captchaCheck = (req, res, next) => {
  const {verify_code} = req.query;
  const {captcha } = req.session;
  console.log(req.session);
  console.log(captcha);
  if( verify_code.toLowerCase() !== captcha.text.toLowerCase()) res.status(200).send(true)
  else res.status(200).send(false)
  if(+new Date() > captcha.expires) res.status(200).send(true)
  else res.status(200).send(false)
}