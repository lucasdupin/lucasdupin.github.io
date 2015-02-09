$(function(){
  console.log("alive");

  // Header animation
  applyParallax($("header")[0]);


});

function applyParallax(element) {

  var w = $(window);
  var el = $(element);
  var elTop = el.offset().top;
  var elH = el.height();
  
  w.scroll(function(e){
    var top = w.scrollTop();
    var scrollVal = top - elTop;
    scrollVal = Math.min(elH, Math.max(scrollVal, 0));
    el.css("background-position", "0 " + scrollVal/3 + "px");
  })
}
