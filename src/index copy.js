import Notiflix from "notiflix";
import { fetchPhoto } from "./js/pixabay-api";
import { createMarkup } from "./js/markup";

export const refs = {
  searchf: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const perPage = 40;
let page = 1; 
let keyword = '';

refs.loadMoreBtn.classList.add('is-hidden');
refs.searchf.addEventListener('submit', onSearch);

function onSearch(lalala) {
  lalala.preventDefault();
  page = 1;
  refs.gallery.innerHTML = '';
  const { searchQuery } = lalala.currentTarger.elements;
  keyOfSearchPhoto = searchQuery.value.trim().toLowerCase();
  
  if (keyOfSearchPhoto === '') {
    Notiflix.Notify.info('Please,enter word')
    return
  }
  fetchPhoto(keyOfSearchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry,there are no images'
        );
      } else {
        Notiflix.Notify.success(`We found ,what'd you search ${data.totalHits}`)
        createMarkup(searchResults)
      }
      if (data.totalHits > perPage) {
        refs.loadMoreBtn.classList.remove('is-hidden');
        window.addEventListener('scroll', onInfiniteScroll);
      }
    })
    .catch(onFetchError);
  refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
  lalala.currentTarger.reset();
}

function onLoadMoreClick() {
  page++;
  fetchPhoto(keyOfSearchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      const numberOfLastPage = Math.ceil(data.totalHits / perPage)

      createMarkup(searchResults);
      if (page === numberOfLastPage) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info('You have reached last page');
        refs.loadMoreBtn.removeEventListener('click', onLoadMoreClick)
        window.removeEventListener('scroll', onInfiniteScroll);

      }
    })
    .catch(onFetchError);
}
function onFetchError() {
  Notiflix.Notify.failure('Oops! Something went wrong')
}
function onInfiniteScroll() {
  if (
    window.innerHeight + window.scrollY >= 
    document.documentElement.scrollHeight
  ) {
    onLoadMoreClick()
  }
}