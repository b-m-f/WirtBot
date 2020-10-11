
const replace = require('replace-in-file');
const fs = require('fs').promises;


(async () => {
    const files = await fs.readdir('./dist')
    const options = {
        files: files.map(file => 'dist/' + file),
        from: /__webpack_require__\(.*\)\(getStringFromWasm0\(arg0, arg1\)\)/g,
        to: 'require(getStringFromWasm0(arg0,arg1))',
    };
    replace(options)
})()