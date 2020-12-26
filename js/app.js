/**
 * jQuery.Preload - Multifunctional preloader
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com
 * Dual licensed under MIT and GPL.
 * Date: 3/25/2009
 * @author Ariel Flesler
 * @version 1.0.8
 */

;(function($){var h=$.preload=function(c,d){if(c.split)c=$(c);d=$.extend({},h.defaults,d);var f=$.map(c,function(a){if(!a)return;if(a.split)return d.base+a+d.ext;var b=a.src||a.href;if(typeof d.placeholder=='string'&&a.src)a.src=d.placeholder;if(b&&d.find)b=b.replace(d.find,d.replace);return b||null}),data={loaded:0,failed:0,next:0,done:0,total:f.length};if(!data.total)return finish();var g=$(Array(d.threshold+1).join('<img/>')).load(handler).error(handler).bind('abort',handler).each(fetch);function handler(e){data.element=this;data.found=e.type=='load';data.image=this.src;data.index=this.index;var a=data.original=c[this.index];data[data.found?'loaded':'failed']++;data.done++;if(d.enforceCache)h.cache.push($('<img/>').attr('src',data.image)[0]);if(d.placeholder&&a.src)a.src=data.found?data.image:d.notFound||a.src;if(d.onComplete)d.onComplete(data);if(data.done<data.total)fetch(0,this);else{if(g&&g.unbind)g.unbind('load').unbind('error').unbind('abort');g=null;finish()}};function fetch(i,a,b){if(a.attachEvent&&data.next&&data.next%h.gap==0&&!b){setTimeout(function(){fetch(i,a,1)},0);return!1}if(data.next==data.total)return!1;a.index=data.next;a.src=f[data.next++];if(d.onRequest){data.index=a.index;data.element=a;data.image=a.src;data.original=c[data.next-1];d.onRequest(data)}};function finish(){if(d.onFinish)d.onFinish(data)}};h.gap=14;h.cache=[];h.defaults={threshold:2,base:'',ext:'',replace:''};$.fn.preload=function(a){h(this,a);return this}})(jQuery);


$(function() {
  works = new Array();
  // position (rotate) works
  $('.container-chaos li').each(function(index) {
      function getPlusMinus() {
        var plusMinus = ['-', '+'];
        return plusMinus[Math.floor(Math.random() * plusMinus.length)];
      }

      var docWidth = $(document).width();
      var posx = (Math.random() * (docWidth - 470));
      var posy = (Math.random() * 2700);
      var rota = (Math.random() * 0);
      var sign = getPlusMinus();
      $(this).css({'left': posx+'px', 'top': posy+'px', '-webkit-transform': 'rotate('+sign+rota+'deg)', '-moz-transform': 'rotate('+ sign+rota+'deg)', '-o-transform': 'rotate('+sign+rota+'deg)', '-ms-transform': 'rotate('+sign+rota+'deg)'});
      works[index] = {id: $(this).attr('id'), top: posy, rotate: rota, sign: sign};
  });

  // make works draggable
  $('.container-chaos li').draggable();

  // works hover (to front -> zindex, plus title text)
  $('.container-chaos li').hover(function() {
    var idxHighest = 0;
    $('.container-chaos li').each(function() {
      var idxCur = parseInt($(this).css('zIndex'), 10);
      if(idxCur > idxHighest) idxHighest = idxCur;
    });
    $(this).css({zIndex: idxHighest+1});

    var txt = $(this).data('hover');
    $('#info').html(txt);
  }, function() {
    $('#info').html('');
  });

  // zoom rotate works
  $('.container-chaos li').click(function() {
    $this = $(this);
    var href = $this.find('a').attr('href');
    var thumb = $this.find('.thumb');

    // return to default state
    if($this.hasClass('big')) {
      $('.container-chaos li').not(this).each(function() {
        formerObj = findObjectById($(this).attr('id'));
        $(this).animate({centered: formerObj.centered}, 0);
        //JTE EDIT from top to centered//
      });

      formerObj = findObjectById($this.attr('id'));
      thumb.transition({scale: [1, 1]});
      $this.transition({rotate: formerObj.sign + formerObj.rotate + 'deg'});
      $this.removeClass('big');
    } else {
      $('.container-chaos li').not(this).animate({centered: 3600}, 1000);
      //JTE edit from "top"
      // $('.container-chaos li').not(this).animate({top: 7200}, 1000);

      var img = new Image();
      img.src = href;

      $(img).preload({
        onFinish: function() {
          var scaleX = img.width / thumb.width();
          var scaleY = img.height / thumb.height();

          thumb.attr('src', href);
          $this.transition({rotate: '0deg'});
          thumb.transition({scale: [scaleX, scaleY]});
        }
      });

      $this.addClass('big');
    }

    return false;
  });
});

function findObjectById(id) {
  return $.grep(works, function(value, key){
    return value.id == id;
  })[0];
}
