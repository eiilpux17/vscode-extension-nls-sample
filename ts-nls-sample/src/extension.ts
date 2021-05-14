import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

const localize = nls.config({
	bundleFormat: nls.BundleFormat.standalone,
	messageFormat: nls.MessageFormat.both
})();

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		const message = require("./hello/message")

		let text = localize('nlssample.hello', 'Hello!')
		text += ' ' + message.getMessage();
		text += ' ' + localize('nlssample.time', 'Time: {0}!', Date.now());
		vscode.window.showInformationMessage(text);
	});
	context.subscriptions.push(disposable);
}
