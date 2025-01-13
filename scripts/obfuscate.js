const fs = require('fs');
const path = require('path');
const obfuscator = require('javascript-obfuscator');

const inputDir = path.resolve(__dirname, '../dist/jsclean'); // Your JS source folder
const outputDir = path.resolve(__dirname, '../dist/js'); // Output folder for obfuscated files

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading input directory:', err);
        process.exit(1);
    }

    files.forEach((file) => {
        if (path.extname(file) === '.js') {
            const filePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, file);

            fs.readFile(filePath, 'utf8', (readErr, content) => {
                if (readErr) {
                    console.error(`Error reading file ${file}:`, readErr);
                    return;
                }

                const obfuscated = obfuscator.obfuscate(content, {
                    compact: false,
                    controlFlowFlattening: true,
                    controlFlowFlatteningThreshold: 0.75,
                    deadCodeInjection: true,
                    deadCodeInjectionThreshold: 0.4,
                });

                fs.writeFile(outputFilePath, obfuscated.getObfuscatedCode(), (writeErr) => {
                    if (writeErr) {
                        console.error(`Error writing file ${outputFilePath}:`, writeErr);
                    } else {
                        console.log(`Obfuscated: ${file}`);
                    }
                });
            });
        }
    });
});
