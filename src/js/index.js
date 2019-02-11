/* global Notifications, ListOfFiles, ElementsOnPage, StatusBar, request,
BlobDataObject, updateStatusBar */

const uploadForm = document.querySelector('.form__upload');
const buttonChooseFile = document.querySelector('.button__choose-file');
const downloadForm = document.querySelector('.form__download');
const downloadBar = document.querySelector('.textarea__choose');
const pictureElement = document.querySelector('.picture');

const statusMessage = new Notifications([
  { 'noFileChosen': 'Please, choose the file at first' },
  { 'noFileEntered': 'Please, enter the name of the file at first' },
  { 'noFileName': 'There is no file with name `{placeForFileName}`' },
  { 'fileUpload': 'File `{placeForFileName}` was successfully uploaded to server' },
  { 'fileSaved': 'File `{placeForFileName}` was saved to your local disc' }
]);

const btnChooseFileTitle = new Notifications([
  { 'default': 'Choose a file...' },
  { 'fileName': '{placeForFileName}' }
]);

const listOfFiles = new ListOfFiles();

const statusMessageOnPage = new ElementsOnPage('p', 'status-message', 'status-message-wrapper');
const listOfFilesOnPage = new ElementsOnPage('li', 'list-of-files__element', 'list-of-files');
const btnChooseFileTitleOnPage = new ElementsOnPage('span', 'button__file-name', 'button__choose');


listOfFiles.update()
  .then(data => listOfFilesOnPage.update(data));


// ============= UPLOAD FORM =================

buttonChooseFile.onchange = function() {
  statusMessageOnPage.deleteAll();
  const fileNameToUpload = this.value.split('fakepath\\')[1];

  if (fileNameToUpload) {
    const btnText = btnChooseFileTitle.fileName.getMessage(fileNameToUpload);
    btnChooseFileTitleOnPage.update(btnText);
  }
};

uploadForm.onsubmit = function(e) {
  e.preventDefault();

  statusMessageOnPage.deleteAll();

  const uploadFile = e.target.sampleFile.files[0];

  if (!uploadFile) {
    const { message: msgText } = statusMessage.noFileChosen;
    statusMessageOnPage.update(msgText);
    return;
  }

  const formData = new FormData();
  formData.append('sampleFile', uploadFile);

  const uploadStatusBar = new StatusBar({
    tagName: 'div',
    className: `status-bar__upload file__${uploadFile.name}`,
    parrentElClassName: 'status-bar__upload-wrapper',
    statusFunction: updateStatusBar
  });

  const config = {
    data: formData,
    onUploadProgress: uploadStatusBar.showProgress.bind(uploadStatusBar)
  };

  request
    .post('/upload', config)
    .then(() => {
      const { message: btnText } = btnChooseFileTitle.default;
      btnChooseFileTitleOnPage.update(btnText);

      const msgText = statusMessage.fileUpload.getMessage(uploadFile.name);
      statusMessageOnPage.update(msgText);

      listOfFiles.update()
        .then(data => listOfFilesOnPage.update(data));

      uploadForm.reset();
      setTimeout(() => uploadStatusBar.delete(), 500);
    });
};


// ============= DOWNLOAD FORM =================

downloadForm.onsubmit = function(e) {
  e.preventDefault();

  statusMessageOnPage.deleteAll();

  const downloadFileName = e.target.sampleFile.value;

  if (!downloadFileName) {
    const { message: msgText } = statusMessage.noFileChosen;
    statusMessageOnPage.update(msgText);
    return;
  }

  if (!listOfFiles.hasItem(downloadFileName)) {
    const msgText = statusMessage.noFileName.getMessage(downloadFileName);
    statusMessageOnPage.update(msgText);
    return;
  }

  const downloadStatusBar = new StatusBar({
    tagName: 'div',
    className: `status-bar__download file__${downloadFileName}`,
    parrentElClassName: 'textarea__choose-wrapper',
    statusFunction: updateStatusBar
  });

  const config = {
    responseType: 'blob',
    transformResponse: [data => data.response],
    onDownloadProgress: downloadStatusBar.showProgress.bind(downloadStatusBar)
  };

  request
    .get(`/files/${downloadFileName}`, config)
    .then(response => {
      const blob = new BlobDataObject(response);

      statusMessageOnPage.deleteAll();

      if (blob.isPicture()) {
        blob.display(pictureElement);
      }

      if (!blob.isPicture()) {
        blob.download(downloadFileName);
        const msgText = statusMessage.fileSaved.getMessage(downloadFileName);
        statusMessageOnPage.update(msgText);
      }

      setTimeout(() => {
        downloadStatusBar.delete();
        downloadForm.reset();
      }, 500);
    })
    .catch(error => window.console.log(error));
};