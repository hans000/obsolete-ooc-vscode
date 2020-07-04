import  * as vscode from 'vscode';
import OOC, { IConfig } from './lib/ooc';
import logicProvider from './lib/ooc/provider/logic';

import { commands, window, Position, Range, languages, ExtensionContext, Disposable, env } from 'vscode';
import { parseConfig } from './lib/ooc/core';

export function activate(context: ExtensionContext) {
	const disposableList: Disposable[] = []
	const activeEditor = vscode.window.activeTextEditor;
	let decoration: vscode.TextEditorDecorationType;

	function getLineText(line: number) {
		return activeEditor.document.lineAt(line).text
	}
	function updateDecorations(position: Position, count: number) {
		if (decoration) {
			decoration.dispose()
		}
		let currLine = position.line + 1
		decoration = window.createTextEditorDecorationType({
			isWholeLine: true,
			light: { backgroundColor: { id: 'editor.selectionHighlightBackground' } },
			dark: { backgroundColor: { id: 'editor.selectionHighlightBackground' } },
		})
		const lineCount = activeEditor.document.lineCount
		while (count !== 0) {
			if (currLine === lineCount) {
				break
			}
			const text = getLineText(currLine)
			const match = text.match(/#\s*\[\s*(>*)\s*(rcb|ccb|icb|init|end)\s*(\*?)\s*(\d*)\s*\]/)
			if (match) {
				break
			}
			if (text.trimLeft() === '' || text.trimLeft().startsWith('#')) {
				currLine++

				continue
			}
			currLine++
			count--
		}
		activeEditor.setDecorations(decoration, [new Range(
			new Position(position.line, 0),
			new Position(currLine - 1, 0),
		)])
	}

	// hover
	disposableList.push(languages.registerHoverProvider('mcfunction', {
		provideHover: (document, position) => {
			const text = document.lineAt(position.line).text
			const match = text.match(/#\s*\[\s*(>*)\s*(rcb|ccb|icb|init|end)\s*(\*?)\s*(\d*)\s*\]/)
			if (match) {
				const count = match[4] ? +match[4] : -1;
				try {
					updateDecorations(position, count)
					return {
						range: new Range(
							new Position(position.line, 0),
							new Position(position.line, match[0].length)
						),
						contents: logicProvider(match),
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				if (decoration) {
					decoration.dispose()
				}
			}
		}
	}))

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

	context.subscriptions.push(...disposableList);
}

// this method is called when your extension is deactivated
export function deactivate() {}
