
$.js = function (el) {
    return $('[data-js=' + el + ']')
};
 
/**
*
* @param d
* @returns {string}
* @private
*/
function _pad(d) {
  return (d < 10) ? '0' + d.toString() : d.toString();
}

var _img;
function isImageOk(img) {
    _img = img.data('img');
    if (typeof _img === 'undefined') { 
        var _img = new Image();
        _img.src = img.attr('src');
        img.data('img', _img);
    }
    if (!_img.complete) {
        return false;
    }
    if (typeof _img.naturalWidth !== "undefined" && _img.naturalWidth === 0) {
        return false;
    }
    return true;
}
var imagesToLoad = null;

(function ($) {  
    $.fn.queueLoading = function () {
        var maxLoading = 2;
        var images = $(this);
        if (imagesToLoad === null || imagesToLoad.length === 0) {
            imagesToLoad = images;
        } else {
            imagesToLoad = imagesToLoad.add(images); 
        }
        var imagesLoading = null;

        function checkImages() {
            imagesLoading = imagesToLoad.filter('.is-loading');
            imagesLoading.each(function () {
                var image = $(this);
                if (isImageOk(image)) {
                    image.addClass('is-loaded').removeClass('is-loading');
                    image.trigger('loaded');
                }
            });
            imagesToLoad = images.not('.is-loaded');
            loadNextImages();
        }

        function loadNextImages() {
            imagesLoading = imagesToLoad.filter('.is-loading');
            var nextImages = imagesToLoad.slice(0, maxLoading - imagesLoading.length);
            nextImages.each(function () {
                var image = $(this);
                if (image.hasClass('is-loading')) return;
                image.attr('src', image.attr('data-src'));
                image.addClass('is-loading');
            });
            if (imagesToLoad.length != 0) setTimeout(checkImages, 25);
        }

        checkImages();
    };
}(jQuery));

var  
    slideshow,
    slideshowDuration = 4000,
    loaderAnim = true; 


function sliderArrows() {
  $('.slideshow .arrows .arrow').on('click', function () {
    TweenMax.to($('.page.is-active i.is-animating'), 1, { x: '101%' });
    slideshowNext($(this).closest('.slideshow'), $(this).hasClass('prev'), false);
    loaderAnim = false;
  });

  $('.slideshow').each(function(){
    var $this = $(this);
    var mc = new Hammer(this);
    mc.on("swipe", function(ev) {
      if(ev.direction === 4) {
        slideshowNext($(ev.target).closest('.slideshow'), true, false); 
      } else if(ev.direction === 2) {
        slideshowNext($(ev.target).closest('.slideshow'), false, false);
      } else {
        return false; 
      }
    });
  });
}


function sliderPages() {
  $('.slideshow .pages .page').on('click', function () {
    TweenMax.to($('.page.is-active i.is-animating'), 1, { x: '101%' });
    slideshowSwitch($(this).closest('.slideshow'), $(this).index(), true);
    loaderAnim = true;
  });

  $('.slideshow .pages').on('check', function () {
    var pages = $(this).find('.page'),
        index = slideshow.find('.slides .is-active').index();
    pages.removeClass('is-active');
    pages.eq(index).addClass('is-active');
    sliderNavloader();
  });
}


function homeSlider() {


  sliderNavloader();


  $('img.queue-loading').queueLoading();

  $('[data-js="slider"]').each(function () {
    slideshow = $(this);
    var images = slideshow.find('.image').not('.is-loaded');
    images.on('loaded', function () {
      var image = $(this);
      var slide = image.closest('.slide');
      slide.addClass('is-loaded');
    });
    images.queueLoading();
    var timeout = setTimeout(function () {
      slideshowNext(slideshow, false, true);
      loaderAnim = true;
    }, slideshowDuration);
    slideshow.data('timeout', timeout);
  });
}

