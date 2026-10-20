/* Tahu Kocek Merapi - aplikasi utama (menu, nota, laporan, edit menu) */
(function(){
"use strict";
var WA="6285731051627",MAXQ=50,MAXS=25,MAXT=25,NK="nota_tahu",MK="menu_tahu";
var DEF={j:[["BIJIAN",2000,"Tahu Kocek "],["INCIP",7000,"Tahu Kocek "],["ABG",10000,"Tahu Kocek "],["MIX",13000,"Tahu Kocek "]],s:[["Sosis",2000],["Sosis 1/2",1000],["Bola Ikan",2000]],t:[["Gubis",1000],["Sosis",2000],["Fishball",2000]],l:[0,3000,5000]};
var LVL=[["1 – 5",1,5],["6 – 10",6,10],["11 – 15",11,15]];
var HR=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
var BL=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
var App=window.App={onNotes:null,onMenu:null};
var jenis=[],jajan=[],tops=[],lvf=[0,3000,5000],H=[],st,RQ=[],RS=[],RT=[],vw="h",off=0;
var G=function(i){return document.getElementById(i)};
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function rp(n){return "Rp "+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function pad(n){return n<10?"0"+n:""+n}
function tgl(ts){var d=new Date(ts);return HR[d.getDay()]+", "+d.getDate()+" "+BL[d.getMonth()]+" "+d.getFullYear()+" • "+pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds())}
function resetSt(){st={q:{},s:{},t:{},l:null}}

/* ---------- menu ---------- */
function cur(){return {j:jenis.map(function(x){return [x[0],x[1],x[2]||""]}),s:jajan.map(function(x){return [x[0],x[1]]}),t:tops.map(function(x){return [x[0],x[1]]}),l:lvf.slice()}}
function valid(m){return !!(m&&m.j&&m.j.length&&m.t&&m.l&&m.l.length==3)}
function clone(a){return a.map(function(x){return x.slice()})}
function loadMenu(){try{var s=localStorage.getItem(MK);return s?JSON.parse(s):null}catch(e){return null}}
function saveMenu(m){try{localStorage.setItem(MK,JSON.stringify(m))}catch(e){}}
function apply(m){jenis=clone(m.j);jajan=clone(m.s||DEF.s);tops=clone(m.t);lvf=m.l.slice();resetSt();build()}
function setMenu(m){apply(m);saveMenu(m)}

/* ---------- baris jumlah (+ dan -) ---------- */
function paintR(R,arr,i,max){var o=R[i];if(!o)return;var q=arr[i]||0;o.n.textContent=q;o.r.classList.toggle("on",q>0);o.m.disabled=q<1;o.p.disabled=q>=max}
function mkRows(box,list,key,max){var R=[];box.innerHTML="";
 list.forEach(function(x,i){var r=document.createElement("div");r.className="trow";
  r.innerHTML='<div class="tn"><b>'+esc((x[2]||"")+x[0])+'</b><span>'+rp(x[1])+' per porsi</span></div><div class="qty"><button class="qm" aria-label="Kurangi">−</button><i>0</i><button class="qp" aria-label="Tambah">+</button></div>';
  box.appendChild(r);R[i]={r:r,n:r.querySelector("i"),m:r.querySelector(".qm"),p:r.querySelector(".qp")};
  R[i].p.onclick=function(){st[key][i]=Math.min(max,(st[key][i]||0)+1);paintR(R,st[key],i,max);upd()};
  R[i].m.onclick=function(){st[key][i]=Math.max(0,(st[key][i]||0)-1);paintR(R,st[key],i,max);upd()};
  paintR(R,st[key],i,max)});
 return R}
function repaint(){jenis.forEach(function(x,i){paintR(RQ,st.q,i,MAXQ)});jajan.forEach(function(x,i){paintR(RS,st.s,i,MAXS)});tops.forEach(function(x,i){paintR(RT,st.t,i,MAXT)})}
function build(){
 RQ=mkRows(G("jenis"),jenis,"q",MAXQ);RS=mkRows(G("jajan"),jajan,"s",MAXS);RT=mkRows(G("top"),tops,"t",MAXT);
 var lr=G("lvlrows"),all=[];lr.innerHTML="";
 LVL.forEach(function(g,gi){var r=document.createElement("div");r.className="row";
  r.innerHTML='<div class="rh"><span>Level '+g[0]+'</span><em>'+(lvf[gi]>0?"+ "+rp(lvf[gi]):"Gratis")+'</em></div><div class="nums"></div>';
  var n=r.querySelector(".nums");
  for(var v=g[1];v<=g[2];v++)(function(v){var b=document.createElement("button");b.className="btn";b.textContent=v;n.appendChild(b);all.push([b,v]);
   b.onclick=function(){st.l=(st.l&&st.l[0]==v)?null:[v,lvf[gi]];all.forEach(function(e){e[0].classList.toggle("on",!!st.l&&st.l[0]==e[1])});upd()}})(v);
  lr.appendChild(r)});
 upd()}
function calc(){var pc=0,js=0,t=0;
 jenis.forEach(function(x,i){var n=st.q[i]||0;pc+=n;t+=x[1]*n});
 jajan.forEach(function(x,i){var n=st.s[i]||0;js+=n;t+=x[1]*n});
 if(pc){if(st.l)t+=st.l[1]*pc;tops.forEach(function(x,i){t+=x[1]*(st.t[i]||0)})}
 return {pc:pc,js:js,t:t}}
function upd(){var c=calc(),o=G("order"),r=G("ring");
 if(!c.pc&&st.l){st.l=null;document.querySelectorAll("#lvlrows .btn.on").forEach(function(b){b.classList.remove("on")})}
 G("lvl").classList.toggle("show",c.pc>0);
 if(!c.pc&&!c.js){r.innerHTML="Pilih menu dulu<b>Rp 0</b>";o.disabled=true;return}
 var p=[];if(c.pc)p.push(c.pc+" tahu"+(st.l?" · Level "+st.l[0]:""));if(c.js)p.push(c.js+" jajan");
 r.innerHTML=p.join(" · ")+"<b>"+rp(c.t)+"</b>";o.disabled=false}
function order(){var it=[],js=[],tp=[],tot=0,pc=0,jc=0;
 jenis.forEach(function(x,i){var n=st.q[i]||0;if(n>0){it.push(n>1?x[0]+" x"+n:x[0]);tot+=x[1]*n;pc+=n}});
 jajan.forEach(function(x,i){var n=st.s[i]||0;if(n>0){js.push(n>1?x[0]+" x"+n:x[0]);tot+=x[1]*n;jc+=n}});
 if(!pc&&!jc)return;
 if(pc){if(st.l)tot+=st.l[1]*pc;tops.forEach(function(x,i){var n=st.t[i]||0;if(n>0){tp.push(n>1?x[0]+" x"+n:x[0]);tot+=x[1]*n}})}
 H.unshift({id:H.length?H[0].id+1:1,j:it.join(", "),l:pc?(st.l?st.l[0]:"-"):"-",t:tp,s:js,tot:tot,ts:Date.now()});
 save();renderAll();
 resetSt();document.querySelectorAll("#lvlrows .btn.on").forEach(function(b){b.classList.remove("on")});
 repaint();upd();go("nota")}

/* ---------- nota ---------- */
function loadNotes(){try{var a=JSON.parse(localStorage.getItem(NK)||"[]");return Array.isArray(a)?a:[]}catch(e){return []}}
function persist(){try{localStorage.setItem(NK,JSON.stringify(H))}catch(e){}}
function save(){if(App.onNotes){try{App.onNotes(H)}catch(e){}}persist()}
function wal(n){var L=["Tahu Kocek Merapi:"],hj=n.j&&n.j!=="-";
 if(hj){L.push("- Jenis: "+n.j);L.push("- Level: "+n.l)}
 if(hj||(n.t&&n.t.length))L.push("- Topping: "+(n.t&&n.t.length?n.t.join(", "):"-"));
 if(n.s&&n.s.length)L.push("- Jajan: "+n.s.join(", "));
 L.push("- Total: "+rp(n.tot));L.push("- Waktu: "+tgl(n.ts));
 return "https://wa.me/"+WA+"?text="+encodeURIComponent(L.join("\n"))}
function renderNotes(){var c=G("hist"),k=G("cnt");k.hidden=!H.length;k.textContent=H.length;
 if(!H.length){c.innerHTML='<p class="empty">Belum ada nota.<br>Pesan dulu di tab Menu.</p>';return}
 c.innerHTML=H.map(function(n,i){var hj=n.j&&n.j!=="-",L="";
  if(hj)L+='<div>Jenis: '+esc(n.j)+'</div><div>Level: '+esc(n.l)+'</div>';
  if(hj||(n.t&&n.t.length))L+='<div>Topping: '+(n.t&&n.t.length?esc(n.t.join(", ")):"-")+'</div>';
  if(n.s&&n.s.length)L+='<div>Jajan: '+esc(n.s.join(", "))+'</div>';
  return '<div class="nota"><div class="nh"><b>Nota #'+n.id+'</b><span>'+tgl(n.ts)+'</span></div>'+L+'<div class="nt">Total: '+rp(n.tot)+'</div><div class="na"><a class="wa" href="'+wal(n)+'" target="_blank" rel="noopener">Kirim WA</a><button data-d="'+i+'">Hapus</button></div></div>'}).join("")}
G("hist").onclick=function(e){
 var a=e.target.closest&&e.target.closest("a.wa");
 if(a&&window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()){e.preventDefault();window.location.href=a.href;return}
 var d=e.target.getAttribute("data-d");
 if(d!==null&&confirm("Hapus nota ini?")){H.splice(+d,1);save();renderAll()}};

/* ---------- laporan ---------- */
function dr(v,o){var n=new Date(),y=n.getFullYear(),m=n.getMonth(),d=n.getDate(),a,b;
 if(v=="h"){a=new Date(y,m,d+o);b=new Date(y,m,d+o+1)}
 else if(v=="m"){var w=(n.getDay()+6)%7;a=new Date(y,m,d-w+o*7);b=new Date(y,m,d-w+o*7+7)}
 else if(v=="b"){a=new Date(y,m+o,1);b=new Date(y,m+o+1,1)}
 else{a=new Date(y+o,0,1);b=new Date(y+o+1,0,1)}
 return [a,b]}
function parseJ(s){return String(s||"").split(", ").filter(function(x){return x&&x!=="-"}).map(function(x){var m=/^(.*) x(\d+)$/.exec(x);return m?[m[1],+m[2]]:[x,1]})}
function lap(){
 var r=dr(vw,off),a=r[0],A=a.getTime(),B=r[1].getTime(),it=H.filter(function(x){return x.ts>=A&&x.ts<B}),tot=0,rows=[],i,ttl,sub;
 it.forEach(function(x){tot+=x.tot});
 var fd=function(d){return d.getDate()+" "+BL[d.getMonth()]};
 if(vw=="h"){ttl=(off==0?"Hari ini · ":"")+HR[a.getDay()]+", "+fd(a)+" "+a.getFullYear();sub="Rincian terjual (jumlah porsi)";
  var cnt={},ord=[],add=function(k,n){if(!(k in cnt)){cnt[k]=0;ord.push(k)}cnt[k]+=n};
  jenis.forEach(function(j){add(j[0],0)});jajan.forEach(function(j){add(j[0],0)});
  it.forEach(function(n){parseJ(n.j).forEach(function(p){add(p[0],p[1])});(n.s||[]).forEach(function(x){parseJ(x).forEach(function(p){add(p[0],p[1])})})});
  ord.forEach(function(k){rows.push([k,cnt[k],cnt[k]+" porsi"])})}
 else if(vw=="m"){var e=new Date(a.getFullYear(),a.getMonth(),a.getDate()+6);ttl=(off==0?"Minggu ini · ":"")+fd(a)+" – "+fd(e)+" "+e.getFullYear();sub="Rincian harian";
  for(i=0;i<7;i++){var d1=new Date(a.getFullYear(),a.getMonth(),a.getDate()+i),s1=0;
   it.forEach(function(x){var q=new Date(x.ts);if(q.getDate()==d1.getDate()&&q.getMonth()==d1.getMonth())s1+=x.tot});
   rows.push([HR[d1.getDay()]+" "+d1.getDate(),s1,rp(s1)])}}
 else if(vw=="b"){ttl=(off==0?"Bulan ini · ":"")+BL[a.getMonth()]+" "+a.getFullYear();sub="Rincian mingguan";
  var w0=(a.getDay()+6)%7,dim=new Date(a.getFullYear(),a.getMonth()+1,0).getDate(),nw=Math.ceil((dim+w0)/7),ws=[];
  for(i=0;i<nw;i++)ws.push(0);
  it.forEach(function(x){ws[Math.floor((new Date(x.ts).getDate()-1+w0)/7)]+=x.tot});
  ws.forEach(function(v,k){rows.push(["Minggu ke-"+(k+1),v,rp(v)])})}
 else{ttl=(off==0?"Tahun ini · ":"")+a.getFullYear();sub="Rincian bulanan";
  var ms=[];for(i=0;i<12;i++)ms.push(0);
  it.forEach(function(x){ms[new Date(x.ts).getMonth()]+=x.tot});
  ms.forEach(function(v,k){rows.push([BL[k],v,rp(v)])})}
 var mx=1;rows.forEach(function(x){if(x[1]>mx)mx=x[1]});
 var pills=[["h","Harian"],["m","Mingguan"],["b","Bulanan"],["t","Tahunan"]].map(function(p){return '<button data-v="'+p[0]+'"'+(p[0]==vw?' class="on"':'')+'>'+p[1]+'</button>'}).join("");
 G("lap").innerHTML='<div class="pills">'+pills+'</div><div class="nav2"><button data-n="-1">‹</button><span>'+ttl+'</span><button data-n="1"'+(off>=0?' disabled':'')+'>›</button></div>'
 +'<div class="cards"><div class="card"><small>Total penghasilan</small><b>'+rp(tot)+'</b><span>'+it.length+' pesanan</span></div></div><h2>'+sub+'</h2>'
 +'<div class="bars">'+rows.map(function(x){return '<div class="br"><u>'+esc(x[0])+'</u><div><i style="width:'+Math.round(x[1]/mx*100)+'%"></i></div><em>'+x[2]+'</em></div>'}).join("")+'</div>'
 +'<p class="empty">Harian yang sudah lewat tetap bisa dilihat di Mingguan, mingguan di Bulanan, dan bulanan di Tahunan. Data dari nota di HP ini.</p>'}
G("lap").onclick=function(e){var v=e.target.getAttribute("data-v"),n=e.target.getAttribute("data-n");
 if(v){vw=v;off=0;lap()}else if(n){off+=+n;lap()}};
function renderAll(){renderNotes();lap()}

/* ---------- tab ---------- */
function go(t){
 document.querySelectorAll(".tabs button").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-t")==t)});
 G("p-menu").classList.toggle("on",t=="menu");G("p-nota").classList.toggle("on",t=="nota");G("p-lap").classList.toggle("on",t=="laporan");
 G("bar").classList.toggle("hide",t!="menu");window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tabs button").forEach(function(b){b.onclick=function(){go(b.getAttribute("data-t"))}});
G("order").onclick=order;

/* ---------- edit menu ---------- */
var ed=G("mEdit");
function row(n,p,pre){return '<div class="ed" data-p="'+esc(pre||"")+'"><input class="en" maxlength="30" placeholder="Nama" value="'+esc(n)+'"><input class="ep" type="number" inputmode="numeric" min="0" placeholder="Harga" value="'+p+'"><button class="ex" data-a="del" aria-label="Hapus">🗑</button></div>'}
function openEd(){var m=cur();
 ed.innerHTML='<div class="mbox"><h3>Edit Menu</h3><p>Ubah nama dan harga, hapus, atau tambah menu baru. Setelah disimpan langsung dipakai.</p>'
 +'<h4>Jenis tahu kocek</h4><div id="ej">'+m.j.map(function(x){return row(x[0],x[1],x[2])}).join("")+'</div><button class="mb g sm" data-a="addj">+ Tambah jenis</button>'
 +'<h4>Topping</h4><div id="et">'+m.t.map(function(x){return row(x[0],x[1])}).join("")+'</div><button class="mb g sm" data-a="addt">+ Tambah topping</button>'
 +'<h4>Jajan</h4><div id="es">'+m.s.map(function(x){return row(x[0],x[1])}).join("")+'</div><button class="mb g sm" data-a="adds">+ Tambah jajan</button>'
 +'<h4>Harga tambahan level</h4>'+LVL.map(function(g,i){return '<div class="ed"><span class="ln">Level '+g[0]+'</span><input class="el" type="number" inputmode="numeric" min="0" value="'+m.l[i]+'"></div>'}).join("")
 +'<p class="er" id="eer"></p><button class="mb" data-a="save">Simpan</button><button class="mb g" data-a="cancel">Batal</button><button class="mb g" data-a="reset">Kembalikan menu awal</button></div>';
 ed.classList.add("show")}
function rd(id){var a=[],ok=true;
 ed.querySelectorAll("#"+id+" .ed").forEach(function(r){var n=r.querySelector(".en").value.replace(/[<>"&]/g,"").trim(),p=r.querySelector(".ep").value;
  if(!n&&p==="")return;var v=Number(p);
  if(!n||p===""||isNaN(v)||v<0||v>10000000){ok=false;return}
  var o=[n,Math.round(v)];if(id=="ej")o.push(r.getAttribute("data-p")||"");a.push(o)});
 return ok?a:null}
function dup(a){var s={};for(var i=0;i<a.length;i++){var k=a[i][0].toLowerCase();if(s[k])return true;s[k]=1}return false}
function saveEd(){var er=G("eer"),j=rd("ej"),t=rd("et"),s=rd("es"),l=[],bad=false;
 ed.querySelectorAll(".el").forEach(function(e){var v=Number(e.value);if(e.value===""||isNaN(v)||v<0||v>10000000)bad=true;l.push(Math.round(v))});
 if(!j||!t||!s||bad){er.textContent="Nama harus diisi dan harga harus angka 0 atau lebih";return}
 if(!j.length&&!s.length){er.textContent="Minimal ada 1 jenis tahu atau 1 jajan";return}
 if(dup(j.concat(s))||dup(t)){er.textContent="Nama tidak boleh sama dalam satu daftar";return}
 var m={j:j,s:s,t:t,l:l};setMenu(m);if(App.onMenu)App.onMenu(m);ed.classList.remove("show")}
ed.onclick=function(e){if(e.target===ed){ed.classList.remove("show");return}
 var a=e.target.getAttribute("data-a");if(!a)return;
 if(a=="del"){var r=e.target.closest(".ed");if(r)r.remove()}
 else if(a=="addj")G("ej").insertAdjacentHTML("beforeend",row("","",""))
 else if(a=="addt")G("et").insertAdjacentHTML("beforeend",row("",""))
 else if(a=="adds")G("es").insertAdjacentHTML("beforeend",row("",""))
 else if(a=="save")saveEd()
 else if(a=="cancel")ed.classList.remove("show")
 else if(a=="reset"){if(confirm("Kembalikan menu, harga, dan topping ke pengaturan awal?")){var m=JSON.parse(JSON.stringify(DEF));setMenu(m);if(App.onMenu)App.onMenu(m);ed.classList.remove("show")}}};
G("bEdit").onclick=openEd;

/* ---------- jembatan untuk akun.js ---------- */
App.getNotes=function(){return H};
App.setNotes=function(a){H=a;persist();renderAll()};
App.getMenu=cur;
App.setMenu=function(m){if(valid(m))setMenu(m)};

/* ---------- mulai ---------- */
H=loadNotes();
var m0=loadMenu();apply(valid(m0)?m0:JSON.parse(JSON.stringify(DEF)));
renderAll();
if("serviceWorker" in navigator&&location.protocol.indexOf("http")==0&&!window.Capacitor){
 window.addEventListener("load",function(){try{navigator.serviceWorker.register("sw.js")["catch"](function(){})}catch(e){}})}
})();
