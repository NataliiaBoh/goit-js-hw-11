import { createMarcup } from "./js/render-functions";
import { searchImages } from "./js/pixabay-api";

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const formEl = document.querySelector(".js-search-form");
const imagesList = document.querySelector(".js-images-list");
const loaderEl = document.querySelector(".loader");

loaderEl.style.borderColor = 'white';
loaderEl.style.borderBottomColor = 'transparent';

formEl.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();
    
    imagesList.innerHTML = '';
    loaderEl.style.borderColor = 'black';
    loaderEl.style.borderBottomColor = 'transparent';

  const searchInput = event.currentTarget.querySelector('.search-input').value;

       searchImages(searchInput)
       .then(data => {
        // loaderEl.style.borderColor = 'white';
        // loaderEl.style.borderBottomColor = 'transparent';
        loaderEl.classList.add('loader');
        
        if (!data.hits.length) {
            iziToast.error({title: 'Error', messege: 'Sorry, there are no images matching your search query. Please try again!',})
        }
        return data;
    })
      
        .then (data => {imagesList.insertAdjacentHTML('beforeend', createMarcup(data.hits))

        const lightbox = new SimpleLightbox('.js-images-list a', {
          captions: true,
          captionsData: 'alt',
          captionDelay: 250,
        });

        lightbox.refresh();
       searchInput = '';
    })   

    .catch(error => {
      // loaderEl.style.display = 'none';
     
      if(error.length != undefined) {
        iziToast.error({
            title: 'Error',
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });
      }
      
    })
    .finally(() =>{
       loaderEl.classList.remove('loader')
      // loaderEl.style.borderColor = 'white';
      //   loaderEl.style.borderBottomColor = 'transparent';
      })
}
