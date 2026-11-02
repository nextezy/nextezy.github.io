/* Фон шапки: анимация лого Nextezy.
   Видео начинает грузиться только после полной загрузки страницы,
   не грузится при экономии трафика и при отключённой в системе анимации (тогда остаётся неподвижный кадр). */
(function(){
  function start(){
    var box=document.querySelector(".hero-bg"); if(!box) return;
    var c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    if(c&&(c.saveData||/(^|-)2g$/.test(c.effectiveType||""))) return;
    if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var v=document.createElement("video");
    v.muted=true; v.loop=true; v.autoplay=true; v.playsInline=true;
    v.setAttribute("muted",""); v.setAttribute("playsinline",""); v.setAttribute("aria-hidden","true");
    v.preload="auto"; v.src=box.getAttribute("data-video");
    v.addEventListener("playing",function(){ v.classList.add("on"); });
    box.appendChild(v);
    var p=v.play(); if(p&&p.catch) p.catch(function(){ v.remove(); });
    /* пауза, когда шапку не видно или вкладка свёрнута: не грузим процессор зря */
    var vis=true;
    function sync(){ if(!v.isConnected) return; if(vis&&!document.hidden){ var q=v.play(); if(q&&q.catch) q.catch(function(){}); } else v.pause(); }
    if("IntersectionObserver" in window) new IntersectionObserver(function(es){ vis=es[0].isIntersecting; sync(); }).observe(box);
    document.addEventListener("visibilitychange",sync);
  }
  if(document.readyState==="complete") start(); else window.addEventListener("load",start);
})();
