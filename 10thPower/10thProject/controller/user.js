const User = require('../service/user')

exports.check = async (req,res,next) => {
  const {username, nickname } = req.query
  if(username){
    const user = await User.findUserName(username)
    if(user) res.status(200).send(false)
    else res.status(200).send(true)
  }else if(nickname){
    const user = await User.findNickName(nickname)
    if(user) res.status(200).send(false)
    else res.status(200).send(true)
  }
}