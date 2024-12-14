const HEADER_SCROLL_DISTANCE = 160;
const HEADER_SHADOW_OPACITY = 0.15;
const HEADER_BACKGROUND_OPACITY = 1;

$.fn.serializeObject = function() {
  const o = {};
  const a = this.serializeArray();

  $.each(a, function() {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }

      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });

  return o;
};

$(function() {
  $('form.needs-validation').on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const isValid = this.checkValidity();

    $(this).addClass('was-validated');

    if (isValid) {
      console.log($(this).serializeObject());
    }
  });

  $(window).on('resize', () => {
    const vw = $(window).width();
    if (vw < 768) {
      $('section.section-hero-sub').siblings('header.header').addClass('header-translucent');
    } else {
      $('section.section-hero-sub').siblings('header.header')
        .removeClass('header-translucent translucent')
        .css('backgroundColor', '');
    }

    $(window).trigger('scroll');
  }).on('scroll', (e) => {
    const top = $(window).scrollTop();
    const precent = Math.min(top, HEADER_SCROLL_DISTANCE) / HEADER_SCROLL_DISTANCE;

    $('.header').css('boxShadow', `0 2px 3px rgba(0, 0, 0, ${precent * HEADER_SHADOW_OPACITY})`);
    $('.header.header-translucent').css('backgroundColor', `rgba(255, 255, 255, ${precent * HEADER_BACKGROUND_OPACITY})`);

    if (top >= HEADER_SCROLL_DISTANCE) {
      $('.header.header-translucent').removeClass('translucent');
    } else {
      $('.header.header-translucent').addClass('translucent');
    }
  }).trigger('resize');

  AOS.init();

  Fancybox.bind('[data-fancybox]');
});
