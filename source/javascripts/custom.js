var urlTumblrFr = "http://api.tumblr.com/v2/blog/compagniebasinga.tumblr.com/posts?api_key=FfIlzJqm0WOMhc5tQoE3ALHnxIHbx9lqGfdfXBhw6KA30VMyNU";
var calendarFr = 'cie.basinga@gmail.com';
var calendarEn = 'dabodnvf7hta8hu6ms71mb33is@group.calendar.google.com';

// set padding for main container
PaddingTop = function () {
  var navBarHeight = $('.navbar-basinga').height();
  $('.basinga-section').css('padding-top', navBarHeight+'px');
}

GalleryDuoSpecific = function(galleryId) {
  if (galleryId == '#gallery__duo') {
    $(galleryId).delay('fast')
    .addClass('gallery--shown')
    .fadeIn('fast', function() {
      if ($('#duo__slider li', galleryId).length != 0) {
              var duoSlider =$('#duo__slider').bxSlider({video: true});
              $('.bx-prev').hide();
              $('.btn-gallery').on('click', function() {
                duoSlider.destroySlider()
              })
      };
    });
  } else {
    $(galleryId).delay('fast').addClass('gallery--shown').fadeIn('fast');
  }
};

// submenu animation for gallery and news sections
MenuAnimation = function(btn) {
  var $btns = $(btn);
  $btns.on('click', function() {
        var $this = $(this);
        // Hide current label, show current label in title
        $btns.removeClass('active');
        $this.addClass('active');
        if (btn == '.btn-gallery'){
          // add text change on upside div
          var galleryId = '#gallery__'+$this.attr('id');
          $('.gallery--shown').fadeOut('fast').removeClass('.gallery--shown');
          GalleryDuoSpecific(galleryId);
        } else if (btn == '.btn-actu'){
          // add text change on upside div
          var actuId = '#actu__'+$this.attr('id');
          $('.actu--shown').fadeOut('fast').removeClass('.actu--shown');
          $(actuId).delay('fast').fadeIn('fast').addClass('actu--shown');
        }
  });
};
// end of submenu animation for gallery and news sections



// Gallery Image navigation
ImgClickMenuChange = function(target) {
  var $btns = $('.btn-gallery');
  $btns.removeClass('active');
  $('#'+target).addClass('active');
  // add text change on upside div
  var galleryId = '#gallery__'+target;
  $('.gallery--shown').fadeOut('fast').removeClass('.gallery--shown');
  GalleryDuoSpecific(galleryId);
  // end Gallery Image Navigation
};

// Fixe height of responsive slider in Gallery Modals
ResizeModalImg = function (target) {
  var windowHeight = $(window).height();
  var headerHeight = $('.modal__header', target).height();
  var paragraphHeight = $('.modal__content', target).height();
  // 100px margin bottom
  var maxImgHeight = windowHeight-paragraphHeight-100;
  $('img', target).css('max-height', maxImgHeight+'px');
};

GetBlog = function (url) {
  $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(posts){
        var postings = posts.response.posts;
        var text = '';
        for (var i in postings) {
         var p = postings[i];
         // si le post est du texte
         if (p.type == 'text') {
          text += "<div class='blog__post'><h1>"+p.title+"</h1>"+p.body+"</div>";
         }
         // si le post est un post photos
         else if (p.type == 'photo') {
          var photos = p.photos;
          var photoLinks = [];
          $.each(photos, function(index) {
            photoLinks += "<img class='blog--image img-responsive' src=" + p.photos[index].original_size.url +">"
          });
          text+= "<div class='blog__post'><h1>"+p.slug+"</h1>"+photoLinks+"</div>"
         }
         // si le post est un post video
         else if (p.type == 'video') {
          text+= "<div class='blog__post blog--video'><h1>" + p.slug + "</h1>"+p.player[2].embed_code+"</div>"
         }
         // si post audio
         else if (p.type == 'audio') {
          text+= "<div class='blog__post blog--audio'><h1>" + p.slug + "</h1>" +p.player+"</div>"
         }
         // si post chat
         else if (p.type == 'chat') {
          var chat = p.dialogue
          var chatLinks = [];
          $.each(chat, function(index) {
            chatLinks += "<p>" + chat[index].name+ ":"+ chat[index].phrase +"</p>"
          });
          text += "<div class='blog__post'><h1>" + p.slug + "</h1>"+chatLinks+"</div>"
         }
         // si post lien
         else if (p.type == 'link') {
          text += "<div class='blog__post'><h1>"+p.title+"</h1><a href="+p.url+">"+p.description+"</a></div>"
         }
         // si post citation
         else if (p.type == 'quote') {
          text += "<div class='blog__post'><p class='quote'>'"+p.text+"'<p class='quote--source'>-'"+p.source+"'</p></p></div>"
         }
        }
        $('.tumblr').append(text);
        $('.blog--video').fitVids();
        $('iframe','.blog--audio').css({
          'width': '90%',
          'height': 'auto',
        })
      }
  });
};

