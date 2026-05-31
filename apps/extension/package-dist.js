const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, 'karrio-extension-dist.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

archive.pipe(output);

// Exclude build artifacts and unnecessary files
const excluded = [
    'node_modules/**',
    '.git/**',
    '.plasmo/**',
    '.turbo/**',
    'build/**',
    'karrio-extension-dist.zip',
    'package-dist.js'
];

archive.glob('**/*', {
    cwd: __dirname,
    ignore: excluded
});

archive.finalize();

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('Zip generated successfully.');
});

archive.on('error', function (err) {
    throw err;
});