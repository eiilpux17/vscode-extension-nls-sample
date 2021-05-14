import * as nls from 'vscode-nls';

const localize = nls.loadMessageBundle();

export function getMessage(){
    return localize("nlssample.message", "This is a sample message");
}