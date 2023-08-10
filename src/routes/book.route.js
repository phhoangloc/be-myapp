const express = require("express")
const app = express()
const viewController = require("../controller/get.controller")
app.get('/', viewController.viewBook)

module.exports = app