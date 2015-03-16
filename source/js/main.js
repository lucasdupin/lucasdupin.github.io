$(function(){

  // Header / section animation
  var parallaxItems = $("section.featured-work, header.animate").map(function(idx, item){
    return applyParallax(item);
  });
  function applyTranslations(){
    if (shouldApplyParallax){
      for(var i=0; i< parallaxItems.length; i++) {
        var item = parallaxItems[i];
        var bg = item.find(".bg");
        if (bg.length > 0)
          bg.css("transform", "translate3d(0, " + item.backgroundPosition + "px, 0)");
        else
          item.css("background-position", "center " + item.backgroundPosition + "px");
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
function applyParallax(element) {

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
    el.backgroundPosition = Math.floor(scrollVal/3);
  };
  w.scroll(updatePositions);

  return el;
}
