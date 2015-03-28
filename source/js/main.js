$(function(){

  // Header / section animation
  var parallaxItems = $("[data-parallax]").map(function(idx, item){
    return applyParallax(item);
  });

  // External links for mardown content
  $("article a").attr("target", "_blank");

});

function applyParallax(element) {

  var w = $(window);
  var el = $(element);
  var elTop = el.position().top;
  var elH = el.height();
  var elW = el.width();
  var imageURL = el.data("parallax");
  console.log("background image:", imageURL)
  w.resize(function(e){
    elTop = el.position().top;
    backgroundEl.css("height", el.height());
    backgroundEl.css("width", el.width());
    updatePositions();
  })

  var backgroundEl = $("<div class='parallax-element'><img src='"+imageURL+"'></div>")
  var parallaxContainer = $("#parallax-container");
  parallaxContainer.append(backgroundEl)
  var backgroundImage = $("img", backgroundEl);
  //
  backgroundEl.css("height", el.height());
  backgroundEl.css("width", el.width());
  el.css("background","transparent")
  
  function updatePositions(e){
    var top = w.scrollTop();
    var scrollVal = top - elTop;
    var backgroundPosition = Math.floor(scrollVal/3);
    //
    backgroundEl.css("transform", "translate3d(0, " + (-scrollVal) + "px, 0)");
    backgroundImage.css("transform", "translate3d(0, " + (backgroundPosition) + "px, 0)");
  };
  updatePositions();
  w.scroll(updatePositions);

  return el;
}
