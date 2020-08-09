const vscode = require('vscode')
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const fileManager=require("fs")
const open = require("open")
const checkPort = require("./checkPort.js")

var defaultPage = "/index.html"
var contentHistory = ""
const webApp = express()

function checkText() {
    vscode.workspace.onDidChangeTextDocument(event => {
        event.contentChanges.forEach(change => {
            if (change.text.length > 30) {
                // if the change of content is too large, ignore them
                return
            }
            contentHistory += change.text
            if (contentHistory.replace(/\s/g, "").length > 100) {
                contentHistory = contentHistory.slice(contentHistory.length - 100)
            }
        })
    })
}

/*
 * @result result boolean
 */
module.exports = async function() {
    var port = await checkPort(7777)
    if (port > 0) {
        webApp.use(bodyParser.json())
        webApp.use(bodyParser.urlencoded({ extended: false }))
        webApp.use(bodyParser.text())
        webApp.use(bodyParser.raw())

        webApp.get('/favicon.ico', function(req, res) {
            res.sendFile( __dirname + "/html/favicon.ico" )
        })
        webApp.get('/video/idle2.mp4', function(req, res) {
            res.sendFile( __dirname + "/html/video/idle2.mp4" )
        })
        webApp.get('/video/say2.mp4', function(req, res) {
            res.sendFile( __dirname + "/html/video/say2.mp4" )
        })
        webApp.get('/video/sayCons.mp4', function(req, res) {
            res.sendFile( __dirname + "/html/video/sayCons.mp4" )
        })
        webApp.get(defaultPage, function (req, res) {
            var dataSync  = fileManager.readFileSync(__dirname + "/html/index.html", "utf8")
            dataSync = dataSync.replace(/listenPort='7777'/g,  'listenPort="'+ port +'"')
            res.end(dataSync)
        })
        webApp.get("/getContent", (req, res) => {
            let stringCopy = (' ' + contentHistory).slice(1)
            contentHistory = ""
            var jsonData = {
                "changeTxt": stringCopy,
                "allTxt": vscode.window.activeTextEditor.document.getText()
            }
            res.end(JSON.stringify(jsonData))
        })

        var server = webApp.listen(port, function () {
            open(`http://127.0.0.1:${port}` + defaultPage)
        })
    } else {
        vscode.window.showErrorMessage("do not find available service port, please try again")
        return false
    }
    checkText()
    return true
}