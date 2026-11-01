/* ===== Логика страницы ===== */
(function(){
  var TABS=["guide","gems","items","flasks","pob"], ST=["lvl","maps","red","end"];
  var TABNAME={gems:"Камни",items:"Вещи",flasks:"Флаконы"};
  function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
  function shot(k,cap,wide){ if(!IMG[k]) return ""; return '<figure class="shot'+(wide?' wide':'')+'"><button type="button" aria-label="Открыть: '+esc(cap)+'"><img src="'+IMG[k]+'" alt="'+esc(cap)+'" loading="lazy"></button><figcaption>'+esc(cap)+'</figcaption></figure>'; }
  function shots(list){ return list&&list.length ? '<div class="shots">'+list.map(function(x){return shot(x[0],x[1])}).join("")+'</div>' : ""; }
  function split(name){ var m=/^(.*?) \((.*)\)(.*)$/.exec(name); return m?{ru:m[1],en:m[2],rest:m[3]}:{ru:name,en:"",rest:""}; }

  /* --- камни --- */
  function gemLi(line){
    var p=line.split("|"), s=split(p[0]), lv=p[1]||"";
    return '<li data-copy="'+esc(p[0]+(lv?" "+lv:""))+'"><span><span class="g">'+esc(s.ru)+'</span> <span class="en">('+esc(s.en)+')</span></span>'+(lv?'<span class="lv">'+esc(lv)+'</span>':'')+'</li>';
  }
  function gemCard(g, full){
    return '<div class="card" data-scope><h4><span>'+(g.sub&&!full?'<span class="sub">'+esc(g.sub)+'</span>':'')+esc(g.title)+'</span><button type="button" class="copy" title="Скопировать список, по одному камню в строке">Копировать</button></h4>'
      +'<ul class="links">'+g.gems.map(gemLi).join("")+'</ul>'
      +(g.text?'<p>'+esc(g.text)+'</p>':'')+(full?shots(g.imgs):'')+'</div>';
  }
  function findGroups(s, ids){ var all=GEMS[s].groups; return ids? all.filter(function(g){return ids.indexOf(g.id)>=0}) : all; }

  /* --- вещи --- */
  function uniq(n){ var s=split(n); return '<span class="u">'+esc(s.ru)+'</span>'+(s.en?' <span class="en">('+esc(s.en)+')</span>':'')+esc(s.rest); }
  function slotCard(it){
    var h='<div class="card" data-scope><h4><span>'+esc(it.slot)+'</span></h4>';
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
    if(k==="gems"){ var gs=findGroups(s,ids); label="Камни · "+STAGES[s]+(gs[0]&&gs[0].sub?" · "+gs[0].sub:""); body='<div class="gg">'+gs.map(function(g){return gemCard({title:g.title,gems:g.gems},false)}).join("")+'</div>'; }
    if(k==="items"){ label="Вещи · "+STAGES[s]; body='<div>'+ITEMS[s].slots.map(slotRow).join("")+'</div>'; }
    if(k==="flasks"){ var fs=FLASKS[s].sets.filter(function(f){return !ids||ids.indexOf(f.id)>=0}); label="Флаконы · "+STAGES[s]; body='<div class="gg">'+fs.map(function(f){return flaskSet(f,false)}).join("")+'</div>'; }
    if(k==="craft"){ label="Флаконы · крафт флакона на хп"; body='<p style="margin:0">'+esc(FLASK_CRAFT.craft)+'</p><p style="margin:0">'+esc(FLASK_CRAFT.bad)+'</p>'; k="flasks"; }
    el.innerHTML='<div class="ins-head"><span class="lbl"><i></i>'+esc(label)+'</span><button type="button" class="go more" data-go="'+k+':'+s+'">Подробнее в разделе «'+TABNAME[k]+'» →</button></div><div class="ins-body">'+body+'</div>';
  });

  /* --- вкладки Камни / Вещи / Флаконы --- */
  function stageWrap(s,inner){ return '<div data-stage="'+s+'"'+(s==="lvl"?'':' hidden')+'>'+inner+'</div>'; }
  document.getElementById("p-gems").innerHTML = ST.map(function(s){
    var h='<h2>Камни: '+STAGES[s].toLowerCase()+'</h2>'+(GEMS[s].note?'<p class="note" data-scope>'+esc(GEMS[s].note)+'</p>':'<div style="height:14px"></div>');
    var subs=[], bySub={}; GEMS[s].groups.forEach(function(g){var k=g.sub||""; if(!bySub[k]){bySub[k]=[];subs.push(k)} bySub[k].push(g)});
    subs.forEach(function(k){ h+=(k?'<div class="sub">'+esc(k)+'</div>':'')+'<div class="grid">'+bySub[k].map(function(g){return gemCard(g,true)}).join("")+'</div>'; });
    return stageWrap(s,h);
  }).join("");
  document.getElementById("p-items").innerHTML = ST.map(function(s){
    return stageWrap(s,'<h2>Вещи: '+STAGES[s].toLowerCase()+'</h2><p class="note" data-scope>'+esc(ITEMS[s].note)+'</p><div class="grid">'+ITEMS[s].slots.map(slotCard).join("")+'</div>');
  }).join("");
  document.getElementById("p-flasks").innerHTML =
    '<div class="basics"><div class="card" data-scope><h4><span>Главное правило</span></h4><p style="margin:0">'+esc(FLASK_CRAFT.rule)+'</p></div>'+craftCard(true)+'</div>'
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
  WIKI.forEach(function(e){ W[e.id]=e; e.m.forEach(function(src){ try{ RX.push({id:e.id, re:new RegExp(src,e.cs?"u":"iu")}); }catch(err){} }); });
  var SKIP="A,BUTTON,H2,H3,H4,TH,FIGCAPTION,.w,.lv,.copy,.tag,.sl,.ins-head,.sub";
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

  /* --- всплывашка --- */
  var pop=document.getElementById("pop"), cur=null, hideT=null;
  function showPop(el){
    var e=W[el.dataset.w]; if(!e) return; clearTimeout(hideT); cur=el;
    pop.scrollTop=0;pop.innerHTML='<div class="k">'+esc(e.k)+'</div><h5>'+esc(e.t)+'</h5>'+(e.en&&e.en!==e.t?'<div class="pen">'+esc(e.en)+'</div>':'<div style="height:6px"></div>')+'<p>'+esc(e.d)+'</p>'+(e.img&&IMG[e.img]?'<img src="'+IMG[e.img]+'" alt="'+esc(e.t)+'">':'')+(e.p?'<a href="https://poedb.tw/ru/'+encodeURIComponent(e.p)+'" target="_blank" rel="noopener">Открыть на poedb →</a>':'');
    pop.hidden=false;
    var r=el.getBoundingClientRect(), pw=pop.offsetWidth, ph=pop.offsetHeight, vw=window.innerWidth, vh=window.innerHeight;
    var left=Math.min(Math.max(12,r.left+r.width/2-pw/2),vw-pw-12);
    var top=r.bottom+10; if(top+ph>vh-12 && r.top-ph-10>12) top=r.top-ph-10; if(top+ph>vh-12) top=Math.max(12,vh-ph-12);
    pop.style.left=left+"px"; pop.style.top=top+"px";
  }
  function hidePop(){ pop.hidden=true; cur=null; }
  var fine=window.matchMedia&&window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if(fine){
    document.addEventListener("mouseover",function(ev){ var w=ev.target.closest&&ev.target.closest(".w"); if(w&&w!==cur) showPop(w); else if(w||ev.target.closest(".pop")) clearTimeout(hideT); });
    document.addEventListener("mouseout",function(ev){ var w=ev.target.closest&&(ev.target.closest(".w")||ev.target.closest(".pop")); if(w){ clearTimeout(hideT); hideT=setTimeout(hidePop,220); } });
  }
  window.addEventListener("scroll",function(){ if(!pop.hidden) hidePop(); },{passive:true});

  /* --- вкладки, этапы, адрес --- */
  var state={tab:"guide",stage:"lvl"}, bar=document.getElementById("stages");
  try{var sv=localStorage.getItem("pconc-stage"); if(ST.indexOf(sv)>=0) state.stage=sv;}catch(e){}
  function render(jump){
    TABS.forEach(function(t){ document.getElementById("p-"+t).hidden=t!==state.tab; document.getElementById("t-"+t).setAttribute("aria-selected",t===state.tab); });
    bar.hidden=state.tab==="guide"||state.tab==="pob";
    document.querySelectorAll(".stage").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.stage===state.stage)});
    document.querySelectorAll(".panel [data-stage]").forEach(function(el){el.hidden=el.dataset.stage!==state.stage});
    if(jump){ var y=document.querySelector(".tabsbar").offsetTop; if(window.scrollY>y) window.scrollTo(0,y); }
  }
  function setHash(){ var h=(state.tab==="guide"||state.tab==="pob")?state.tab:state.tab+"-"+state.stage; if(location.hash.slice(1)!==h){ try{history.replaceState(null,"","#"+h)}catch(e){} } }
  function fromHash(){ var h=location.hash.slice(1); if(!h) return; var p=h.split("-"); if(TABS.indexOf(p[0])>=0){ state.tab=p[0]; if(ST.indexOf(p[1])>=0) state.stage=p[1]; } else if(document.getElementById(h)) state.tab="guide"; }
  function go(tab,stage){ state.tab=tab; if(stage) state.stage=stage; try{localStorage.setItem("pconc-stage",state.stage)}catch(e){} render(true); setHash(); }
  document.querySelectorAll(".tab").forEach(function(b){b.addEventListener("click",function(){go(b.dataset.tab)})});
  document.querySelectorAll(".stage").forEach(function(b){b.addEventListener("click",function(){go(state.tab,b.dataset.stage)})});

  /* --- копирование списка камней --- */
  function copyList(btn){
    var text=[].slice.call(btn.closest(".card").querySelectorAll(".links li")).map(function(li){return li.dataset.copy}).join("\n");
    function ok(){btn.textContent="Скопировано";btn.classList.add("ok");setTimeout(function(){btn.textContent="Копировать";btn.classList.remove("ok")},1600)}
    function fb(){var ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");ok()}catch(e){}ta.remove()}
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok,fb); else fb();
  }

  /* --- лайтбокс --- */
  var lb=document.getElementById("lb"), lbimg=document.getElementById("lbimg"), lbcap=document.getElementById("lbcap");
  lb.addEventListener("click",function(){lb.hidden=true});

  document.addEventListener("click",function(ev){
    var t=ev.target;
    var g=t.closest("[data-go]"); if(g){ var p=g.dataset.go.split(":"); go(p[0],p[1]); return; }
    var c=t.closest(".copy"); if(c){ copyList(c); return; }
    var s=t.closest("figure.shot button"); if(s){ var im=s.querySelector("img"); lbimg.src=im.src; lbcap.textContent=im.alt; lb.hidden=false; return; }
    var w=t.closest(".w"); if(w){ if(!fine&&cur===w&&!pop.hidden) hidePop(); else showPop(w); return; }
    if(!t.closest(".pop")) hidePop();
  });
  document.addEventListener("keydown",function(ev){
    if(ev.key==="Escape"){ lb.hidden=true; hidePop(); }
    if((ev.key==="Enter"||ev.key===" ")&&document.activeElement&&document.activeElement.classList.contains("w")){ ev.preventDefault(); showPop(document.activeElement); }
  });

  /* --- оглавление --- */
  var toc=document.getElementById("toc"), heads=[].slice.call(art.querySelectorAll("h2"));
  heads.forEach(function(h){ var li=document.createElement("li"), a=document.createElement("a"); a.href="#"+h.id; a.textContent=h.textContent; li.appendChild(a); toc.appendChild(li); });
  var links=[].slice.call(toc.querySelectorAll("a"));
  function hl(){ var c=heads[0]; heads.forEach(function(h){ if(h.getBoundingClientRect().top<160) c=h; }); links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+c.id)}); }
  window.addEventListener("scroll",hl,{passive:true}); hl();

  window.addEventListener("hashchange",function(){ fromHash(); render(false); });
  fromHash(); render(false);
})();
