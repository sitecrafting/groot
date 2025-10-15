//https://swiperjs.com/
import Swiper from 'swiper';
import {Navigation, Pagination, EffectFade, Parallax, A11y} from 'swiper/modules';

//import swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
import 'swiper/css/a11y';

const heroSlideshow = document.querySelector('.js-home-slideshow');

if( heroSlideshow ){
    //MAIN HERO SLIDESHOW
    const mainSwiper = new Swiper(heroSlideshow, {
        modules: [EffectFade,Pagination,Navigation,Parallax,A11y],
        effect: 'fade',
        loop: false,
        parallax: true,
        a11y: {
            enabled: true,
            slideLabelMessage: 'Slide {{index}} of {{slidesLength}}',
        },
        navigation: {
            addIcons: false,
            nextEl: heroSlideshow.querySelector('.swiper-button-next'),
            prevEl: heroSlideshow.querySelector('.swiper-button-prev')
        },
        pagination: {
            el: heroSlideshow.querySelector('.swiper-pagination'),
            type: 'bullets',
            hideOnclick: false,
            clickable: true
        }
    });
}