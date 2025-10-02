import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputFilePath = path.join(__dirname, '../docs/treeWithoutNodeandWASM.txt');
const rootPath = path.join(__dirname, '..'); // Project root
const ignorePatterns = [
    'node_modules',
    'dist',
    'target',
    'pkg',
    '.git',
    '.firebase',
    '.vscode',
    'tests',
    'errors', // Add errors folder to ignore
    'GEMINI_COMMIT_MSG.tmp', // Ignore temporary commit message file
    'package-lock.json' // Often not needed in tree view
];

function generateTree(currentPath, prefix = '', isLast = false, output = []) {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });

    // Filter out ignored files/directories
    const filteredFiles = files.filter(dirent => {
        return !ignorePatterns.includes(dirent.name);
    });

    // Sort directories first, then files
    filteredFiles.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });

    for (let i = 0; i < filteredFiles.length; i++) {
        const dirent = filteredFiles[i];
        const isCurrentLast = (i === filteredFiles.length - 1);
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        const connector = isCurrentLast ? '└── ' : '├── ';

        output.push(prefix + connector + dirent.name);

        if (dirent.isDirectory()) {
            generateTree(path.join(currentPath, dirent.name), newPrefix, isCurrentLast, output);
        }
    }
    return output;
}

try {
    const treeOutput = generateTree(rootPath);
    const header = path.basename(rootPath); // Get just the project folder name
    fs.writeFileSync(outputFilePath, header + '\n' + treeOutput.join('\n'));
    console.log(`Tree generated successfully at ${outputFilePath}`);
} catch (error) {
    console.error('Error generating tree:', error);
}