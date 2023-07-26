import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const align_text = function(usr_expr: RegExp, trim: boolean) {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get lines of selected text
			const sel = document.getText(selection);
			const lines = sel.split(/\n/g);

			// Split into cells
			const cells = [];

			for (let i = 0; i < lines.length; i++) {
				cells[i] = lines[i].split(usr_expr);
				if (trim) {
					cells[i] = cells[i].map(item => item.trim());
				}
				cells[i] = cells[i].filter(item => item != '');
			}

			// Count rows and max number of columns
			const n_row = cells.length;
			let n_col = 0;

			for (let i = 0; i < n_row; i++) {
				n_col = Math.max(n_col, cells[i].length);
			}

			// Get max length of each column
			const cols_len = Array(n_col).fill(0);

			for (let i = 0; i < n_row; i++) {
				for (let j = 0; j < cells[i].length; j++) {
					cols_len[j] = Math.max(cols_len[j], cells[i][j].length);
				}
			}

			// Pad each cell to the max width for its column
			const padded_cells = cells;

			for (let i = 0; i < n_row; i++) {
				for (let j = 0; j < cells[i].length; j++) {
					padded_cells[i][j] = cells[i][j].padEnd(cols_len[j], ' ');
				}
			}

			// Join cells into lines, and lines into paragraph
			const aligned_lines = [];

			for (let i = 0; i < n_row; i++) {
				aligned_lines[i] = cells[i].join(' ');
			}

			const aligned_sel = aligned_lines.join('\n');

			editor.edit(editBuilder => {
				editBuilder.replace(selection, aligned_sel);
			});
		}
	};

	const AlignColumn = vscode.commands.registerCommand('extension.AlignColumn', async function() {
		// Get user input
		let usr_txt = await vscode.window.showInputBox({
			title: 'Align columns',
			value: `["'],`,
			prompt: 'Define column separator. Regular expression, case insensitive.',
			ignoreFocusOut: true,
			validateInput: text => {
				return text == '' ? 'Not empty' : null;
			},
		});

		if (usr_txt == undefined) {
			return;
		}

		// Turn user input into a fuller regex
		// Split on expression, keep separator with everything on the left
		usr_txt = `(.*?${usr_txt}\\s*)`;
		const usr_expr = new RegExp(usr_txt, 'gi');

		// Now we can do the actual aligning
		align_text(usr_expr, true);
	});

	const AlignWord = vscode.commands.registerCommand('extension.AlignWord', async function() {
		// Get user input
		let usr_txt = await vscode.window.showInputBox({
			title: 'Align on word',
			value: `=`,
			prompt: 'Define regular expression to align on, case insensitive.',
			ignoreFocusOut: true,
			validateInput: text => {
				return text == '' ? 'Not empty' : null;
			},
		});

		if (usr_txt == undefined) {
			return;
		}

		// Turn user input into a fuller regex
		// Split on expression sandwiched with whitespace, keep separator with everything on the right
		usr_txt = `(?=\\s${usr_txt}\\s)`;
		const usr_expr = new RegExp(usr_txt, 'gi');

		// Now we can do the actual aligning
		align_text(usr_expr, false);
	});

	const Misalign = vscode.commands.registerCommand('extension.Misalign', async function() {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get selected text
			const sel = document.getText(selection);

			// Strip any excessive whitespace characters after the indentation
			const expr = /(.*?\S)([\t ]+)/gm;
			const misalign_sel = sel.replace(expr, '$1 ');

			editor.edit(editBuilder => {
				editBuilder.replace(selection, misalign_sel);
			});
		}
	});

	context.subscriptions.push(AlignColumn);
	context.subscriptions.push(AlignWord);
	context.subscriptions.push(Misalign);
}
