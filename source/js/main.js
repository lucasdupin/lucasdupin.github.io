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
  var elTop = el.position().top;
  var elH = el.height();
  w.resize(function(e){
    elTop = el.position().top;
    elH = el.height();
    updatePositions();
  })
  
  
  function updatePositions(e){
    shouldApplyParallax = true;
    var top = w.scrollTop();
    var scrollVal = top - elTop;
    if (lockTop) {
      scrollVal = parseInt(Math.min(elH, Math.max(scrollVal, 0)));
    }
    el.backgroundPosition = "center " + Math.floor(scrollVal/3) + "px";
  };
  w.scroll(updatePositions);

  return el;
}
