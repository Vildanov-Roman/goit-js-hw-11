import './sass/index.scss';
import { getImg } from './js/pixybya';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchForm = document.querySelector(".search-form");
const searchFormInput = document.querySelector(".search-form__input");
const loadMore = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

let pagination;
let displayedImages;
let totalOfHits;
let lightbox;

searchForm.addEventListener("submit", onSearch);
// loadMore.addEventListener("click", onloadMore);
window.addEventListener('scroll', infinityScroll)

function onSearch(e) {
  e.preventDefault();
  // loadMore.style.display = "none"
  pagination = 1;
  displayedImages = 0;
  searchingImages();
  gallery.innerHTML = ""; 
}

function onloadMore() {
  pagination += 1;
  searchingImages();
}
//переписать на asinc/await
function searchingImages() {
    getImg(searchFormInput.value, pagination)
    .then(images => {
      renderImages(images);
    })
    .catch(error => console.log(error));
}

function renderImages({hits, totalHits}) {
  totalOfHits = totalHits;

  const markups = hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
  
      <div class="gallery__item">
        <a class="gallery__link" href="${largeImageURL}"><img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="gallery__info">
          <p class="info__item">
            <b class="info__label">Likes</b>
            <span class="info__data">${likes}</span>
          </p>
          <p class="info__item">
            <b class="info__label">Views</b>
            <span class="info__data">${views}</span>
          </p>
          <p class="info__item">
            <b class="info__label">Comments</b>
            <span class="info__data">${comments}</span>
          </p>
          <p class="info__item">
            <b class="info__label">Downloads</b>
            <span class="info__data">${downloads}</span>
          </p>
        </div>
      </div> 
  `)
  .join("");

  gallery.insertAdjacentHTML("beforeend", markups);

  if (typeof lightbox === "object") {
  lightbox.destroy();
  }

  lightbox = new SimpleLightbox(".gallery__item a");

  displayedImages += hits.length;
  // imgLeft();

  if (displayedImages === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else if (displayedImages > 0 && displayedImages === totalOfHits) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }

  if (pagination > 1) {
    const { height: cardHeight } = document.querySelector('.gallery .gallery__item').getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } 
}

// function imgLeft() {
//   if (totalOfHits === displayedImages) {
//     loadMore.style.display = "none";
//   } else {
//     loadMore.style.display = "block";
//   }
// }

function infinityScroll() {  
  const documentRect = document.documentElement.getBoundingClientRect();
  if(documentRect.bottom <= document.documentElement.clientHeight) {   
    
    onloadMore()
    

    window.onscroll = function() {
      let scrollElem = document.getElementById("scrollToTop");
      if (document.documentElement.scrollTop > document.documentElement.clientHeight) {
          scrollElem.style.opacity = "1";
      } else {
          scrollElem.style.opacity = "0";
      }
    }
    

    let timeOut;
    function goUp() {
    let top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    if(top > 0) {
        window.scrollBy(0, -100);
        timeOut = setTimeout('goUp()', 20);
      } else clearTimeout(timeOut);
    }
  }
};




