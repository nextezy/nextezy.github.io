/* Фон шапки: анимация лого Nextezy.
   Видео начинает грузиться только после полной загрузки страницы,
   не грузится при экономии трафика и при отключённой в системе анимации (тогда остаётся неподвижный кадр).
   На слабых ПК (браузер сообщает 4 ядра или меньше, или 4 ГБ памяти и меньше) сама не включается.
   Кнопка в углу шапки выключает и включает анимацию; выбор запоминается в браузере (nx-anim = off / on). */
(function(){
  var KEY="nx-anim", v=null, vis=true, btn=null;
  function getPref(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function setOff(off){ try{ localStorage.setItem(KEY,off?"off":"on"); }catch(e){} }
  function weak(){ var n=navigator.hardwareConcurrency, m=navigator.deviceMemory; return (n&&n<=4)||(m&&m<=4); }
  var I_PAUSE='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/></svg>';
  var I_PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>';
  function setBtn(on){
    if(!btn) return;
    var t=on?"Выключить анимацию":"Включить анимацию";
    btn.innerHTML=on?I_PAUSE:I_PLAY; btn.title=t; btn.setAttribute("aria-label",t); btn.setAttribute("aria-pressed",on?"false":"true");
  }
  function sync(){ if(!v) return; if(vis&&!document.hidden){ var q=v.play(); if(q&&q.catch) q.catch(function(){}); } else v.pause(); }
  function startVideo(box){
    if(v) return;
    v=document.createElement("video");
    v.muted=true; v.loop=true; v.autoplay=true; v.playsInline=true;
    v.setAttribute("muted",""); v.setAttribute("playsinline",""); v.setAttribute("aria-hidden","true");
    v.preload="auto"; v.src=box.getAttribute("data-video");
    v.addEventListener("playing",function(){ v&&v.classList.add("on"); });
    box.appendChild(v);
    var p=v.play(); if(p&&p.catch) p.catch(function(){ stopVideo(); setBtn(false); });
  }
  function stopVideo(){
    if(!v) return; var old=v; v=null;
    old.classList.remove("on"); old.pause();
    setTimeout(function(){ old.removeAttribute("src"); old.load(); old.remove(); },1300); /* дать кадру плавно смениться */
  }
  function start(){
    var box=document.querySelector(".hero-bg"); if(!box) return;
    var hero=box.parentNode;
    btn=document.createElement("button"); btn.type="button"; btn.className="anim-btn";
    hero.appendChild(btn);
    var c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    var pref=getPref();
    var auto=pref!=="off" && (pref==="on"||!weak())
      && !(c&&(c.saveData||/(^|-)2g$/.test(c.effectiveType||"")))
      && !(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setBtn(auto);
    if(auto) startVideo(box);
    btn.addEventListener("click",function(){
      if(v){ stopVideo(); setOff(true); setBtn(false); }
      else { setOff(false); setBtn(true); startVideo(box); }
    });
    /* пауза, когда шапку не видно или вкладка свёрнута: не грузим процессор зря */
    if("IntersectionObserver" in window) new IntersectionObserver(function(es){ vis=es[0].isIntersecting; sync(); }).observe(box);
    document.addEventListener("visibilitychange",sync);
  }
  if(document.readyState==="complete") start(); else window.addEventListener("load",start);
})();