/**
*
* @param slideshow
* @param index
* @param auto
*/
function slideshowSwitch(slideshow, index, auto) {
  if (slideshow.data('wait')) {
    return;
  }
  var slides = slideshow.find('.slide'),
      pages = slideshow.find('.pages'),
      activeSlide = slides.filter('.is-active'),
      activeSlideImage = activeSlide.find('.image-container'),
      newSlide = slides.eq(index),
      newSlideImage = newSlide.find('.image-container'),
      newSlideContent = newSlide.find('.slide__slide-content'),
      newSlideElements = newSlide.find('.slide__slide-content > *'),
      timeout = slideshow.data('timeout'),
      transition = slideshow.attr('data-transition');

  if (newSlide.is(activeSlide)) {
    return;
  }
  newSlide.addClass('is-new');
  clearTimeout(timeout);
  slideshow.data('wait', true);

  if (transition === 'fade') {
    newSlide.css({ display: 'block', zIndex: 2 });
    newSlideImage.css({ opacity: 0 });
    TweenMax.to(newSlideImage, 1, {
      alpha: 1, onComplete: function () {
        newSlide.addClass('is-active').removeClass('is-new');
        activeSlide.removeClass('is-active');
        newSlide.css({display: '', zIndex: ''});
        newSlideImage.css({opacity: ''});
        slideshow.find('.pages').trigger('check');
        slideshow.data('wait', false);
        if (auto) {
          timeout = setTimeout(function () {
            slideshowNext(slideshow, false, true);
          }, slideshowDuration);
          slideshow.data('timeout', timeout);
        }
      }
    });
  } else if(transition === 'transform') {



  } else {
    if (newSlide.index() > activeSlide.index()) {
      var newSlideRight = 0,
          newSlideLeft = 'auto',
          newSlideImageRight = -slideshow.width() / 8,
          newSlideImageLeft = 'auto',
          newSlideImageToRight = 0,
          newSlideImageToLeft = 'auto',
          newSlideContentLeft = 'auto',
          newSlideContentRight = 0,
          activeSlideImageLeft = -slideshow.width() / 4;
    } else {
      var newSlideRight = '',
          newSlideLeft = 0,
          newSlideImageRight = 'auto',
          newSlideImageLeft = -slideshow.width() / 8,
          newSlideImageToRight = '',
          newSlideImageToLeft = 0,
          newSlideContentLeft = 0,
          newSlideContentRight = 'auto',
          activeSlideImageLeft = slideshow.width() / 4;
    }

    newSlide.css({display: 'block', width: 0, right: newSlideRight, left: newSlideLeft, zIndex: 2});
    newSlideImage.css({width: slideshow.width(), right: newSlideImageRight, left: newSlideImageLeft});
    newSlideContent.css({width: slideshow.width(), left: newSlideContentLeft, right: newSlideContentRight});
    activeSlideImage.css({ left: 0 });

    TweenMax.set(newSlideElements, { y: 20, force3D: true });
    TweenMax.to(activeSlideImage, 1, { left: activeSlideImageLeft, ease: Expo.easeInOut });
    TweenMax.to(newSlide, 1, { width: slideshow.width(), ease: Expo.easeInOut });
    TweenMax.to(newSlideImage, 1, {
      right: newSlideImageToRight,
      left: newSlideImageToLeft,
      ease: Expo.easeInOut
    });

    TweenMax.staggerFromTo(newSlideElements, 0.8, {alpha: 0, y: 60}, {
      alpha: 1,
      y: 0,
      ease: Expo.easeOut,
      force3D: true,
      delay: 0.6
    }, 0.1, function () {
      newSlide.addClass('is-active').removeClass('is-new');
      activeSlide.removeClass('is-active');
      newSlide.css({ display: '', width: '', left: '', zIndex: '' });
      newSlideImage.css({ width: '', right: '', left: '' });
      newSlideContent.css({ width: '', left: '' });
      newSlideElements.css({ opacity: '', transform: '' });
      activeSlideImage.css({ left: '' });
      slideshow.find('.pages').trigger('check');
      slideshow.data('wait', false);
      if (auto) {
        timeout = setTimeout(function () {
          slideshowNext(slideshow, false, true);
        }, slideshowDuration);
        slideshow.data('timeout', timeout);
      }
    });
  }


  $.js('counter-from').html(_pad(newSlide.index() + 1));
}

/**
*
* @param slideshow
* @param previous
* @param auto
*/
function slideshowNext(slideshow, previous, auto) {
  var slides = slideshow.find('.slide'),
      activeSlide = slides.filter('.is-active'),
      newSlide = null;
  if (previous) {
    newSlide = activeSlide.prev('.slide');
    if (newSlide.length === 0) {
      newSlide = slides.last();
    }
  } else {
    newSlide = activeSlide.next('.slide');
    if (newSlide.length === 0) {
      newSlide = slides.filter('.slide').first();
    }
  }

  slideshowSwitch(slideshow, newSlide.index(), auto);
}


function sliderNavloader() {
  if($('.page.is-active').length > 0) {
    var $self = $('.page.is-active i');
    $self.addClass('is-animating');

    TweenMax.fromTo($self, 4, { x: '-100%' }, { x: '0%', onComplete: function() {
      if(loaderAnim === true) {
        TweenMax.to($self, 1, { x: '101%', onComplete: function() {
          // TweenMax.to($self, 0, { x: '-101%' });
          $self.removeClass('is-animating');
        } });
      }
    }});
  }
}

sliderArrows(); 
sliderPages();  
homeSlider();



