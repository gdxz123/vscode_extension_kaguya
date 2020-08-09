const vscode = require('vscode')
const meakeupService = require("./service.js")
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('kaguya.start', function () {
		meakeupService()
	})

	context.subscriptions.push(disposable)
}
exports.activate = activate
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
