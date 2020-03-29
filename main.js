$(document).ready(() => {
    let recentlyViewed = [];
    const API_KEY = 'd288c5134f7f7b7c7703b2458c40c277';
    const WEATHER_API ='86e0ddb65b1757ceff55199a8e11c715'
    let weather = []

    getWeather = () => {
        const COORDINATES = {
            Brisbane: {lat: -27.470125, long: 153.021072, weather: 0},
            Sydney: {lat: -33.865143, long: 151.209900, weather: 0},
            Melbourne: {lat: -37.840935, long: 144.946457, weather: 0},
            Adelaide: {lat: -34.921230, long: 138.599503, weather: 0},
            Perth: {lat: -31.953512, long: 115.857048, weather: 0},
        }
        // const STR = `https://api.darksky.net/forecast/86e0ddb65b1757ceff55199a8e11c715/${COORDINATES.city.lat},${COORDINATES.city.lat}?units=si`
        $.get(STR, (data) => {
            // addWeather(data)
            console.log(city)
        })
    }

    addWeather = (data) => {
        // const LINKS = document.getElementById('nav-links')
        console.log(data)
    }

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
        let imgSources = {small: data[0].source, largeSquare: data[0].source, large: data[data.length - 1].source ,caption: caption};
        let labels = [];
        data.forEach((label) => {
            labels.push(label.label)
        })
        if(labels.includes("Small")) {imgSources.small = data[labels.indexOf("Small")].source}
        if(labels.includes("Large Square")) {imgSources.largeSquare = data[labels.indexOf("Large Square")].source}
        if(labels.includes("Large")) {imgSources.large = data[labels.indexOf("Large")].source}
        showImage(imgSources)
    }

    showImage = (imgSources) => {
        const IMAGE_CONTAINER = document.getElementById('image-container');
        const IMAGE_FIG = document.createElement('figure');
        let newImage = `<img src=${imgSources.small} alt="" id="thumbnail"><p>${imgSources.caption}<p>`
        IMAGE_FIG.innerHTML = newImage;
        IMAGE_CONTAINER.appendChild(IMAGE_FIG);
        IMAGE_FIG.addEventListener("click", () => {
            modalImage(imgSources)
        });
    }

    addRecent = (imgSources) => {
        for(let i = 0; i < recentlyViewed.length; i++) {
            if(recentlyViewed[i].largeSquare === imgSources.largeSquare) {
                return
            }
        }
        if(recentlyViewed.length < 5){
            recentlyViewed.unshift(imgSources)
        } else {
            recentlyViewed.pop()
            recentlyViewed.unshift(imgSources)
        }
    }

    modalImage = (imgSources) => {
        addRecent(imgSources)
        const MODAL = document.getElementById('modal');
        const MODAL_IMG = document.getElementById('modal-img')
        const ModalClose = document.getElementById('modal-close');
        MODAL.style.display = 'flex';
        let newImage = `<img src=${imgSources.large} alt="" id="modal-image"> <h2>${imgSources.caption}</h4>`
        MODAL_IMG.innerHTML = newImage;
        ModalClose.addEventListener("click", () =>  {
            showRecentlyViewed(imgSources);
            MODAL.style.display = 'none';
        })
    }

    recentModalImage = (img, caption, imgSources) => {
        addRecent(imgSources)
        const MODAL = document.getElementById('modal');
        const MODAL_IMG = document.getElementById('modal-img')
        const ModalClose = document.getElementById('modal-close');
        MODAL.style.display = 'flex';
        let newImage = `<img src=${img} alt="" id="modal-img"> <h2>${caption}</h4>`
        MODAL_IMG.innerHTML = newImage;
        ModalClose.addEventListener("click", () =>  {
            showRecentlyViewed(imgSources);
            MODAL.style.display = 'none';
        })
    }

    showRecentlyViewed = (imgSources) => {
        console.log(imgSources)
        const RECENTLY_VIEWED = document.getElementById('recently-viewed');
        RECENTLY_VIEWED.innerHTML = ''
        recentlyViewed.forEach((img) => {
            let newImage = `<img src=${img.largeSquare} alt=""><p>${img.caption}<p>`
            const IMAGE_FIG = document.createElement('figure');
            IMAGE_FIG.innerHTML = newImage;
            RECENTLY_VIEWED.appendChild(IMAGE_FIG);
            IMAGE_FIG.addEventListener("click", () => {
                recentModalImage(img.large, img.caption, imgSources)
            });
        })
    }

    $(".nav-link").click(function () {
        flickrSearch($(this).text(), 12);
     });

    $(".recently-viewed").click(function () {
        showRecentlyViewed();
    });

    window.onload = flickrSearch('Australian Cities', 12);
})