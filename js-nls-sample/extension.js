const vscode = require('vscode');
const nls = require('vscode-nls');

const localize = nls.config({
	locale:"zh-cn",
	bundleFormat: nls.BundleFormat.standalone,
	messageFormat: nls.MessageFormat.both
})();

function activate(context) {

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		const message = require("./hello/message")

		let text = localize('nlssample.hello', 'Hello!')
		text += ' ' + message.getMessage();
		text += ' ' + localize('nlssample.time', 'Time: {0}!', Date.now());

		vscode.window.showInformationMessage(text);
	});
	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
