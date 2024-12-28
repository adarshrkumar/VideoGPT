import fs from 'fs';

import errors from './errorCodes.mjs';
errorCodes = errors.codes;

var errorTemplateFile = fs.readFileSync('./error.html', 'utf8');

export function useErrorTemplate(code, message) {
    var message = `<p>${message.replace(/\n/g, '</p><p>')}</p>`;
    return errorTemplateFile.replace(/{{code}}/g, code).replace(/{{code_title}}/g, errorCodes[code.toString()]).replace(/{{message}}/g, message);
}

export default useErrorTemplate;