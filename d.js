// fileCounterService.js
const fs = require('fs');
const path = require('path');

// The fixed base path for your 'pics' folder
const FIXED_BASE_PATH = 'C:\\Users\\danon\\OneDrive\\Desktop\\lens dance\\pics';

/**
 * Counts specific file types (PNG, MP4) and total files in a given directory.
 * @param {string} directoryPath The absolute path to the directory to scan.
 * @returns {object|null} An object with png, mp4, and total counts, or null if an error occurs.
 */
function countSpecificFilesInDirectory(directoryPath) {
    try {
        const filesAndFolders = fs.readdirSync(directoryPath);

        let pngCount = 0;
        let mp4Count = 0;
        let totalFilesCount = 0;

        // console.log(`Scanning directory: ${directoryPath}`); // Optional: Keep for service-level debugging

        if (filesAndFolders.length === 0) {
            console.log(`Directory "${directoryPath}" is empty or no items found.`);
        }

        for (const item of filesAndFolders) {
            const itemPath = path.join(directoryPath, item);
            const stats = fs.statSync(itemPath);

            if (stats.isFile()) {
                totalFilesCount++;
                const fileExtension = path.extname(item).toLowerCase();
                // console.log(`Found file: ${item}, Extension: ${fileExtension}`); // Optional: Keep for detailed file-by-file debugging

                if (fileExtension === '.png') {
                    pngCount++;
                } else if (fileExtension === '.mp4') {
                    mp4Count++;
                }
            }
            // else if (stats.isDirectory()) {
            //     console.log(`Found directory: ${item}`); // Optional: Keep for debugging, shows subdirectories
            // }
        }

        return { png: pngCount, mp4: mp4Count, total: totalFilesCount };
    } catch (error) {
        console.error(`Error counting files in directory "${directoryPath}": ${error.message}`);
        return null;
    }
}

// Export the function and the fixed base path so other files can use them
module.exports = {
    countSpecificFilesInDirectory,
    FIXED_BASE_PATH // Exporting the base path for convenience if needed by the consumer
};