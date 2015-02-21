$(function(){

  // Header / section animation
  var parallaxItems = $("section.featured-work, header.animate").map(function(idx, item){
    return applyParallax(item, false);
  })
  function applyTranslations(){
    if (shouldApplyParallax){
      for(var i=0; i< parallaxItems.length; i++) {
        var item = parallaxItems[i];
        item.css("background-position", item.backgroundPosition);
      }
      shouldApplyParallax = false;
    }
    window.requestAnimationFrame(applyTranslations);
  }
  applyTranslations();

  // External links for mardown content
  $("article a").attr("target", "_blank");


});

var shouldApplyParallax;
function applyParallax(element, lockTop) {

  var w = $(window);
  var el = $(element);
  var elTop = el.offset().top;
  var elH = el.height();
  
  w.scroll(function(e){
    shouldApplyParallax = true;
    var top = w.scrollTop();
    var scrollVal = top - elTop;
    if (lockTop) {
      scrollVal = parseInt(Math.min(elH, Math.max(scrollVal, 0)));
    }
    el.backgroundPosition = "0 " + scrollVal/3 + "px";
  });

  return el;
}
