$(document).ready(() => {
    const API_KEY = 'd288c5134f7f7b7c7703b2458c40c277';

    flickrSearch = (term) => {
        const STR = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${term}&per_page=20&format=json&nojsoncallback=1`
        $.get(STR, (data) => {
            flickrSize("49699700587", 2)
        })
    }

    flickrSize = (id, size) => {
        const STR = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=${API_KEY}&photo_id=${id}`
        $.get(STR, (data) => {
            showImage(sizes = data.sizes.size[size].source)
        })
    }

    showImage = (imgSource) => {
        const IMAGE_CONTAINER = document.getElementById('image-container')
        let newImage = `
            <figure id="thumbnail-container">
            <img src=${imgSource} alt="" id="thumbnail">
            </figure>
        `
        IMAGE_CONTAINER.innerHTML = newImage
    }

    window.onload = flickrSearch('scenery');

})