GetCalendar = function (calendarId, lang) {
 $('#calendar').fullCalendar({
         // put your options and callbacks here
        lang: lang,
         header: {
                 left: 'title',
                 center: '',
                 right: 'prev,next'
               },
         height: 'auto',
         handleWindowResize: false,
         eventBorderColor: 'rgb(117,70,52)',
         eventBackgroundColor: 'rgb(138,82,61)',

         googleCalendarApiKey: 'AIzaSyDRsUrtXiNamLbMWAUHRspg7jxaP0m3Pzs',
         events: {
             googleCalendarId: calendarId
         },
         eventClick: function(calEvent, jsEvent, view) {
           jsEvent.preventDefault();
                 $(this).popover({
                     html: true,
                     title: calEvent.title + '<i class="fa fa-times fa-lg pull-right close-slide"></i>',
                     content: '<p>'+calEvent.description+'</p><p>'+calEvent.location+'</p>',
                     placement: 'auto',
                     container: 'body',
                     trigger: 'focus',
                                 });
                 $(this).popover('show');
                 // hide the popover if click (safari bug fix)
                 $('body').on('click', '.popover', function () {$(this).fadeOut('fast')});
             }
     });
}

// end of gallery modal

$(document).ready(function () {
  PaddingTop();
  if ($('.basinga-section').attr('id') == 'gallery') {

        // execute if gallery page

        MenuAnimation('.btn-gallery');
        $('.video').fitVids();
        $('.image-wrapper').on('click', function () {
          var modalId = $(this).attr('data-target');
          var $modal = $(modalId);
          if ($('.project-slide', modalId).length != 0 ) {
            $modal.fadeIn('slow');
            ResizeModalImg(modalId);
            var slider = $('.project-slide', modalId).bxSlider({
              adaptiveHeight: true,
              video: true,
              controls: true,
              pager: true,
              mode: 'fade',
            });
            $('.bx-prev').hide();
            $(window).resize( function() {
              ResizeModalImg(modalId);
            });
            $('.close-slide').on('click', function () {
                $modal.fadeOut('slow').promise().done( function() {
              // destroy the slider
                  slider.destroySlider();
                });
            });
          } else if ($(this).attr('data-target') == 'duo' ) {
            var duo = $(this).attr('data-target');
            ImgClickMenuChange(duo);
            window.scrollTo(0, 0);
          } else if ($(this).attr('data-target') == 'tangente' ) {
            var tangente = $(this).attr('data-target');
            ImgClickMenuChange(tangente);
            window.scrollTo(0, 0);
          } else if ($(this).attr('data-target') == 'traversee' ) {
            var traversee = $(this).attr('data-target');
            ImgClickMenuChange(traversee);
            window.scrollTo(0, 0);
          } else if ($(this).attr('data-target') == 'union') {
            var union = $(this).attr('data-target');
            ImgClickMenuChange(union);
            window.scrollTo(0, 0);
          } else {
            $modal.fadeIn('slow');
            ResizeModalImg(modalId);
            $(window).resize( function () {
              ResizeModalImg(modalId);
            });
            $('.close-slide').on('click', function () {
              $modal.fadeOut('slow');
            });
          };
        })
      // end of gallery page

  } else if ($('.basinga-section').attr('id') == 'actu'){
      MenuAnimation('.btn-actu');
    // execute if actu page
      // get Blog content
        // For now only in Fr, display english content in the same post
         GetBlog(urlTumblrFr);
       // end of blog content
    if ($('.fr').length != 0) {
      GetCalendar(calendarFr, 'fr');
    } else {
      GetCalendar(calendarEn, 'en');
    }
      // end of actu page
      // about page
  } else if ($('#teaser')) {
    $('#teaser').fitVids();
      // end about
  }
  $(window).resize( function () {
    PaddingTop();
  });

})