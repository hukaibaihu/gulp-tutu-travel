function initGallery() {
  return new Swiper('.section-gellary .swiper', {
    // autoplay: { delay: 5e3 },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
    navigation: {
      prevEl: '.section-gellary .swiper-button-prev',
      nextEl: '.section-gellary .swiper-button-next',
    },
    pagination: {
      el: '.section-gellary .swiper-pagination',
    },
  });
}

$(function() {
  initGallery();

  setTimeout(() => {
    AOS.refresh();
  }, 50);
});
