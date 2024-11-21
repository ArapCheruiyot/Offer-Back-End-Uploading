// Selecting HTML elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileDisplayArea = document.getElementById('fileDisplayArea');
const uploadInfoArea = document.getElementById('uploadInfoArea');

// Load saved files on page load
document.addEventListener('DOMContentLoaded', loadSavedFiles);

// Upload button event listener
uploadBtn.addEventListener('click', handleFileUpload);

// Enable multiple file selection
fileInput.setAttribute('multiple', true);

// Function to handle file upload
function handleFileUpload() {
    const files = Array.from(fileInput.files); // Convert FileList to Array

    if (files.length === 0) {
        alert('Please select files to upload.');
        return;
    }

    const uploaderName = prompt('Please enter your name:');
    if (!uploaderName) {
        alert('Upload cancelled. Name is required.');
        return;
    }

    const uploadTime = new Date().toLocaleString();

    // Save uploader information in localStorage
    localStorage.setItem('uploaderInfo', JSON.stringify({ uploaderName, uploadTime }));

    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

    files.forEach((file) => {
        const fileName = file.name;

        // Check if the file already exists
        const fileExists = savedFiles.some(savedFile => savedFile.fileName === fileName);

        if (fileExists) {
            const overwrite = confirm(`The file "${fileName}" already exists. Do you want to overwrite it?`);
            if (!overwrite) {
                return; // Skip the file if user chooses not to overwrite
            } else {
                // Remove the existing file before overwriting
                const fileIndex = savedFiles.findIndex(savedFile => savedFile.fileName === fileName);
                if (fileIndex !== -1) {
                    savedFiles.splice(fileIndex, 1);
                }
            }
        }

        // Save file details to localStorage
        savedFiles.push({ fileName });
        localStorage.setItem('uploadedFiles', JSON.stringify(savedFiles));

        // Display the uploaded file
        displayFile(fileName, savedFiles.length - 1);
    });

    // Update and display uploader information
    displayUploaderInfo(uploaderName, uploadTime);

    // Clear the file input for future uploads
    fileInput.value = '';
}

// Function to display a file in the list
function displayFile(fileName, index) {
    // Create list item for the file
    const fileItem = document.createElement('li');
    fileItem.classList.add('file-item');

    // File information
    const fileInfo = document.createElement('span');
    fileInfo.textContent = `${fileName}`;
    fileItem.appendChild(fileInfo);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');

    // Delete functionality
    deleteButton.addEventListener('click', () => {
        deleteFile(index);
    });

    fileItem.appendChild(deleteButton);

    // Append to the file display area
    fileDisplayArea.appendChild(fileItem);
}

// Function to load saved files from localStorage
function loadSavedFiles() {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    savedFiles.forEach((fileData, index) => {
        displayFile(fileData.fileName, index);
    });

    // Load and display uploader information if available
    const savedUploaderInfo = JSON.parse(localStorage.getItem('uploaderInfo'));
    if (savedUploaderInfo) {
        displayUploaderInfo(savedUploaderInfo.uploaderName, savedUploaderInfo.uploadTime);
    }
}

// Function to display uploader information
function displayUploaderInfo(uploaderName, uploadTime) {
    uploadInfoArea.innerHTML = `<p>Uploaded by: ${uploaderName} at ${uploadTime}</p>`;
}

// Function to delete a file
function deleteFile(index) {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    savedFiles.splice(index, 1); // Remove the selected file
    localStorage.setItem('uploadedFiles', JSON.stringify(savedFiles));

    // Refresh the displayed files
    fileDisplayArea.innerHTML = '';
    loadSavedFiles();
}
