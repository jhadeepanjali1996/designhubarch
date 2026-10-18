(function(){
var SV={interior:'Interior Design','3d':'2D & 3D Design',exterior:'Exterior Design',floorplan:'Floor Planning'};
var $=function(i){return document.getElementById(i)},P=function(s){return (s||'').replace(/^\/+/,'')};
var lb=$('lb'),all=[];
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function clean(l){return (l||[]).filter(function(x){return x&&x.file&&x.title&&x.visible!==false})}
function load(cb){fetch('gallery.json?t=' + Date.now()).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){cb(clean(d.items))}).catch(function(){cb(location.protocol==='file:'?clean((window.GALLERY_FALLBACK||{}).items):[])})}
function card(it,i){var v=it.type==='video',im=P(v?it.poster:it.file),t=E(it.title);
var m=(v&&!it.poster)?'<video src="'+E(P(it.file))+'#t=0.5" preload="metadata" muted playsinline></video>':'<img src="'+E(im)+'" alt="'+t+'" loading="lazy">';
return '<button class="g" data-i="'+i+'">'+m+(v?'<b class="pl">▶</b>':'')+'<span>'+t+'</span></button>'}
function fill(el,list){el.innerHTML=list.length?list.map(function(it){return card(it,all.indexOf(it))}).join(''):'<p class="empty">Photos and videos will be added here soon.</p>'}
function open(it){var v=it.type==='video';lb.innerHTML='<button aria-label="Close">×</button>'+(v?'<video src="'+E(P(it.file))+'" controls autoplay playsinline></video>':'<img src="'+E(P(it.file))+'" alt="'+E(it.title)+'">')+'<p>'+E(it.title)+'</p>';lb.classList.add('on')}
function shut(){lb.classList.remove('on');lb.innerHTML=''}
if(lb)lb.onclick=function(e){if(e.target===lb||e.target.tagName==='BUTTON')shut()};
document.addEventListener('click',function(e){var g=e.target.closest&&e.target.closest('.g');if(g&&all[g.dataset.i])open(all[g.dataset.i])});
load(function(items){all=items;var rev=items.slice().reverse();
var hp=$('home-photos');if(hp){fill(hp,rev.filter(function(x){return x.type!=='video'}).slice(0,9));fill($('home-videos'),rev.filter(function(x){return x.type==='video'}))}
var gp=$('gal');if(gp){var q=new URLSearchParams(location.search).get('service'),st={s:SV[q]||'',t:'',r:''};
function btns(id,vals,key){var el=$(id);el.innerHTML=[['','All']].concat(vals).map(function(v){return '<button data-v="'+v[0]+'" class="'+(st[key]===v[0]?'on':'')+'">'+v[1]+'</button>'}).join('');el.onclick=function(e){if(e.target.dataset.v===undefined)return;st[key]=e.target.dataset.v;if(key==='s')st.r='';draw()}}
function draw(){var base=rev.filter(function(x){return !st.s||(x.services||[]).indexOf(st.s)>-1});
var rooms=[];base.forEach(function(x){if(x.room&&rooms.indexOf(x.room)<0)rooms.push(x.room)});
btns('f-s',Object.keys(SV).map(function(k){return [SV[k],SV[k]]}),'s');btns('f-t',[['photo','Photos'],['video','Videos']],'t');btns('f-r',rooms.map(function(r){return [r,r]}),'r');
fill(gp,base.filter(function(x){return(!st.t||x.type===st.t)&&(!st.r||x.room===st.r)}))}
draw()}});
})();
