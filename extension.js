const vscode = require('vscode');
const CreateMethod = require('./CreateMethod');

function activate(context) {
    let creator = new CreateMethod();

    context.subscriptions.push(vscode.commands.registerCommand('create.method', () => {
            creator.create();
        })
    );
}

exports.activate = activate;