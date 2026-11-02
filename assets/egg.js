/* Пасхалка: уставшая Секстези в подвале. Шанс 20% каждый раз, когда доходишь до подвала. */
(function(){
  var foot=document.querySelector("footer .wrap");
  if(!foot||!("IntersectionObserver" in window)) return;
  var CHANCE=0.2, me=document.currentScript, base=me?me.src.replace(/egg\.js.*$/,""):"assets/";
  var box=null, btn=null, wasIn=false;
  function build(){
    box=document.createElement("div"); box.className="sx";
    box.innerHTML='<div class="sx-clip"><button type="button" class="sx-btn" aria-label="Секстези"><img src="'+base+'sextezy-tired.webp" alt="" width="600" height="395"></button></div><div class="sx-say" role="status">Сделай-ка мне кофейку</div>';
    foot.appendChild(box); btn=box.querySelector(".sx-btn");
    var fine=window.matchMedia&&matchMedia("(hover: hover) and (pointer: fine)").matches;
    if(fine){ btn.addEventListener("mouseenter",function(){box.classList.add("talk")}); btn.addEventListener("mouseleave",function(){box.classList.remove("talk")}); }
    btn.addEventListener("click",function(){ box.classList.toggle("talk"); });
  }
  function show(){
    if(!box) build();
    var img=box.querySelector("img");
    function go(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ box.classList.add("on"); }); }); }
    if(img.complete) go(); else img.addEventListener("load",go,{once:true});
  }
  function hide(){ if(box){ box.classList.remove("on","talk"); } }
  new IntersectionObserver(function(es){
    var e=es[0];
    if(e.isIntersecting&&!wasIn){ wasIn=true; if(Math.random()<CHANCE) show(); }
    else if(!e.isIntersecting&&wasIn){ wasIn=false; hide(); }
  },{threshold:0.4}).observe(foot);
})();
