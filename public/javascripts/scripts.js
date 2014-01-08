/*jslint indent: 2, maxlen: 80*/
/*global $:true, document: true, setTimeout:true */

var Set = Set || {};

(function () {
  "use strict";

  Set.loadSlider = function () {
    $(".rslides").responsiveSlides({
      auto: false,
      speed: 1,
      timeout: 4000,
      pager: true,
      nav: true,
      random: false,
      pause: true,
      pauseControls: false,
      prevText: "←  ",
      nextText: "  →",
      maxwidth: "959",
      controls: "",
      namespace: "rslides"
    });
  }

  Set.attachKeyboardEvents = function () {
    $(document).keydown(function (e) {
      if (e.keyCode === 37) { // Left arrow
        $('a.prev').trigger('click');
        return false;
      }
      if (e.keyCode === 39) { // Right arrow
        $('a.next').trigger('click');
        return false;
      }
    });
  }

  Set.goToInitPosition = function () {
    setTimeout(function () {
      if (y === window.pageYOffset) {
        $('html, body').animate({
          scrollTop: $(".rslides").offset().top - 30
        }, 2000);
      }
    }, 1500);
  }
}());
