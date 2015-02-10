$(function(){

  // Header / section animation
  $("section.featured-work, header").each(function(idx, item){
    applyParallax(item, true);
  })
  $("section.featured-work, header").each(function(idx, item){
    applyParallax(item, false);
  })


});

function applyParallax(element, lockTop) {

  var w = $(window);
  var el = $(element);
  var elTop = el.offset().top;
  var elH = el.height();
  
  w.scroll(function(e){
    var top = w.scrollTop();
    var scrollVal = top - elTop;
    if (lockTop) {
      scrollVal = Math.min(elH, Math.max(scrollVal, 0));
    }
    el.css("background-position", "0 " + scrollVal/3 + "px");
  })
}
