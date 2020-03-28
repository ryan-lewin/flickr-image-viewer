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
        if(labels.includes("Large Square")) {imgSources.largeSquare = data[labels.indexOf("Large Square")].source}
        showImage(imgSources, caption)
    }

    showImage = (imgSources, caption) => {
        const IMAGE_CONTAINER = document.getElementById('image-container');
        const IMAGE_FIG = document.createElement('figure');
        let newImage = `<img src=${imgSources.small} alt="" id="thumbnail"><h4>${caption}</h4>`
        IMAGE_FIG.innerHTML = newImage;
        IMAGE_CONTAINER.appendChild(IMAGE_FIG);
        IMAGE_FIG.addEventListener("click", () => {
            modalImage(imgSources, caption)
        });
    }

    addRecent = (viewedImage, caption) => {
        for(let i = 0; i < recentlyViewed.length; i++) {
            if(recentlyViewed[i].image === viewedImage) {
                console.log(viewedImage)
                return
            }
        }
        if(recentlyViewed.length < 5){
            recentlyViewed.unshift({image: viewedImage, caption: caption})
        } else {
            recentlyViewed.pop()
            recentlyViewed.unshift({image: viewedImage, caption: caption})
        }
    }

    modalImage = (imgSources, caption) => {
        console.log(imgSources.small, imgSources.largeSquare)
        addRecent(imgSources.largeSquare, caption)
        const MODAL = document.getElementById('modal');
        const MODAL_IMG = document.getElementById('modal-img')
        const ModalClose = document.getElementById('modal-close');
        MODAL.style.display = 'flex';
        let newImage = `<img src=${imgSources.small} alt=""> <h4>${caption}</h4>`
        MODAL_IMG.innerHTML = newImage;
        ModalClose.addEventListener("click", () =>  {
            showRecentlyViewed();
            MODAL.style.display = 'none';
        })
    }

    showRecentlyViewed = () => {
        const RECENTLY_VIEWED = document.getElementById('recently-viewed');
        RECENTLY_VIEWED.innerHTML = ''
        recentlyViewed.forEach((img) => {
            let newImage = `<img src=${img.image} alt=""><h4>${img.caption}</h4>`
            const IMAGE_FIG = document.createElement('figure');
            IMAGE_FIG.innerHTML = newImage;
            RECENTLY_VIEWED.appendChild(IMAGE_FIG);
            IMAGE_FIG.addEventListener("click", () => {
                modalImage(img.image, img.caption)
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