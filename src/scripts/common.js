const HEADER_SCROLL_DISTANCE = 160;
const HEADER_SHADOW_OPACITY = 0.15;
const HEADER_BACKGROUND_OPACITY = 1;

$(function() {
  $(window).on('scroll', (e) => {
    const top = $(window).scrollTop();
    const precent = Math.min(top, HEADER_SCROLL_DISTANCE) / HEADER_SCROLL_DISTANCE;

    $('.header').css({ boxShadow: `0 2px 3px rgba(0, 0, 0, ${precent * HEADER_SHADOW_OPACITY})` });
    $('.header.header-translucent').css({ backgroundColor: `rgba(255, 255, 255, ${precent * HEADER_BACKGROUND_OPACITY})` });

    if (top >= HEADER_SCROLL_DISTANCE) {
      $('.header.header-translucent').removeClass('translucent');
    } else {
      $('.header.header-translucent').addClass('translucent');
    }
  }).trigger('scroll');

  AOS.init();

  Fancybox.bind('[data-fancybox]');
});
