const nls = require('vscode-nls');

const localize = nls.loadMessageBundle();

function getMessage(){
    return localize("nlssample.message", "This is a sample message");
}

module.exports = { getMessage }