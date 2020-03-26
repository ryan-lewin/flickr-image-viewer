$(document).ready(() => {
    const API_KEY = 'd288c5134f7f7b7c7703b2458c40c277';

    flickrSearch = (term, imgNo) => {
        const STR = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${term}&per_page=20&format=json&nojsoncallback=1`
        const IMAGE_CONTAINER = document.getElementById('image-container');
        IMAGE_CONTAINER.innerHTML = '';
        $.get(STR, (data) => {
            for(let i = 0; i < imgNo; i++) {
                flickrSize(data.photos.photo[i].id, 3);
            }
            
        })
    }

    flickrSize = (id, size) => {
        const STR = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=${API_KEY}&photo_id=${id}`
        $.get(STR, (data) => {
            let source = data.sizes.size[size].source;
            show = () => {showImage(source)}
            show()
        })
    }

    showImage = (imgSource) => {
        const IMAGE_CONTAINER = document.getElementById('image-container');
        const IMAGE_FIG = document.createElement('figure');
        let newImage = `<figure id="thumbnail-container"><img src=${imgSource} alt="" id="thumbnail"></figure>`
        IMAGE_FIG.innerHTML = newImage;
        IMAGE_CONTAINER.appendChild(IMAGE_FIG);
        IMAGE_FIG.addEventListener("click", () => {
            modalImage(imgSource)
        });
    }

    modalImage = (imgSource) => {
        const MODAL = document.getElementById('modal');
        const MODAL_IMG = document.getElementById('modal-img')
        const ModalClose = document.getElementById('modal-close');
        MODAL.style.display = 'flex';
        let newImage = `<figure id="modal-img"><img src=${imgSource} alt=""></figure>`
        MODAL_IMG.innerHTML = newImage;
        ModalClose.addEventListener("click", () =>  {
            MODAL_IMG.innerHTML = "";
            MODAL.style.display = 'none';
        })
    }

    $(".nav-link").click(function () {
        flickrSearch($(this).text(), 12);
     });

    window.onload = flickrSearch('Landscapes', 12);

})