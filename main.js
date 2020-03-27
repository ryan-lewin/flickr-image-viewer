$(document).ready(() => {
    let recentlyViewed = [];
    const API_KEY = 'd288c5134f7f7b7c7703b2458c40c277';

    flickrSearch = (term, imgNo) => {
        const STR = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${term}&per_page=20&format=json&nojsoncallback=1`
        const IMAGE_CONTAINER = document.getElementById('image-container');
        IMAGE_CONTAINER.innerHTML = '';
        $.get(STR, (data) => {
            for(let i = 0; i < imgNo; i++) {
                flickrSize(data.photos.photo[i].id, data.photos.photo[i].title);
            }
        })
    }

    flickrSize = (id, caption) => {
        const STR = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=${API_KEY}&photo_id=${id}`
        $.get(STR, (data) => {
            assignSizes(data.sizes.size, caption)
        })
    }

    assignSizes = (data, caption) => {
        let imgSources = {small: data[0].source, largeSquare: data[0].source};
        let labels = [];
        data.forEach((label) => {
            labels.push(label.label)
        })
        if(labels.includes("Small")) {imgSources.small = data[labels.indexOf("Small")].source}
        if(labels.includes("Large Square")) {imgSources.largeSquare = data[labels.indexOf("Small")].source}
        showImage(imgSources, caption)
        showRecentlyViewed(imgSources.largeSquare)
    }

    showImage = (imgSources, caption) => {
        const IMAGE_CONTAINER = document.getElementById('image-container');
        const IMAGE_FIG = document.createElement('figure');
        let newImage = `
            <figure id="thumbnail-container">
                <img src=${imgSources.small} alt="" id="thumbnail">
                <h4>${caption}</h4>
            </figure>`
        IMAGE_FIG.innerHTML = newImage;
        IMAGE_CONTAINER.appendChild(IMAGE_FIG);
        IMAGE_FIG.addEventListener("click", () => {
            modalImage(imgSources, caption)
        });
    }

    modalImage = (imgSources, caption, fromRecent = false) => {
        if(!fromRecent) {recentlyViewed.push(imgSources.largeSquare)}
        const MODAL = document.getElementById('modal');
        const MODAL_IMG = document.getElementById('modal-img')
        const ModalClose = document.getElementById('modal-close');
        MODAL.style.display = 'flex';
        let newImage = `
            <figure id="modal-img">
                <img src=${imgSources.small} alt="">
                <h4>${caption}</h4>
            </figure>`
        MODAL_IMG.innerHTML = newImage;
        ModalClose.addEventListener("click", () =>  {
            showRecentlyViewed(imgSources, caption);
            MODAL.style.display = 'none';
        })
    }

    showRecentlyViewed = (imgSources, caption) => {
        const RECENTLY_VIEWED = document.getElementById('recently-viewed');
        // RECENTLY_VIEWED.innerHTML = ''
        recentlyViewed.forEach((imgSource) => {
            let newImage = `
                <figure id="thumbnail-container">
                    <img src=${imgSource} alt="">
                    <h4>${caption}</h4>
                </figure>`
            const IMAGE_FIG = document.createElement('figure');
            IMAGE_FIG.innerHTML = newImage;
            RECENTLY_VIEWED.appendChild(IMAGE_FIG);
            IMAGE_FIG.addEventListener("click", () => {
                modalImage(imgSources, caption, true)
            });
        })
    }

    $(".nav-link").click(function () {
        flickrSearch($(this).text(), 12);
     });

    $(".recently-viewed").click(function () {
        showRecentlyViewed();
    });


    window.onload = flickrSearch('Landscapes', 12);

})