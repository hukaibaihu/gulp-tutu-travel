var HEADER_SCROLL_DISTANCE=160,HEADER_SHADOW_OPACITY=.15,HEADER_BACKGROUND_OPACITY=1;$(function(){$(window).on("scroll",function(a){var n=$(window).scrollTop(),r=Math.min(n,HEADER_SCROLL_DISTANCE)/HEADER_SCROLL_DISTANCE;$(".header").css({boxShadow:"0 2px 3px rgba(0, 0, 0, ".concat(r*HEADER_SHADOW_OPACITY,")")}),$(".header.header-translucent").css({backgroundColor:"rgba(255, 255, 255, ".concat(r*HEADER_BACKGROUND_OPACITY,")")}),HEADER_SCROLL_DISTANCE<=n?$(".header.header-translucent").removeClass("translucent"):$(".header.header-translucent").addClass("translucent")}).trigger("scroll"),AOS.init(),Fancybox.bind("[data-fancybox]")});