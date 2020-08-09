const network = require("net")

function tryToListen(host, port) {
    return new Promise((resolve, reject) => {
        var server = network.createServer()
        server.listen(port, host)
        server.on("listening", () => {
            server.close()
            resolve()
        })
        server.on("error", (error) => {
            server.close()
            reject(error)
        })
    })
}

async function checkAvalable(port) {
    try {
        await tryToListen("0.0.0.0", port)
        await tryToListen("127.0.0.1", port)
        await tryToListen("localhost", port)
    } catch(e) {
        return false
    }
    return true
}

module.exports = async function(port) {
    for (let i = 0; i < 5; i++) {
        let avalable = await checkAvalable(port)
        if (!avalable) {
            // 新增随机端口
            port += Math.ceil(Math.random() * 5)
        } else {
            return port
        }
    }
    return -1
}