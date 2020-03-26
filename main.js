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
        let newImage = `
            <figure id="thumbnail-container">
            <img src=${imgSource} alt="" id="thumbnail">
            </figure>
        `
        IMAGE_FIG.innerHTML = newImage;
        IMAGE_CONTAINER.appendChild(IMAGE_FIG);
        IMAGE_FIG.addEventListener("click", () => {
            modalImage(imgSource)
        });
    }

    modalImage = (imgSource) => {
        const Modal = document.getElementById('modal');
        const ModalImg = document.getElementById('modal-img')
        const ModalClose = document.getElementById('modal-close');
        Modal.style.display = 'flex';
        const Img = document.createElement('IMG');
        // const Tag = document.createElement('P');
        Img.src = imgSource;
        // Tag.innerHTML = imgTag;
        ModalImg.appendChild(Img)
        // ModalImg.appendChild(Tag)
        ModalClose.addEventListener("click", () =>  {
            ModalImg.innerHTML = "";
            Modal.style.display = 'none';
        })
    }

    $(".nav-link").click(function () {
        flickrSearch($(this).text(), 12);
     });

    window.onload = flickrSearch('Landscapes', 12);

})