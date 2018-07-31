const vscode = require('vscode');

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
        
        let currentPosition = this.activeEditor().selection.active;

        let currentLine = doc.lineAt(currentPosition.line).text.trim();

        let methodName = currentLine.match(/this->(.+)\(/)[1];

        let snippet = '';

        for (let line = doc.lineCount - 1; line >= 0; line--) {
            let textLine = doc.lineAt(line).text.trim();

            if (/\}/.test(textLine)) {
                snippet = `\n\tpublic function ${methodName}()\n`
                            + '\t{\n'
                            + '\t}\n';

                this.activeEditor().insertSnippet(
                    new vscode.SnippetString(snippet),
                    this.range(line)
                );

                break;
            }
        }
    }
    
    range(line) {
        return new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, 0))
    }

    activeEditor() {
        return vscode.window.activeTextEditor;
    }

    activeDocument() {
        return this.activeEditor().document;
    }

}