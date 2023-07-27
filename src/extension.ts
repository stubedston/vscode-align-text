import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const align_text = function(usr_expr: RegExp, trim: boolean, first_only: boolean) {
		// get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// get lines of selected text
			const sel = document.getText(selection);
			const lines = sel.split(/\n/g);

			// split into cells
			const cells = [];

			for (let i = 0; i < lines.length; i++) {
				cells[i] = lines[i].split(usr_expr);
				if (trim) {
					cells[i] = cells[i].map(item => item.trim());
				}
				cells[i] = cells[i].filter(item => item != '');
			}

			// count rows and max number of columns
			const n_row = cells.length;
			let n_col = 0;

			for (let i = 0; i < n_row; i++) {
				n_col = Math.max(n_col, cells[i].length);
			}

			// get max length of each column
			// ignore rows with only one item i.e. no split
			const cols_len = Array(n_col).fill(0);

			for (let i = 0; i < n_row; i++) {
				// skip row if they are length one, as they dont have the separator
				if (cells[i].length == 1) {
					continue;
				}

				for (let j = 0; j < cells[i].length; j++) {
					cols_len[j] = Math.max(cols_len[j], cells[i][j].length);
				}
			}

			// pad each cell to the max width for its column
			const padded_cells = cells;

			for (let i = 0; i < n_row; i++) {
				// skip row if they are length one, as they dont have the separator
				if (cells[i].length == 1) {
					continue;
				}

				// pad for multiple splits or the first only?
				let j_max = 1;
				if (!first_only) {
					j_max = cells[i].length;
				}

				for (let j = 0; j < j_max; j++) {
					let pad_len = cols_len[j];
					if (trim && j < (j_max - 1)) {
						pad_len = pad_len + 1;
					}

					padded_cells[i][j] = cells[i][j].padEnd(pad_len, ' ');
				}
			}

			// join cells into lines, and lines into paragraph
			const aligned_lines = [];
			for (let i = 0; i < n_row; i++) {
				aligned_lines[i] = cells[i].join('');
			}

			const aligned_sel = aligned_lines.join('\n');

			editor.edit(editBuilder => {
				editBuilder.replace(selection, aligned_sel);
			});
		}
	};

	const AlignColumn = vscode.commands.registerCommand('extension.AlignColumn', async function() {
		// get user input
		let usr_txt = await vscode.window.showInputBox({
			title: 'Align columns',
			value: 'csv',
			ignoreFocusOut: true,
			validateInput: text => {
				return text == '' ? 'Not empty' : null;
			},
		});

		if (usr_txt == undefined) {
			return;
		}

		// make regex
		if (usr_txt.toLowerCase() == 'csv') {
			// make regex to match non-quoted commas
			// https://stackoverflow.com/a/48806378
			usr_txt = `(.*?(?:"(?:(?:"")*[^"]*)*"|[^",]*),)`;
		} else {
			// make general regex based on user input:
			//  + split on expression and any whitespace padding
			//  + keep separator with everything on the left
			usr_txt = `(.*?${usr_txt}\\s*)`;
		}
		const usr_expr = new RegExp(usr_txt, 'gi');

		// now we can do the actual aligning
		align_text(usr_expr, true, false);
	});

	const AlignWord = vscode.commands.registerCommand('extension.AlignWord', async function() {
		// get user input
		let usr_txt = await vscode.window.showInputBox({
			title: 'Align on word',
			value: '=',
			ignoreFocusOut: true,
			validateInput: text => {
				return text == '' ? 'Not empty' : null;
			},
		});

		if (usr_txt == undefined) {
			return;
		} else {
			usr_txt = usr_txt.toString().toLowerCase();
		}

		// preset lists
		const sql_data_type = [
			'bigint',
			'binary',
			'bit',
			'blob',
			'bool',
			'boolean',
			'char',
			'date',
			'datestamp',
			'datetime',
			'dec',
			'decimal',
			'double',
			'float',
			'int',
			'longblob',
			'longtext',
			'mediumblob',
			'mediumint',
			'mediumtext',
			'numeric',
			'real',
			'smallint',
			'text',
			'time',
			'timestamp',
			'tinyblob',
			'tinyint',
			'tinytext',
			'varchar',
		];

		const math_compare = [
			'==',
			'===',
			'!=',
			'!==',
			'>=',
			'<=',
			'>',
			'<'
		];

		// make regex
		if (sql_data_type.some(x => x == usr_txt)) {
			// make regex to match all sql data types
			usr_txt = sql_data_type.join('|');
			usr_txt = `(?=\\W(?:${usr_txt})\\W)`;
		} else if (math_compare.some(x => x == usr_txt)) {
			// make regex to match all mathematical comparisons
			usr_txt = math_compare.join('|');
			usr_txt = `(?=(?:${usr_txt}))`;
		} else {
			// make general regex based on user input:
			//  + split on expression sandwiched by non-word characters
			//  + keep separator with everything on the right
			usr_txt = `(?=\\W${usr_txt}\\W)`;
		}
		const usr_expr = new RegExp(usr_txt, 'i');

		// Now we can do the actual aligning
		align_text(usr_expr, false, true);
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
