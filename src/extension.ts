import * as vscode from 'vscode';
import OOC from './lib/ooc';

const { commands, window } = vscode

export function activate(context: vscode.ExtensionContext) {
	const disposableList: vscode.Disposable[] = []

	// generate
	disposableList.push(commands.registerCommand('obsolete-ooc.generate', () => {
		try {
			const text = window.activeTextEditor?.document.getText() || ''
			const result = OOC(text)
			vscode.env.clipboard.writeText(result).then(() => {
				window.setStatusBarMessage('指令生成成功')
				const timer = setTimeout(() => {
					window.setStatusBarMessage('')
					clearTimeout(timer)
				}, 3000)
			})
        } catch (error) {
			window.setStatusBarMessage(error.message)
        }
	}));

	context.subscriptions.push(...disposableList);
}

// this method is called when your extension is deactivated
export function deactivate() {}
