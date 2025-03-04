/* globals jQuery */
//https://swiperjs.com/
import Swiper from 'swiper';
import {Navigation, Pagination, EffectFade, Parallax, A11y, Autoplay, FreeMode, Thumbs} from 'swiper/modules';

(($) => {

    //MAIN HERO SLIDESHOW
    const mainSwiper = new Swiper('.js-home-slideshow', {
        modules: [EffectFade,Pagination,Navigation,Parallax,A11y,Autoplay],
        effect: 'fade',
        loop: true,
        parallax: true,
        autoplay:{
            delay: 7000, //7 seconds per slide
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            hideOnclick: false,
            clickable: true
        }
    });


    //INTERIOR GALLERY w/ THUMBNAILS
    const galleries = document.querySelectorAll('.gallery');

    galleries.forEach((gallery, index) => {

        let slider = gallery.querySelector('.js-gallery-slides');
        let thumbs = gallery.querySelector('.js-gallery-thumbs');
        let prev = gallery.querySelector('.swiper-button-prev');
        let next = gallery.querySelector('.swiper-button-next');

        const galleryThumbs = new Swiper(thumbs, {
            modules: [FreeMode],
            spaceBetween: 10,
            slidesPerView: 'auto',
            loop: false,
            freeMode: true
        });

        const galleryTop = new Swiper(slider, {
            modules: [EffectFade,Navigation,A11y,Thumbs],
            loop: false,
            fadeEffect: { crossFade: true },
            effect: 'fade',
            navigation: {
                nextEl: next,
                prevEl: prev,
            },
            thumbs: {
                swiper: galleryThumbs,
            },
        });

    });

})(jQuery)