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

        let methodName = currentLine.match(/->([\w-]+)\(/)[1];
        console.log(methodName);
        

        let newMethod = '';

        for (let line = doc.lineCount - 1; line >= 0; line--) {
            let textLine = doc.lineAt(line).text.trim();

            if (/\}/.test(textLine)) {
                newMethod = `\n\tprotected function ${methodName}()\n`
                            + '\t{\n'
                            + '\t}\n';

                this.activeEditor().edit(edit => {
                    edit.insert(new vscode.Position(line, 0), newMethod);
                });

                break;
            }
        }

        // currentPosition = this.activeEditor().selection.active;
        // console.log(currentPosition);

        // var newSelection = new vscode.Selection(currentPosition, currentPosition);
        // this.activeEditor().selection = newSelection;

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