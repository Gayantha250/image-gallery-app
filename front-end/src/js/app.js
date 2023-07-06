const overlay = $('#overlay');
const btnUpload = $('#btn-upload');
const dropZone = $('#drop-zone');
const mainElm = $('main');
const cssLoaderHtml = $(`<div class="lds-facebook"><div></div><div></div><div></div></div>`);
const REST_API_URL = `http://localhost:8080/gallery`;

loadAllImages();

btnUpload.on('click', () => overlay.removeClass('d-none'));
overlay.on('click', (eventData) => {
    if (eventData.target === overlay[0]) overlay.addClass('d-none');
});

$(document).on('keydown', (eventData) => {
    if (eventData.key === 'Escape' && !overlay.hasClass('d-none')) {
        overlay.addClass('d-none');
    }

});
overlay.on('dragover', (eventData) => eventData.preventDefault());
overlay.on('drop', (eventData) => eventData.preventDefault());

dropZone.on('dragover', (eventData) => {
    eventData.preventDefault();
});

dropZone.on('drop', (eventData) => {

    eventData.preventDefault();
    const droppedFiles = eventData.originalEvent.dataTransfer.files;

    // filtering images from all dropped files
    if (!imageFiles.length) return;
    overlay.addClass("d-none");
    uploadImages(imageFiles);

});

// mainElm.on('click', '.image:not(.loader)', (eventData) => {
//     eventData.target.requestFullscreen();
// });


function uploadImages(imageFiles) {

    const formData = new FormData();
    imageFiles.forEach(imageFile => {
        const divElm = $(`<div class="images loader"></div>`);
        divElm.append(cssLoaderHtml)
        mainElm.append(divElm);

        formData.append('abcs', imageFile);
    });


    const jqxhr = $.ajax(`${REST_API_URL}/images`, {
        method: 'POST',
        data: formData,
        contentType: false, // if we do not set jquery use x-wwww-form encoded data type used to send data
        processData: false // by default jquery try to convert data in to string son need to preven defult action
    });

    jqxhr.done((imageUrlList) => {

        imageUrlList.forEach(url => {
            const divElm = $(".image.loader").first();
            divElm.css('background-image', `${url}`);
            divElm.empty();
            divElm.removeClass('loader');
        });
    })

}

function loadAllImages() {

    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageFileList) => {
        imageFileList.forEach(imageUrl => {
            const divElm = $(`<div class="images"></div>`);
            const trashIcon = $(` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle-fill download" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
</svg>`)
            localStorage.setItem(`image_${Date.now()}`, `url(${imageUrl})`);
            divElm.css('background-image', `url(${imageUrl})`);
            divElm.append(trashIcon);
            $('main').append(divElm);
        });

    });

}

mainElm.on('click', '.images>svg', (event) => {

    const imageUrl = $(event.target).closest('.images').css('background-image');
    const url = imageUrl.slice(4, -1).replace(/"/g, "");
    downloadImage(url);
});

function downloadImage(imageUrl) {

    const jqxhr = $.ajax({
        url: imageUrl,
        xhrFields: {
            responseType: 'blob'
        }
    });

    jqxhr.done((blob) => {

        let blobUrl = URL.createObjectURL(blob);//get the url of blob
        console.log(blobUrl);
        let anchorElm = document.createElement('a');//create anchor tag
        anchorElm.href = blobUrl;//set attribute href
        anchorElm.download = 'image.jpg';//set the attribute download

        anchorElm.click();//using code click anchor element

        URL.revokeObjectURL(anchorElm.href);//clear the url
    });

    jqxhr.fail(error => console.error('Error:', error));

}

