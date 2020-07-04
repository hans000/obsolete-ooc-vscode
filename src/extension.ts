import  * as vscode from 'vscode';
import OOC, { IConfig } from './lib/ooc';
import logicProvider from './lib/ooc/provider/logic';

import { commands, window, Position, Range, languages, ExtensionContext, Disposable, env } from 'vscode';
import { parseConfig } from './lib/ooc/core';

export function activate(context: ExtensionContext) {
	const disposableList: Disposable[] = []

	// generate
	disposableList.push(commands.registerCommand('obsolete-ooc.generate', () => {
		try {
			const text = window.activeTextEditor.document.getText() || ''
			const config = parseConfig(vscode.workspace.getConfiguration('OOOC').get<IConfig>('env'))
			const result = OOC(text, config)
			env.clipboard.writeText(result).then(() => {
				window.showInformationMessage('指令生成成功')
			})
        } catch (error) {
			window.showInformationMessage(error.message)
        }
	}));

	// hover
	disposableList.push(languages.registerHoverProvider('mcfunction', {
		provideHover: (document, position) => {
			const text = document.lineAt(position.line).text
			const match = text.match(/#\s*\[\s*(>*)\s*(rcb|ccb|icb|init|end)\s*(\*?)\s*(\d*)\s*\]/)
			if (match) {
				// window.activeTextEditor.setDecorations(window.createTextEditorDecorationType({
				// 	isWholeLine: true,
				// 	overviewRulerLane: 7
				// }), [
				// 	new Range(
				// 		new Position(position.line + 1, 0), 
				// 		new Position(position.line + 1, match[0].length)
				// 	)
				// ])
				return {
					range: new Range(
						new Position(position.line, 0), 
						new Position(position.line, match[0].length)
					),
					contents: logicProvider(match),
				}
			}
		}
	}))

	context.subscriptions.push(...disposableList);
}

// this method is called when your extension is deactivated
export function deactivate() {}
