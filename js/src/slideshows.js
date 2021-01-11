//https://swiperjs.com/
import Swiper from 'swiper/bundle'; // import Swiper bundle with all modules installed

(($) => {

    //MAIN HERO SLIDESHOW
    var mainSwiper = new Swiper('.slideshow', {
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
	var testimonialSwiper = new Swiper('.slideshow-testimonial', {
		loop: true,
        autoplay:{
            delay: 7000, //7 seconds per slide
            disableOnInteraction: false
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			hideOnclick: false,
			clickable: true
		}
    });
    

    //INTERIOR GALLERY w/ THUMBNAILS
    // gallery thumbnails
	var galleryThumbs = new Swiper('.gallery-thumbs', {
		spaceBetween: 10,
		slidesPerView: 'auto',
		loop: false,
		freeMode: true
	});
	// gallery swiper
	var galleryTop = new Swiper('.gallery-slideshow', {
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
      


})(jQuery)