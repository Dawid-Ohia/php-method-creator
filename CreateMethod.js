const vscode = require("vscode");

module.exports = class CreateMethod {
    async create() {
        const editor = this.activeEditor();

        if (editor === undefined) {
            return;
        }

        let activeDocument = this.activeDocument().uri;

        if (activeDocument === undefined) {
            return;
        }

        await this.insertMethod(activeDocument);
    }

    async insertMethod(activeDocument) {
        let doc = await vscode.workspace.openTextDocument(activeDocument);

        let currentPosition = this.activeEditor().selection;
        
        let methodName = this.activeDocument().getText(currentPosition);
        
        if (!methodName) {
            // method not selected
            currentPosition = this.activeEditor().selection.active;

            let currentLineText = doc.lineAt(currentPosition.line).text.trim();

            methodName = currentLineText.match(/->([\w-]+)\(/)[1];
        }

        for (let line = doc.lineCount - 1; line >= 0; line--) {
            let textLine = doc.lineAt(line).text.trim();

            console.log(1);
            if (/\}/.test(textLine)) {
                this.insertNewMethod(line, methodName);
                

                break;
            }
        }
    }

    insertNewMethod(line, methodName) {
        let method = `\n\tprotected function ${methodName}()\n`
            + "\t{\n"
            + "\t\t\/\/\n"
            + "\t}\n";

        this.activeEditor().edit(edit => {
            edit.insert(new vscode.Position(line, 0), method);
        });
    }

    range(line) {
        return new vscode.Range(
            new vscode.Position(line, 0),
            new vscode.Position(line, 0)
        );
    }

    activeEditor() {
        return vscode.window.activeTextEditor;
    }

    activeDocument() {
        return this.activeEditor().document;
    }
};
