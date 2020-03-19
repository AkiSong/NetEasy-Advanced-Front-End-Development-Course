const axios = require('axios')
const {baseURL} = require('../config/config.default.js')
var instance = axios.create({
  baseURL,
  timeout: 1000,
});

module.exports = instance
