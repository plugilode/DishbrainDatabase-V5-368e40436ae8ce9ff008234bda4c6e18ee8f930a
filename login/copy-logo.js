const fs = require('fs');
const path = require('path');

// Source logo path
const sourcePath = 'C:\\Users\\PatrickBlanks\\Downloads\\9e919c96-ada6-4a17-aac8-0cbe2b47c47c.png';

// Destination path in the login folder
const destPath = path.join(__dirname, 'dishbrain-logo.png');

try {
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    console.log('Logo successfully copied to the login directory!');
} catch (err) {
    console.error('Error copying the logo file:', err);
}
