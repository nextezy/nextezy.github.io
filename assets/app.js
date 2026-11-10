/* ===== Логика страницы ===== */
(function(){
  var TABS=["guide","gems","items","flasks","pob"], ST=Object.keys(STAGES);
  var SLUG=location.pathname.split("/").filter(Boolean)[0]||"guide", SKEY=SLUG+"-stage";
  var TABNAME={gems:"Камни",items:"Вещи",flasks:"Флаконы"};
  function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
  function shot(k,cap,wide){ if(!IMG[k]) return ""; return '<figure class="shot'+(wide?' wide':'')+'"><button type="button" aria-label="Открыть: '+esc(cap)+'"><img src="'+IMG[k]+'" alt="'+esc(cap)+'" loading="lazy"></button><figcaption>'+esc(cap)+'</figcaption></figure>'; }
  function shots(list){ return list&&list.length ? '<div class="shots">'+list.map(function(x){return shot(x[0],x[1])}).join("")+'</div>' : ""; }
  function split(name){ var m=/^(.*?) \((.*)\)(.*)$/.exec(name); return m?{ru:m[1],en:m[2],rest:m[3]}:{ru:name,en:"",rest:""}; }

  /* --- камни --- */
  function gemLi(line, s){
    var p=line.split("|"), sn=split(p[0]), lv=p[1]||"";
    return '<li data-copy="'+esc(p[0]+(lv?" "+lv:""))+'"><span><span class="g">'+esc(sn.ru)+'</span> <span class="en">('+esc(sn.en)+')</span></span><span class="gr">'+(lv?'<span class="lv">'+esc(lv)+'</span>':'')+gemTrade(sn.ru,lv,s)+'</span></li>';
  }
  /* кнопки трейда у камней: GEM_TRADE в data.js гайда (необязателен) */
  function gemTrade(name, lv, s){
    var G=window.GEM_TRADE; if(!G||!s) return "";
    var sp=G.special&&G.special[name], list;
    if(sp) list=sp;
    else if(!lv && G.stages.indexOf(s)>=0) list=[{l:"20/20",lo:20,hi:20,q:20}];
    else return "";
    var d=G.disc&&G.disc[name], t=d?{option:d[0],discriminator:d[1]}:((G.sup||[]).indexOf(name)>=0?"Поддержка: "+name:name);
    return list.map(function(e){
      var mf={}; if(e.lo!=null){ mf.gem_level={min:e.lo}; if(e.hi!=null) mf.gem_level.max=e.hi; } if(e.q) mf.quality={min:e.q};
      var q={status:{option:"securable"},type:t}; for(var k in mf){ q.filters={misc_filters:{filters:mf}}; break; }
      var u=TRADE_HOST+encodeURIComponent(TRADE_LEAGUE)+"?q="+encodeURIComponent(JSON.stringify({query:q,sort:{price:"asc"}}));
      return '<a class="gbuy" href="'+esc(u)+'" target="_blank" rel="noopener" title="'+TR_TIP+'">'+esc(e.l)+' <span aria-hidden="true">↗</span></a>';
    }).join("");
  }
  function gemCard(g, full, s){
    return '<div class="card" data-scope><h4><span>'+(g.sub&&!full?'<span class="sub">'+esc(g.sub)+'</span>':'')+esc(g.title)+'</span></h4>'
      +'<ul class="links">'+g.gems.map(function(x){return gemLi(x,s)}).join("")+'</ul>'
      +(g.text?'<p>'+esc(g.text)+'</p>':'')+(full?shots(g.imgs):'')+'</div>';
  }
  function findGroups(s, ids){ var all=GEMS[s].groups; return ids? all.filter(function(g){return ids.indexOf(g.id)>=0}) : all; }

  /* --- вещи --- */
  function uniq(n){ var s=split(n); return '<span class="u">'+esc(s.ru)+'</span>'+(s.en?' <span class="en">('+esc(s.en)+')</span>':'')+esc(s.rest); }
  /* трейд: лига одна на весь сайт, при новой лиге менять только её */
  var TRADE_LEAGUE="Allflame", TRADE_HOST="https://ru.pathofexile.com/trade/search/";
  var RES3=["pseudo.pseudo_total_fire_resistance","pseudo.pseudo_total_cold_resistance","pseudo.pseudo_total_lightning_resistance"];
  function flt(x){ var f={id:x[0],value:{}}; if(x[1]!=null) f.value.min=x[1]; if(x[2]!=null) f.value.max=x[2]; return f; }
  function tradeUrl(e){
    var q={status:{option:"securable"}}, st=[];
    if(e.n) q.name=e.n; if(e.t) q.type=e.t;
    var and=(e.s||[]).map(flt);
    if(e.r3) RES3.forEach(function(id){ and.push({id:id,value:{min:30},disabled:true}); });
    if(and.length) st.push({type:"and",filters:and});
    (e.cnt||[]).forEach(function(g){ st.push({type:"count",value:{min:1},filters:g.map(flt)}); });
    if(st.length) q.stats=st;
    var f={};
    if(e.cat){ f.type_filters={filters:{category:{option:e.cat}}}; if(!e.n) f.type_filters.filters.rarity={option:"nonunique"}; }
    if(e.links||e.sockets){ var sf={}; if(e.links) sf.links={min:e.links}; if(e.sockets) sf.sockets={min:e.sockets}; f.socket_filters={filters:sf}; }
    if(e.ar||e.es){ var af={}; if(e.ar) af.ar={min:e.ar}; if(e.es) af.es={min:e.es}; f.armour_filters={filters:af}; }
    if(e.corr!=null) f.misc_filters={filters:{corrupted:{option:e.corr?"true":"false"}}};
    for(var k in f){ q.filters=f; break; }
    return TRADE_HOST+encodeURIComponent(TRADE_LEAGUE)+"?q="+encodeURIComponent(JSON.stringify({query:q,sort:{price:"asc"}}));
  }
  var TR_TIP="Официальный трейд Path of Exile";
  function tradeBtns(it, cls){
    var tr=it.tr; if(!tr||!tr.length) return "";
    var multi=tr.length>1;
    var bs=tr.map(function(e){
      return '<a class="'+cls+'" href="'+esc(tradeUrl(e))+'" target="_blank" rel="noopener" title="'+TR_TIP+'">'+esc(multi?e.l:"Трейд")+' <span aria-hidden="true">↗</span></a>';
    }).join("");
    return multi ? '<div class="tbox"><span class="hlbl">Трейд:</span><span class="tcol">'+bs+'</span></div>' : bs;
  }
  function resNote(it){ return (it.tn?'<div class="trnote">'+esc(it.tn)+'</div>':'')+((it.tr||[]).some(function(e){return e.r3}) ? '<div class="trnote">Добавляйте резисты на трейде по вашему билду</div>' : ""); }
  function slotCard(it){
    var b=tradeBtns(it,"hbuy"), multi=it.tr&&it.tr.length>1;
    var h='<div class="card" data-scope><h4 class="slh"><span>'+esc(it.slot)+'</span>'+(b&&!multi?'<span class="hbuys">'+b+'</span>':'')+'</h4>'+(multi?b:'')+resNote(it);
    if(it.u) h+='<p style="margin:0">'+it.u.map(uniq).join("<br>")+'</p>';
    if(it.req) h+='<div class="sub" style="margin:'+(it.u?'12px':'0')+' 0 6px;font-size:14px;color:var(--dim);font-weight:600">Обязательные свойства</div><ul class="req">'+it.req.map(function(r){return '<li>'+esc(r)+'</li>'}).join("")+'</ul>';
    if(it.text) h+='<p>'+esc(it.text)+'</p>';
    if(it.max) h+='<div class="alt"><span class="tag max">максимум</span>'+uniq(it.max)+'</div>';
    if(it.boss) h+='<div class="alt"><span class="tag boss">боссинг</span>'+uniq(it.boss)+'</div>';
    if(it.buy) h+='<a class="buy" href="'+esc(it.buy)+'" target="_blank" rel="noopener">Купить</a>';
    return h+shots(it.imgs)+'</div>';
  }
  function slotRow(it){
    var v = it.u ? it.u.map(uniq).join(", ") : (it.req? esc(it.req.join(", ")) : esc(it.text||""));
    if(it.max) v+='<br><span class="en">Максимум: </span>'+uniq(it.max);
    var b=tradeBtns(it,"rbuy");
    if(b) v+=(it.tr.length>1?b:'<span class="rbuys">'+b+'</span>')+resNote(it);
    return '<div class="slotrow" data-scope><span class="sl">'+esc(it.slot)+'</span><span>'+v+'</span></div>';
  }

  /* --- флаконы --- */
  function flaskSet(f, full){
    var h='<div class="card" data-scope><h4><span>'+esc(f.title)+'</span>'+(f.tag?'<span class="tag '+(f.tag==="лучше"?"max":f.tag==="дешевле"?"cheap":"boss")+'">'+esc(f.tag)+'</span>':'')+'</h4>';
    if(f.rows) h+='<div class="tbl" style="margin:0"><table><tr>'+f.head.map(function(x){return '<th>'+esc(x)+'</th>'}).join("")+'</tr>'+f.rows.map(function(r){return '<tr>'+r.map(function(c,i){return '<td'+(i===0&&f.head[0]==="Слот"?' class="num"':'')+'>'+esc(c)+'</td>'}).join("")+'</tr>'}).join("")+'</table></div>';
    if(f.req&&full) h+='<ul class="req" style="margin-top:12px">'+f.req.map(function(r){return '<li>'+esc(r)+'</li>'}).join("")+'</ul>';
    if(f.text&&(full||!f.rows)) h+='<p>'+esc(f.text)+'</p>';
    return h+(full?shots(f.imgs):'')+'</div>';
  }
  function craftCard(full){
    return '<div class="card" data-scope><h4><span>Крафт флакона на хп</span></h4><p style="margin:0">'+esc(FLASK_CRAFT.craft)+'</p><p>'+esc(FLASK_CRAFT.bad)+'</p>'+shots(FLASK_CRAFT.imgs)+'</div>';
  }

  /* --- карточки внутри текста --- */
  document.querySelectorAll(".ins").forEach(function(el){
    var k=el.dataset.k, s=el.dataset.s, ids=el.dataset.ids?el.dataset.ids.split(","):null, body="", label="";
    if(k==="gems"){ var gs=findGroups(s,ids); label="Камни · "+STAGES[s]+(gs[0]&&gs[0].sub?" · "+gs[0].sub:""); body='<div class="gg">'+gs.map(function(g){return gemCard({title:g.title,gems:g.gems},false,s)}).join("")+'</div>'; }
    if(k==="items"){ label="Вещи · "+STAGES[s]; body='<div>'+ITEMS[s].slots.map(slotRow).join("")+'</div>'; }
    if(k==="flasks"){ var fs=FLASKS[s].sets.filter(function(f){return !ids||ids.indexOf(f.id)>=0}); label="Флаконы · "+STAGES[s]; body='<div class="gg">'+fs.map(function(f){return flaskSet(f,false)}).join("")+'</div>'; }
    if(k==="craft"){ label="Флаконы · крафт флакона на хп"; body='<p style="margin:0">'+esc(FLASK_CRAFT.craft)+'</p><p style="margin:0">'+esc(FLASK_CRAFT.bad)+'</p>'; k="flasks"; }
    el.innerHTML='<div class="ins-head"><span class="lbl"><i></i>'+esc(label)+'</span><button type="button" class="go more" data-go="'+k+':'+s+'">Подробнее в разделе «'+TABNAME[k]+'» →</button></div><div class="ins-body">'+body+'</div>';
  });

  /* --- вкладки Камни / Вещи / Флаконы --- */
  function stageWrap(s,inner){ return '<div data-stage="'+s+'"'+(s===ST[0]?'':' hidden')+'>'+inner+'</div>'; }
  document.getElementById("p-gems").innerHTML = ST.map(function(s){
    var h='<h2>Камни: '+STAGES[s].toLowerCase()+'</h2>'+(GEMS[s].note?'<p class="note" data-scope>'+esc(GEMS[s].note)+'</p>':'<div style="height:14px"></div>');
    var subs=[], bySub={}; GEMS[s].groups.forEach(function(g){var k=g.sub||""; if(!bySub[k]){bySub[k]=[];subs.push(k)} bySub[k].push(g)});
    subs.forEach(function(k){ h+=(k?'<div class="sub">'+esc(k)+'</div>':'')+'<div class="grid">'+bySub[k].map(function(g){return gemCard(g,true,s)}).join("")+'</div>'; });
    return stageWrap(s,h);
  }).join("");
  document.getElementById("p-items").innerHTML = ST.map(function(s){
    return stageWrap(s,'<h2>Вещи: '+STAGES[s].toLowerCase()+'</h2><p class="note" data-scope>'+esc(ITEMS[s].note)+'</p><div class="grid">'+ITEMS[s].slots.map(slotCard).join("")+'</div>');
  }).join("");
  document.getElementById("p-flasks").innerHTML =
    (typeof FLASK_CRAFT!=="undefined"?'<div class="basics"><div class="card" data-scope><h4><span>Главное правило</span></h4><p style="margin:0">'+esc(FLASK_CRAFT.rule)+'</p></div>'+craftCard(true)+'</div>':'')
    + ST.map(function(s){ return stageWrap(s,'<h2>Флаконы: '+STAGES[s].toLowerCase()+'</h2><p class="note" data-scope>'+esc(FLASKS[s].note)+'</p><div class="grid">'+FLASKS[s].sets.map(function(f){return flaskSet(f,true)}).join("")+'</div>'); }).join("");

  /* --- PoB: плашки в начале глав и отдельная вкладка --- */
  var POBL=(typeof POBS!=="undefined")?POBS:[], PB={}; POBL.forEach(function(p){PB[p.id]=p});
  function pobBtn(p){ return '<a class="pob-btn" href="'+esc(p.url)+'" target="_blank" rel="noopener">'+esc(p.title)+' <span aria-hidden="true">→</span></a>'; }
  document.querySelectorAll(".pob[data-pob]").forEach(function(el){
    var list=el.dataset.pob.split(",").map(function(id){return PB[id]}).filter(Boolean); if(!list.length){el.remove();return;}
    var pair=list.length>1&&list[0].pair;
    el.innerHTML='<div class="pob-lbl">PoB этого этапа</div><div class="pob-btns">'+list.map(pobBtn).join("")+'</div>'+(pair?'<p class="pob-note">'+esc(POB_PAIR_NOTE)+'</p>':'');
  });
  (function(){
    var host=document.getElementById("p-pob"); if(!host) return;
    function card(p){ return '<div class="card pob-card"><h4><span>'+esc(p.title)+'</span></h4><p style="margin:0">'+esc(p.desc)+'</p><a class="buy" href="'+esc(p.url)+'" target="_blank" rel="noopener">Открыть в PoB →</a></div>'; }
    var h='<h2>PoB билда</h2><p class="note">Ссылки на Path of Building для каждого этапа. Открываются на pobb.in, оттуда можно скопировать код в свой PoB.</p><div class="pob-list">', done={};
    POBL.forEach(function(p){
      if(done[p.id]) return;
      if(p.pair){ var g=POBL.filter(function(q){return q.pair===p.pair}); g.forEach(function(q){done[q.id]=1});
        h+='<div class="pob-pair"><div class="pob-pair-grid">'+g.map(card).join("")+'</div><p class="pob-note">'+esc(POB_PAIR_NOTE)+'</p></div>';
      } else { done[p.id]=1; h+=card(p); }
    });
    host.innerHTML=h+'</div>';
  })();

  /* --- картинки в тексте гайда уже вставлены сборкой; делим гайд на главы --- */
  var art=document.getElementById("guidetext"), kids=[].slice.call(art.childNodes), sec=null;
  kids.forEach(function(n){ if(n.nodeType===1&&n.tagName==="H2"){ sec=document.createElement("section"); sec.setAttribute("data-scope",""); art.insertBefore(sec,n); } if(sec) sec.appendChild(n); });

  /* --- мини-вики: подсвечиваем первое упоминание термина в каждой главе / карточке --- */
  var W={}, RX=[];
  WIKI.forEach(function(e){ if(e.pg&&e.pg.indexOf(SLUG)<0) return; W[e.id]=e; e.m.forEach(function(src){ try{ RX.push({id:e.id, re:new RegExp(src,e.cs?"u":"iu")}); }catch(err){} }); });

  /* --- картинки с всплывающими поинтами (HOTSPOTS в data.js) --- */
  var HS=typeof HOTSPOTS!=="undefined"?HOTSPOTS:{};
  document.querySelectorAll("[data-hs]").forEach(function(fig){
    var h=HS[fig.dataset.hs], box=fig.querySelector(".hsbox"); if(!h||!box) return;
    h.pts.forEach(function(p,i){
      var id="hs-"+fig.dataset.hs+"-"+i; W[id]={k:p.k,t:p.t,en:p.en,d:p.d,p:p.p||""};
      var b=document.createElement("button"); b.type="button"; b.className="w hs"+(p.on?" on":""); b.dataset.w=id; b.setAttribute("aria-label",p.t);
      b.style.left=(p.x/h.w*100)+"%"; b.style.top=(p.y/h.h*100)+"%"; b.style.width=(p.r*2/h.w*100)+"%";
      if(p.n){ var n=document.createElement("span"); n.className="hsn"; n.textContent=p.n; b.appendChild(n); }
      box.appendChild(b);
    });
  });
  var SKIP="A,BUTTON,H2,H3,H4,TH,FIGCAPTION,.w,.lv,.copy,.tag,.sl,.ins-head,.sub,.trnote,.hlbl";
  function textNodes(root){
    var out=[], tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      if(!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      var p=n.parentElement; if(p&&p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT; }});
    while(tw.nextNode()) out.push(tw.currentNode); return out;
  }
  function linkScope(scope){
    var used={};
    /* вложенные scope обрабатываются сами по себе */
    RX.forEach(function(r){
      if(used[r.id]) return;
      var nodes=textNodes(scope).filter(function(n){ var s=n.parentElement.closest("[data-scope]"); return s===scope; });
      for(var i=0;i<nodes.length;i++){
        var n=nodes[i], m=r.re.exec(n.nodeValue);
        if(m){
          var start=m.index, len=m[0].length; if(!len) continue;
          var mid=n.splitText(start); mid.splitText(len);
          var sp=document.createElement("span"); sp.className="w"; sp.tabIndex=0; sp.dataset.w=r.id; sp.setAttribute("role","button");
          mid.parentNode.replaceChild(sp,mid); sp.appendChild(mid);
          used[r.id]=1; break;
        }
      }
    });
  }
  document.querySelectorAll("[data-scope]").forEach(linkScope);
  /* названия камней (.g) подсвечиваем всегда, даже если в главе уже было упоминание */
  document.querySelectorAll(".g").forEach(function(g){
    if(g.querySelector(".w")||g.closest(SKIP)) return;
    var n=textNodes(g)[0]; if(!n) return;
    for(var i=0;i<RX.length;i++){ var m=RX[i].re.exec(n.nodeValue);
      if(m&&m[0].length){ var mid=n.splitText(m.index); mid.splitText(m[0].length);
        var sp=document.createElement("span"); sp.className="w"; sp.tabIndex=0; sp.dataset.w=RX[i].id; sp.setAttribute("role","button");
        mid.parentNode.replaceChild(sp,mid); sp.appendChild(mid); return; } }
  });

  /* --- всплывашка --- */
  var RM=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
  var pop=document.getElementById("pop"), cur=null, hideT=null; pop.hidden=false; /* видимость через класс .on: анимация появления (вариант 2, выбор Никиты) */
  function isOpen(){ return pop.classList.contains("on"); }
  function showPop(el){
    var e=W[el.dataset.w]; if(!e) return; clearTimeout(hideT); cur=el;
    pop.scrollTop=0;pop.innerHTML='<button type="button" class="pop-x" aria-label="Закрыть подсказку"></button><div class="k">'+esc(e.k)+'</div><h5>'+esc(e.t)+'</h5>'+(e.en&&e.en!==e.t?'<div class="pen">'+esc(e.en)+'</div>':'<div style="height:6px"></div>')+'<p>'+esc(e.d)+'</p>'+(e.img&&IMG[e.img]?'<img src="'+IMG[e.img]+'" alt="'+esc(e.t)+'">':'')+(e.p?'<a href="https://poedb.tw/ru/'+encodeURIComponent(e.p)+'" target="_blank" rel="noopener">Открыть на poedb →</a>':'');
    var was=isOpen(); if(!was){ pop.classList.remove("on"); }
    var r=el.getBoundingClientRect(), pw=pop.offsetWidth, ph=pop.offsetHeight, vw=window.innerWidth, vh=window.innerHeight;
    var left=Math.min(Math.max(12,r.left+r.width/2-pw/2),vw-pw-12);
    var top=r.bottom+10; if(top+ph>vh-12 && r.top-ph-10>12) top=r.top-ph-10; if(top+ph>vh-12) top=Math.max(12,vh-ph-12);
    pop.style.left=left+"px"; pop.style.top=top+"px";
    if(!was){ pop.style.transformOrigin=Math.round(r.left+r.width/2-left)+"px "+(top>=r.bottom?"0":"100%"); void pop.offsetWidth; pop.classList.add("on"); }
  }
  function hidePop(){ pop.classList.remove("on"); cur=null; }
  var fine=window.matchMedia&&window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if(fine){
    var showT=null; /* подсказки открываются с задержкой: слова в тексте 0.5 с (чтобы не открывались случайно, решение Никиты), поинты на картинках 0.2 с */
    document.addEventListener("mouseover",function(ev){ var w=ev.target.closest&&ev.target.closest(".w"); clearTimeout(showT);
      if(w&&w!==cur){ clearTimeout(hideT); showT=setTimeout(function(){showPop(w)},w.classList.contains("hs")?200:500); }
      else if(w||ev.target.closest(".pop")) clearTimeout(hideT); });
    document.addEventListener("mouseout",function(ev){ var w=ev.target.closest&&(ev.target.closest(".w")||ev.target.closest(".pop")); if(w){ clearTimeout(showT); clearTimeout(hideT); hideT=setTimeout(hidePop,220); } });
  }
  window.addEventListener("scroll",function(){ if(isOpen()) hidePop(); },{passive:true});

  /* --- вкладки, этапы, адрес --- */
  var state={tab:"guide",stage:ST[0]}, bar=document.getElementById("stages");
  try{var sv=localStorage.getItem(SKEY); if(ST.indexOf(sv)>=0) state.stage=sv;}catch(e){}
  function render(jump){
    TABS.forEach(function(t){ document.getElementById("p-"+t).hidden=t!==state.tab; document.getElementById("t-"+t).setAttribute("aria-selected",t===state.tab); });
    bar.hidden=state.tab==="guide"||state.tab==="pob";
    document.querySelectorAll(".stage").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.stage===state.stage)});
    document.querySelectorAll(".panel [data-stage]").forEach(function(el){el.hidden=el.dataset.stage!==state.stage});
    if(jump){ var y=document.querySelector(".tabsbar").offsetTop; if(window.scrollY>y) window.scrollTo(0,y); }
    fxTabs();
  }
  function setHash(){ var h=(state.tab==="guide"||state.tab==="pob")?state.tab:state.tab+"-"+state.stage; if(location.hash.slice(1)!==h){ try{history.replaceState(null,"","#"+h)}catch(e){} } }
  function fromHash(){ var h=location.hash.slice(1); if(!h) return; var p=h.split("-"); if(TABS.indexOf(p[0])>=0){ state.tab=p[0]; if(ST.indexOf(p[1])>=0) state.stage=p[1]; } else if(document.getElementById(h)) state.tab="guide"; }
  function go(tab,stage){ state.tab=tab; if(stage) state.stage=stage; try{localStorage.setItem(SKEY,state.stage)}catch(e){} render(true); setHash(); }
  document.querySelectorAll(".tab").forEach(function(b){b.addEventListener("click",function(){go(b.dataset.tab)})});
  document.querySelectorAll(".stage").forEach(function(b){b.addEventListener("click",function(){go(state.tab,b.dataset.stage)})});

  /* --- лайтбокс --- */
  var lb=document.getElementById("lb"), lbimg=document.getElementById("lbimg"), lbcap=document.getElementById("lbcap");
  lb.hidden=false; var lbSrc=null, LBE="cubic-bezier(.25,.8,.3,1)";
  /* картинка вырастает из своего места на странице и улетает обратно (решение Никиты): одинаковый масштаб, от центра, плюс проявление */
  function lbFrom(){ if(!lbSrc) return null; var f=lbSrc.getBoundingClientRect(); if(f.bottom<0||f.top>window.innerHeight||!f.width) return null;
    lbimg.style.transform="none"; var t=lbimg.getBoundingClientRect(); if(!t.width) return null;
    return "translate("+((f.left+f.width/2)-(t.left+t.width/2))+"px,"+((f.top+f.height/2)-(t.top+t.height/2))+"px) scale("+(f.width/t.width)+")"; }
  /* маленькие картинки на весь экран увеличиваем: до 60% ширины экрана (на телефоне на всю ширину), но не больше чем в 2.5 раза и не больше экрана (решение Никиты) */
  function lbSize(){ var nw=lbimg.naturalWidth, nh=lbimg.naturalHeight; if(!nw||!nh) return; var cs=getComputedStyle(lb);
    var aw=lb.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight), ah=lb.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-30;
    var sc=Math.min(aw/nw, ah/nh, Math.max(1, Math.min(2.5, (aw<700?aw:aw*0.6)/nw))); lbimg.style.width=Math.round(nw*sc)+"px"; lbimg.style.height="auto"; }
  function openLb(im){ lbSrc=im; lbimg.style.transition="none"; lbimg.style.opacity="1"; lbimg.src=im.src; lbcap.textContent=im.alt; lb.classList.add("open");
    function go(){ lbSize(); if(RM) return; var fr=lbFrom(); if(!fr) return; lbimg.style.transition="none"; lbimg.style.transform=fr; lbimg.style.opacity=".4"; void lbimg.offsetWidth;
      lbimg.style.transition="transform .5s "+LBE+",opacity .25s ease"; lbimg.style.transform="none"; lbimg.style.opacity="1"; }
    if(lbimg.complete&&lbimg.naturalWidth) go(); else lbimg.onload=function(){ lbimg.onload=null; go(); }; }
  function closeLb(){ if(!lb.classList.contains("open")) return; var fr=RM?null:lbFrom();
    lbimg.style.transition="none"; lbimg.style.transform="none"; void lbimg.offsetWidth;
    lbimg.style.transition="transform .32s cubic-bezier(.4,0,.2,1),opacity .3s ease"; if(fr) lbimg.style.transform=fr; lbimg.style.opacity="0"; lb.classList.remove("open"); }
  lb.addEventListener("click",closeLb);

  document.addEventListener("click",function(ev){
    var t=ev.target;
    var g=t.closest("[data-go]"); if(g){ var p=g.dataset.go.split(":"); go(p[0],p[1]); return; }
    var s=t.closest("figure.shot button"); if(s){ openLb(s.querySelector("img")); return; }
    if(t.closest(".pop-x")){ hidePop(); return; }
    var w=t.closest(".w"); if(w){ if(!fine&&cur===w&&isOpen()) hidePop(); else showPop(w); return; }
    if(!t.closest(".pop")) hidePop();
  });
  document.addEventListener("keydown",function(ev){
    if(ev.key==="Escape"){ closeLb(); hidePop(); }
    if((ev.key==="Enter"||ev.key===" ")&&document.activeElement&&document.activeElement.classList.contains("w")){ ev.preventDefault(); showPop(document.activeElement); }
  });

  /* --- оглавление --- */
  var toc=document.getElementById("toc"), heads=[].slice.call(art.querySelectorAll("h2"));
  heads.forEach(function(h){ var li=document.createElement("li"), a=document.createElement("a"); a.href="#"+h.id; a.textContent=h.textContent; li.appendChild(a); toc.appendChild(li); });
  var links=[].slice.call(toc.querySelectorAll("a"));
  var hlCur=null, hlTick=false;
  function hl(){ hlTick=false; if(!heads.length) return; var c=heads[0], i;
    for(i=0;i<heads.length;i++){ if(heads[i].getBoundingClientRect().top<160) c=heads[i]; else break; }
    /* в самом низу страницы короткий последний раздел (Итог) не может доехать до верха: берём последний видимый заголовок */
    var de=document.documentElement;
    if(window.innerHeight+window.scrollY>=de.scrollHeight-4){ for(i=heads.length-1;i>=0;i--){ var t=heads[i].getBoundingClientRect().top; if(t>=0&&t<window.innerHeight*0.7){ c=heads[i]; break; } } }
    if(c===hlCur) return; hlCur=c; links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+c.id)}); tocInd(); }
  /* переход по оглавлению: далёкий прыжок мгновенно до экрана перед разделом, остаток плавно, потом поправка,
     если над разделом догрузились картинки и он сдвинулся */
  var goSeq=0; ["wheel","touchstart","keydown","mousedown"].forEach(function(n){ window.addEventListener(n,function(){ goSeq++; },{passive:true}); });
  function goHead(h){
    var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
    function target(){ return Math.max(0,Math.min(h.getBoundingClientRect().top+window.scrollY-100, document.documentElement.scrollHeight-window.innerHeight)); }
    var y=target(), far=window.innerHeight*1.5;
    try{
      if(Math.abs(window.scrollY-y)>far) window.scrollTo({top:y+(window.scrollY>y?far*0.5:-far*0.5),behavior:"instant"});
      window.scrollTo({top:target(),behavior:rm?"auto":"smooth"});
    }catch(e){ window.scrollTo(0,target()); }
    var my=++goSeq; /* поправку отменяем, если человек сам начал крутить */
    [700,1500].forEach(function(ms){ setTimeout(function(){ if(my!==goSeq) return; var t=target(); if(Math.abs(window.scrollY-t)>30) try{window.scrollTo({top:t,behavior:"instant"})}catch(e){window.scrollTo(0,t)} },ms); });
    try{history.replaceState(null,"","#"+h.id)}catch(e){}
  }
  links.forEach(function(a,i){ a.addEventListener("click",function(ev){ if(ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.button) return; ev.preventDefault(); goHead(heads[i]); }); });
  window.addEventListener("scroll",function(){ if(!hlTick){ hlTick=true; requestAnimationFrame(hl); } },{passive:true}); hl();


  /* --- кнопка «наверх» --- */
  var up=document.createElement("button"); up.type="button"; up.className="totop"; up.setAttribute("aria-label","Наверх"); up.title="Наверх";
  up.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(up);
  function upShow(){ up.classList.toggle("on", window.scrollY>window.innerHeight); }
  window.addEventListener("scroll",upShow,{passive:true}); upShow();
  up.addEventListener("click",function(){
    var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* длинную страницу сначала мгновенно поднимаем почти к началу, последний экран доезжает плавно: без лагов на слабых ПК */
    var near=Math.round(window.innerHeight*0.8);
    try{ if(window.scrollY>near) window.scrollTo({top:near,behavior:"instant"}); window.scrollTo({top:0,behavior:rm?"auto":"smooth"}); }catch(e){ window.scrollTo(0,0); }
  });

  /* --- плавные анимации (решение Никиты): вкладки, этапы, оглавление, картинки при прокрутке --- */
  var tabsEl=document.querySelector(".tabs"), tline=document.createElement("span"); tline.className="tabline"; tabsEl.appendChild(tline); tabsEl.classList.add("has-line");
  var pill=document.createElement("span"); pill.className="pill"; bar.insertBefore(pill,bar.firstChild); bar.classList.add("has-pill");
  var fxLast=null, barWasHidden=true;
  function place(el,b,now,line){ if(now) el.style.transition="none"; el.style.left=b.offsetLeft+"px"; el.style.width=b.offsetWidth+"px"; el.style.top=(line?b.offsetTop+b.offsetHeight-2:b.offsetTop)+"px"; el.style.height=(line?2:b.offsetHeight)+"px"; if(now){ void el.offsetWidth; el.style.transition=""; } }
  function fxTabs(){ if(!tline) return;
    var tb=document.getElementById("t-"+state.tab); if(tb) place(tline,tb,fxLast===null,true);
    var sb=bar.querySelector('.stage[data-stage="'+state.stage+'"]'); if(!bar.hidden&&sb) place(pill,sb,barWasHidden); barWasHidden=bar.hidden;
    var key=state.tab+"|"+state.stage;
    if(fxLast!==null&&fxLast!==key&&!RM){ var pn=document.getElementById("p-"+state.tab); pn.classList.remove("swap"); void pn.offsetWidth; pn.classList.add("swap"); }
    fxLast=key; }
  document.querySelectorAll(".tabsbar ~ main > section, main > section").forEach(function(pn){ pn.addEventListener("animationend",function(){ pn.classList.remove("swap"); }); });
  var tocOl=toc, ind=document.createElement("span"); ind.className="ind"; tocOl.appendChild(ind); tocOl.classList.add("has-ind"); var indFirst=true;
  function tocInd(){ if(!ind) return; var a=toc.querySelector("a.on"); if(!a) return; place(ind,a,indFirst); indFirst=false; }
  function refit(){ fxTabs(); indFirst=true; tocInd(); }
  window.addEventListener("resize",refit); window.addEventListener("load",refit); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(refit);
  if(!RM&&"IntersectionObserver" in window){
    var rvIO=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; var el=e.target, sib=el.parentNode?[].indexOf.call(el.parentNode.children,el):0;
      setTimeout(function(){ el.classList.add("in"); },Math.min(sib,4)*90); rvIO.unobserve(el); }); },{rootMargin:"0px 0px -8% 0px"});
    document.querySelectorAll("figure.shot, figure.hsfig").forEach(function(el){ el.classList.add("rv"); rvIO.observe(el); });
  }

  window.addEventListener("hashchange",function(){ fromHash(); render(false); });
  fromHash(); render(false); tocInd();
})();
