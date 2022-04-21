/* globals jQuery */
//https://swiperjs.com/
import Swiper, {Navigation, Pagination, EffectFade, Parallax, A11y,} from 'swiper';

Swiper.use([Navigation,Pagination,EffectFade,Parallax,A11y]);

(($) => {

    //MAIN HERO SLIDESHOW
    const mainSwiper = new Swiper('.js-home-slideshow', {
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

    //TESTIMONIAL SLIDESHOW
	const testimonialSwiper = new Swiper('.js-testimonial-slideshow', {
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			hideOnclick: false,
			clickable: true
		}
    });

    // //INTERIOR GALLERY w/ THUMBNAILS
    const galleries = document.querySelectorAll('.gallery');

    galleries.forEach((gallery, index) => {

        let slider = gallery.querySelector('.js-gallery-slides');
        let thumbs = gallery.querySelector('.js-gallery-thumbs');

        const galleryThumbs = new Swiper(thumbs, {
            spaceBetween: 10,
            slidesPerView: 'auto',
            loop: false,
            freeMode: true
        });

        const galleryTop = new Swiper(slider, {
            loop: false,
            fadeEffect: { crossFade: true },
            effect: 'fade',
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: galleryThumbs,
            },
        });

    });
    

})(jQuery)