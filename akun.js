/* Akun opsional + sinkron antar HP (Firebase) - Tahu Kocek Merapi */
(function(){
var FB={apiKey:"AIzaSyAMceJ4ZH9l24GVjpT9Fuzov72NVqm3JgY",authDomain:"tahu-kocek-merapi-1e9c1.firebaseapp.com",projectId:"tahu-kocek-merapi-1e9c1",appId:"1:140061209222:web:d1ce1e967cb162fc90d707"};
var cu=null,cdb=null,CA=null,unsub=null,prev={},mode="in",ready=false;
var $=function(i){return document.getElementById(i)},noop=function(){};
var css=".wrap{position:relative}"
+".chip{position:absolute;right:16px;top:14px;font:inherit;font-size:12px;color:#fff4e6;padding:7px 12px;border-radius:16px;cursor:pointer;background:var(--glass,rgba(255,255,255,.12));border:var(--gb,1px solid rgba(255,255,255,.2));box-shadow:var(--gs,none);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}"
+".modal{position:fixed;left:0;top:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,1,1,.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .3s}"
+".modal.show{opacity:1;pointer-events:auto}"
+".mbox{width:100%;max-width:360px;border-radius:24px;padding:20px;color:#fff4e6;background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(25,3,2,.85));border:1px solid rgba(255,255,255,.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 20px 50px rgba(0,0,0,.5);transform:translateY(16px) scale(.97);transition:transform .35s ease}"
+".modal.show .mbox{transform:none}"
+".mbox h3{margin:0 0 4px;color:#ffd21f;font-size:18px}.mbox p{font-size:13px;color:#f0b49a;margin:6px 0 12px;line-height:1.5}.mbox p b{color:#fff4e6}"
+".mbox input{width:100%;font:inherit;font-size:16px;color:#fff4e6;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:12px 14px;margin-bottom:10px;outline:0}"
+".mbox input:focus{border-color:#ff7a00}"
+".seg{display:flex;gap:6px;margin-bottom:12px}.seg button{flex:1;font:inherit;font-size:13px;color:#f0b49a;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:9px 0;cursor:pointer}"
+".seg button.on{color:#fff;background:linear-gradient(135deg,rgba(255,70,20,.8),rgba(255,160,0,.65));border-color:rgba(255,235,170,.9)}"
+".mb{width:100%;font:inherit;font-weight:700;color:#fff;border:1px solid rgba(255,235,170,.6);border-radius:12px;padding:12px;cursor:pointer;background:linear-gradient(135deg,rgba(255,60,20,.92),rgba(255,150,0,.85))}"
+".mb.g{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25);margin-top:8px;font-weight:400}.mb:disabled{opacity:.5}"
+".er{color:#ff9a8a!important;min-height:18px;margin:0 0 8px!important}";
var sty=document.createElement("style");sty.textContent=css;document.head.appendChild(sty);
var chip=document.createElement("button");chip.className="chip";chip.textContent="👤 Akun";
document.querySelector(".wrap").appendChild(chip);
var mod=document.createElement("div");mod.className="modal";document.body.appendChild(mod);

function uname(){return cu&&cu.email?cu.email.split("@")[0].replace(/[^a-z0-9._-]/g,""):""}
function label(){chip.textContent=cu?"👤 "+uname():"👤 Akun"}
function view(){var h,t=mode=="up"?"Daftar":"Masuk",X='<button class="mb g" data-a="x">Tutup</button>';
 if(!FB.apiKey)h='<h3>Akun</h3><p>Fitur login belum diaktifkan. Aplikasi tetap jalan normal tanpa akun, data tersimpan di HP ini.</p>'+X;
 else if(!ready)h='<h3>Akun</h3><p>Memuat layanan akun. Pastikan internet menyala, lalu buka lagi.</p>'+X;
 else if(cu)h='<h3>Akun</h3><p>Masuk sebagai <b>'+uname()+'</b>.<br>Nota dan laporan otomatis menyatu di semua HP yang masuk dengan akun ini.</p><button class="mb" data-a="out">Keluar</button>'+X;
 else h='<h3>'+t+'</h3><p>Opsional. Dengan akun, nota dan laporan dari beberapa HP jadi satu. Cukup masuk sekali, tidak perlu masuk lagi setiap hari.</p><div class="seg"><button data-a="in" class="'+(mode=="in"?"on":"")+'">Masuk</button><button data-a="up" class="'+(mode=="up"?"on":"")+'">Daftar</button></div><input id="un" placeholder="Username" autocapitalize="none" autocorrect="off" autocomplete="username"><input id="pw" type="password" placeholder="Password (min. 6 karakter)" autocomplete="'+(mode=="up"?"new-password":"current-password")+'"><p class="er" id="er"></p><button class="mb" data-a="go" id="go">'+t+'</button><button class="mb g" data-a="x">Nanti saja</button>';
 mod.innerHTML='<div class="mbox">'+h+'</div>'}
function open(){view();mod.classList.add("show")}
function close(){mod.classList.remove("show")}
var M={"auth/email-already-in-use":"Username sudah dipakai, pilih yang lain","auth/invalid-credential":"Username atau password salah","auth/wrong-password":"Username atau password salah","auth/user-not-found":"Username atau password salah","auth/weak-password":"Password minimal 6 karakter","auth/network-request-failed":"Tidak ada internet","auth/operation-not-allowed":"Login Email/Password belum diaktifkan di Firebase","auth/too-many-requests":"Terlalu banyak percobaan, coba lagi nanti"};
function go(){var un=$("un").value.trim().toLowerCase(),pw=$("pw").value,er=$("er"),b=$("go"),t=mode=="up"?"Daftar":"Masuk";
 if(!/^[a-z0-9._-]{3,20}$/.test(un)){er.textContent="Username 3–20 karakter: huruf kecil, angka, titik, atau strip";return}
 if(pw.length<6){er.textContent="Password minimal 6 karakter";return}
 er.textContent="";b.disabled=true;b.textContent="Memproses…";
 var em=un+"@tahukocek.app";
 (mode=="up"?CA.createUserWithEmailAndPassword(em,pw):CA.signInWithEmailAndPassword(em,pw)).then(close).catch(function(e){er.textContent=M[e.code]||"Gagal: "+(e.code||"coba lagi");b.disabled=false;b.textContent=t})}
mod.onclick=function(e){if(e.target===mod){close();return}
 var a=e.target.getAttribute("data-a");if(!a)return;
 if(a=="x")close();else if(a=="in"||a=="up"){mode=a;view()}
 else if(a=="out")CA.signOut().then(close);else if(a=="go")go()};
chip.onclick=open;

function col(){return cdb.collection("users").doc(cu.uid).collection("notas")}
function dc(n){return {j:n.j,l:n.l,t:n.t||[],tot:n.tot,ts:n.ts}}
function snap(){prev={};H.forEach(function(n){prev[n.ts]=1})}
var origSave=window.save;
window.save=function(){
 if(cu&&cdb){var now={};
  H.forEach(function(n){now[n.ts]=1;if(!prev[n.ts]){n.c=1;col().doc(String(n.ts)).set(dc(n)).catch(noop)}});
  Object.keys(prev).forEach(function(k){if(!now[k])col().doc(k).delete().catch(noop)});
  prev=now}
 origSave()};
function attach(){snap();
 unsub=col().orderBy("ts","desc").onSnapshot(function(s){
  if(s.metadata.fromCache&&!s.docs.length)return;
  var a=s.docs.map(function(d){return d.data()});
  a.sort(function(x,y){return y.ts-x.ts});
  var k=a.length;a.forEach(function(n,i){n.id=k-i;n.c=1});
  H=a;origSave();snap();render();label()},noop)}
function onUser(u){cu=u;if(unsub){unsub();unsub=null}label();if(!u)return;
 var un=H.filter(function(n){return !n.c});
 function chunk(i){if(i>=un.length)return Promise.resolve();
  var b=cdb.batch();un.slice(i,i+400).forEach(function(n){b.set(col().doc(String(n.ts)),dc(n))});
  return b.commit().then(function(){return chunk(i+400)})}
 chunk(0).then(function(){un.forEach(function(n){n.c=1});origSave();attach()}).catch(noop)}
function init(){firebase.initializeApp(FB);CA=firebase.auth();cdb=firebase.firestore();
 try{cdb.enablePersistence({synchronizeTabs:true}).catch(noop)}catch(e){}
 ready=true;CA.onAuthStateChanged(onUser)}
if(FB.apiKey){
 if(window.firebase)init();
 else{var B="https://www.gstatic.com/firebasejs/10.12.2/firebase-",L=["app","auth","firestore"],i=0;
  (function nx(){if(i>=L.length){init();return}var s=document.createElement("script");s.src=B+L[i++]+"-compat.js";s.onload=nx;document.head.appendChild(s)})()}}
})();
/* ===== Topping bisa lebih dari 1 (tombol + dan -) ===== */
(function(){
var G=function(i){return document.getElementById(i)};
var sty=document.createElement("style");
sty.textContent=".trow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:16px;background:var(--glass,rgba(255,255,255,.1));border:var(--gb,1px solid rgba(255,255,255,.2));box-shadow:var(--gs,none);-webkit-backdrop-filter:var(--blur,blur(16px));backdrop-filter:var(--blur,blur(16px));transition:background .3s,border-color .3s,box-shadow .3s}"
+".trow.on{background:linear-gradient(135deg,rgba(255,70,20,.35),rgba(255,160,0,.25));border-color:rgba(255,235,170,.7);box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 0 22px rgba(255,90,0,.45)}"
+".tn b{display:block;font-size:16px}.tn span{font-size:13px;color:#f0b49a}"
+".qty{display:flex;align-items:center;gap:10px}"
+".qty button{width:40px;height:40px;border-radius:50%;font:inherit;font-size:22px;line-height:1;color:#fff;border:1px solid rgba(255,235,170,.5);background:linear-gradient(135deg,rgba(255,60,20,.85),rgba(255,150,0,.8));cursor:pointer;transition:transform .2s,opacity .3s}"
+".qty button:active{transform:scale(.86)}.qty button:disabled{opacity:.3;background:rgba(255,255,255,.1)}"
+".qty i{font-style:normal;min-width:28px;text-align:center;font-size:19px;font-weight:700;color:#ffd21f}";
document.head.appendChild(sty);
var box=G("top"),R=[];box.innerHTML="";
function paint(i){var q=st.t[i]||0;R[i].n.textContent=q;R[i].r.classList.toggle("on",q>0);R[i].m.disabled=q<1}
tops.forEach(function(x,i){
 var r=document.createElement("div");r.className="trow";
 r.innerHTML='<div class="tn"><b>'+x[0]+'</b><span>+ '+rp(x[1])+' per porsi</span></div><div class="qty"><button class="qm" aria-label="Kurangi">−</button><i>0</i><button class="qp" aria-label="Tambah">+</button></div>';
 box.appendChild(r);
 R[i]={r:r,n:r.querySelector("i"),m:r.querySelector(".qm")};
 R[i].m.disabled=true;
 r.querySelector(".qp").onclick=function(){st.t[i]=Math.min(99,(st.t[i]||0)+1);paint(i);upd()};
 R[i].m.onclick=function(){st.t[i]=Math.max(0,(st.t[i]||0)-1);paint(i);upd()};
});
window.upd=function(){var o=G("order"),r=G("ring");
 if(st.j===null){r.innerHTML="Pilih tahu dulu<b>Rp 0</b>";o.disabled=true;return}
 var t=jenis[st.j][1]+(st.l?st.l[1]:0);
 tops.forEach(function(x,i){t+=x[1]*(st.t[i]||0)});
 r.innerHTML=(st.l?"Level "+st.l[0]:"Pilih level")+"<b>"+rp(t)+"</b>";
 o.disabled=!st.l};
G("order").onclick=function(){
 var tp=[],tot=jenis[st.j][1]+st.l[1];
 tops.forEach(function(x,i){var q=st.t[i]||0;if(q>0){tp.push(q>1?x[0]+" x"+q:x[0]);tot+=x[1]*q}});
 H.unshift({id:H.length?H[0].id+1:1,j:jenis[st.j][0],l:st.l[0],t:tp,tot:tot,ts:Date.now()});
 save();render();
 st={j:null,l:null,t:{}};
 document.querySelectorAll(".btn.on").forEach(function(b){b.classList.remove("on")});
 tops.forEach(function(x,i){paint(i)});
 G("lvl").classList.remove("show");upd();go("nota")};
})();
/* ===== Edit menu: jenis, topping, harga ===== */
(function(){
var G=function(i){return document.getElementById(i)},noop=function(){};
var DEF={j:[["BIJIAN",2000,"Tahu Kocek "],["INCIP",7000,"Tahu Kocek "],["ABG",10000,"Tahu Kocek "],["MIX",13000,"Tahu Kocek "]],t:[["Gubis",1000],["Sosis",2000],["Fishball",2000]],l:[0,3000,5000]};
var KEY="menu_tahu",unsubM=null,R=[];
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function cur(){return {j:jenis.map(function(x){return [x[0],x[1],x[2]||""]}),t:tops.map(function(x){return [x[0],x[1]]}),l:[lv[0][2],lv[1][2],lv[2][2]]}}
function setArr(a,s){a.length=0;s.forEach(function(x){a.push(x.slice())})}
function valid(m){return m&&m.j&&m.j.length&&m.t&&m.l&&m.l.length==3}
function load(){try{var s=localStorage.getItem(KEY);return s?JSON.parse(s):null}catch(e){return null}}
function saveLocal(m){try{localStorage.setItem(KEY,JSON.stringify(m))}catch(e){}}
function apply(m){setArr(jenis,m.j);setArr(tops,m.t);
 m.l.forEach(function(p,i){lv[i][2]=p;lv[i][1]=p>0?"+ "+rp(p):"Gratis"});
 st={j:null,l:null,t:{}};build()}
function setM(m){apply(m);saveLocal(m)}

var sty=document.createElement("style");
sty.textContent=".topbar{display:flex;justify-content:flex-end;gap:8px;margin-bottom:4px}.topbar .chip{position:static}"
+".trow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:16px;background:var(--glass,rgba(255,255,255,.1));border:var(--gb,1px solid rgba(255,255,255,.2));box-shadow:var(--gs,none);-webkit-backdrop-filter:var(--blur,blur(16px));backdrop-filter:var(--blur,blur(16px));transition:background .3s,border-color .3s,box-shadow .3s}"
+".trow.on{background:linear-gradient(135deg,rgba(255,70,20,.35),rgba(255,160,0,.25));border-color:rgba(255,235,170,.7);box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 0 22px rgba(255,90,0,.45)}"
+".tn b{display:block;font-size:16px}.tn span{font-size:13px;color:#f0b49a}"
+".qty{display:flex;align-items:center;gap:10px}"
+".qty button{width:40px;height:40px;border-radius:50%;font:inherit;font-size:22px;line-height:1;color:#fff;border:1px solid rgba(255,235,170,.5);background:linear-gradient(135deg,rgba(255,60,20,.85),rgba(255,150,0,.8));cursor:pointer;transition:transform .2s,opacity .3s}"
+".qty button:active{transform:scale(.86)}.qty button:disabled{opacity:.3;background:rgba(255,255,255,.1)}"
+".qty i{font-style:normal;min-width:28px;text-align:center;font-size:19px;font-weight:700;color:#ffd21f}"
+".mbox{max-height:88vh;overflow-y:auto}.mbox h4{margin:14px 0 8px;color:#ffd21f;font-size:14px}"
+".ed{display:flex;gap:6px;align-items:center;margin-bottom:8px}.ed input{width:auto;margin:0;min-width:0}.ed .en{flex:1.6}.ed .ep,.ed .el{flex:1}"
+".ed .ex{width:40px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);color:#fff;cursor:pointer}"
+".ed .ln{flex:1;font-size:14px}.mb.sm{padding:9px;font-size:13px;margin-bottom:6px}";
document.head.appendChild(sty);

function build(){
 var jx=G("jenis"),jb2=[];jx.innerHTML="";
 jenis.forEach(function(x,i){var b=mk(jx,"<b>"+esc((x[2]||"")+x[0])+"</b><span>"+rp(x[1])+"</span>");jb2.push(b);
  b.onclick=function(){st.j=i;jb2.forEach(function(e,k){e.classList.toggle("on",k==i)});G("lvl").classList.add("show");upd()}});
 var lr=G("lvlrows"),nb2=[];lr.innerHTML="";
 lv.forEach(function(g){var r=document.createElement("div");r.className="row";
  r.innerHTML='<div class="rh"><span>Level '+g[0]+'</span><em>'+g[1]+'</em></div>';
  var n=document.createElement("div");n.className="nums";r.appendChild(n);
  for(var v=g[3];v<=g[4];v++)(function(v){var b=mk(n,v);nb2.push([b,v]);
   b.onclick=function(){st.l=[v,g[2]];nb2.forEach(function(e){e[0].classList.toggle("on",e[1]==v)});upd()}})(v);
  lr.appendChild(r)});
 var box=G("top");box.innerHTML="";R=[];
 tops.forEach(function(x,i){var r=document.createElement("div");r.className="trow";
  r.innerHTML='<div class="tn"><b>'+esc(x[0])+'</b><span>+ '+rp(x[1])+' per porsi</span></div><div class="qty"><button class="qm" aria-label="Kurangi">−</button><i>0</i><button class="qp" aria-label="Tambah">+</button></div>';
  box.appendChild(r);R[i]={r:r,n:r.querySelector("i"),m:r.querySelector(".qm")};R[i].m.disabled=true;
  r.querySelector(".qp").onclick=function(){st.t[i]=Math.min(25,(st.t[i]||0)+1);paint(i);upd()};
  R[i].m.onclick=function(){st.t[i]=Math.max(0,(st.t[i]||0)-1);paint(i);upd()}});
 G("lvl").classList.remove("show");upd()}
function paint(i){var q=st.t[i]||0;if(!R[i])return;R[i].n.textContent=q;R[i].r.classList.toggle("on",q>0);R[i].m.disabled=q<1}
window.upd=function(){var o=G("order"),r=G("ring");
 if(st.j===null||!jenis[st.j]){r.innerHTML="Pilih menu dulu<b>Rp 0</b>";o.disabled=true;return}
 var t=jenis[st.j][1]+(st.l?st.l[1]:0);
 tops.forEach(function(x,i){t+=x[1]*(st.t[i]||0)});
 r.innerHTML=(st.l?"Level "+st.l[0]:"Pilih level")+"<b>"+rp(t)+"</b>";o.disabled=!st.l};
G("order").onclick=function(){
 var tp=[],tot=jenis[st.j][1]+st.l[1];
 tops.forEach(function(x,i){var q=st.t[i]||0;if(q>0){tp.push(q>1?x[0]+" x"+q:x[0]);tot+=x[1]*q}});
 H.unshift({id:H.length?H[0].id+1:1,j:jenis[st.j][0],l:st.l[0],t:tp,tot:tot,ts:Date.now()});
 save();render();
 st={j:null,l:null,t:{}};
 document.querySelectorAll(".btn.on").forEach(function(b){b.classList.remove("on")});
 tops.forEach(function(x,i){paint(i)});
 G("lvl").classList.remove("show");upd();go("nota")};

/* tombol Edit di sebelah tombol Akun */
var wrap=document.querySelector(".wrap"),ac=document.querySelector(".chip");
var bar=document.createElement("div");bar.className="topbar";wrap.insertBefore(bar,wrap.firstChild);
var ec=document.createElement("button");ec.className="chip";ec.textContent="✏️ Edit";bar.appendChild(ec);if(ac)bar.appendChild(ac);
var ed=document.createElement("div");ed.className="modal";document.body.appendChild(ed);
function row(n,p,pre){return '<div class="ed" data-p="'+esc(pre||"")+'"><input class="en" maxlength="30" placeholder="Nama" value="'+esc(n)+'"><input class="ep" type="number" inputmode="numeric" min="0" placeholder="Harga" value="'+p+'"><button class="ex" data-a="del" aria-label="Hapus">🗑</button></div>'}
function openEd(){var m=cur();
 ed.innerHTML='<div class="mbox"><h3>Edit Menu</h3><p>Ubah nama dan harga, hapus, atau tambah menu baru. Setelah disimpan langsung dipakai.</p>'
 +'<h4>Jenis menu</h4><div id="ej">'+m.j.map(function(x){return row(x[0],x[1],x[2])}).join("")+'</div><button class="mb g sm" data-a="addj">+ Tambah jenis</button>'
 +'<h4>Topping</h4><div id="et">'+m.t.map(function(x){return row(x[0],x[1])}).join("")+'</div><button class="mb g sm" data-a="addt">+ Tambah topping</button>'
 +'<h4>Harga tambahan level</h4>'+["1 – 5","6 – 10","11 – 15"].map(function(n,i){return '<div class="ed"><span class="ln">Level '+n+'</span><input class="el" type="number" inputmode="numeric" min="0" value="'+m.l[i]+'"></div>'}).join("")
 +'<p class="er" id="eer"></p><button class="mb" data-a="save">Simpan</button><button class="mb g" data-a="cancel">Batal</button><button class="mb g" data-a="reset">Kembalikan menu awal</button></div>';
 ed.classList.add("show")}
function rd(id){var a=[],ok=true;
 ed.querySelectorAll("#"+id+" .ed").forEach(function(r){var n=r.querySelector(".en").value.replace(/[<>"&]/g,"").trim(),p=r.querySelector(".ep").value;
  if(!n&&p==="")return;var v=Number(p);
  if(!n||p===""||isNaN(v)||v<0||v>10000000){ok=false;return}
  var o=[n,Math.round(v)];if(id=="ej")o.push(r.getAttribute("data-p")||"");a.push(o)});
 return ok?a:null}
function dup(a){var s={};for(var i=0;i<a.length;i++){var k=a[i][0].toLowerCase();if(s[k])return true;s[k]=1}return false}
function saveEd(){var er=G("eer"),j=rd("ej"),t=rd("et"),l=[],bad=false;
 ed.querySelectorAll(".el").forEach(function(e){var v=Number(e.value);if(e.value===""||isNaN(v)||v<0||v>10000000)bad=true;l.push(Math.round(v))});
 if(!j||!t||bad){er.textContent="Nama harus diisi dan harga harus angka 0 atau lebih";return}
 if(!j.length){er.textContent="Minimal ada 1 jenis menu";return}
 if(dup(j)||dup(t)){er.textContent="Nama tidak boleh sama dalam satu daftar";return}
 var m={j:j,t:t,l:l};setM(m);pushCloud();ed.classList.remove("show")}
ed.onclick=function(e){if(e.target===ed){ed.classList.remove("show");return}
 var a=e.target.getAttribute("data-a");if(!a)return;
 if(a=="del"){var r=e.target.closest(".ed");if(r)r.remove()}
 else if(a=="addj")G("ej").insertAdjacentHTML("beforeend",row("","",""))
 else if(a=="addt")G("et").insertAdjacentHTML("beforeend",row("",""))
 else if(a=="save")saveEd()
 else if(a=="cancel")ed.classList.remove("show")
 else if(a=="reset"){if(confirm("Kembalikan menu, harga, dan topping ke pengaturan awal?")){var m=JSON.parse(JSON.stringify(DEF));setM(m);pushCloud();ed.classList.remove("show")}}};
ec.onclick=openEd;

/* sinkron menu antar HP (hanya kalau sudah login akun) */
function cdoc(){var u=firebase.auth().currentUser;return u?firebase.firestore().collection("users").doc(u.uid).collection("notas").doc("_menu"):null}
function pushCloud(){try{var d=cdoc();if(d)d.set({menu:JSON.stringify(cur())}).catch(noop)}catch(e){}}
function watch(){var n=0,t=setInterval(function(){
 if(++n>80){clearInterval(t);return}
 if(!(window.firebase&&firebase.apps&&firebase.apps.length))return;
 clearInterval(t);
 firebase.auth().onAuthStateChanged(function(u){
  if(unsubM){unsubM();unsubM=null}if(!u)return;
  var first=true;
  unsubM=cdoc().onSnapshot(function(s){
   if(s.exists){var j=(s.data()||{}).menu;
    if(j&&j!==JSON.stringify(cur())){try{var m=JSON.parse(j);if(valid(m))setM(m)}catch(e){}}}
   else{if(s.metadata&&s.metadata.fromCache)return;if(first)pushCloud()}
   first=false},noop)})},500)}

var m0=load();apply(valid(m0)?m0:JSON.parse(JSON.stringify(DEF)));
watch();
})();
/* ===== Jumlah porsi tahu kocek (tombol + dan -, maks 50) ===== */
(function(){
var G=function(i){return document.getElementById(i)},MAX=50,J=[];
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function paintJ(i){var q=(st.q||{})[i]||0;if(!J[i])return;J[i].n.textContent=q;J[i].r.classList.toggle("on",q>0);J[i].m.disabled=q<1;J[i].p.disabled=q>=MAX}
var obs=new MutationObserver(function(){rebuildJ()});
function rebuildJ(){obs.disconnect();var jx=G("jenis");jx.innerHTML="";J=[];st.q=st.q||{};
 jenis.forEach(function(x,i){var r=document.createElement("div");r.className="trow jrow";
  r.innerHTML='<div class="tn"><b>'+esc((x[2]||"")+x[0])+'</b><span>'+rp(x[1])+' per porsi</span></div><div class="qty"><button class="qm" aria-label="Kurangi">−</button><i>0</i><button class="qp" aria-label="Tambah">+</button></div>';
  jx.appendChild(r);J[i]={r:r,n:r.querySelector("i"),m:r.querySelector(".qm"),p:r.querySelector(".qp")};
  J[i].p.onclick=function(){st.q[i]=Math.min(MAX,(st.q[i]||0)+1);paintJ(i);upd()};
  J[i].m.onclick=function(){st.q[i]=Math.max(0,(st.q[i]||0)-1);paintJ(i);upd()};
  paintJ(i)});
 obs.observe(jx,{childList:true});upd()}
window.upd=function(){var o=G("order"),r=G("ring"),q=st.q||{},pc=0,t=0;
 jenis.forEach(function(x,i){var n=q[i]||0;pc+=n;t+=x[1]*n});
 if(!pc){r.innerHTML="Pilih menu dulu<b>Rp 0</b>";o.disabled=true;G("lvl").classList.remove("show");return}
 G("lvl").classList.add("show");
 if(st.l)t+=st.l[1]*pc;
 tops.forEach(function(x,i){t+=x[1]*(st.t[i]||0)});
 r.innerHTML=(st.l?"Level "+st.l[0]:"Pilih level")+" · "+pc+" porsi<b>"+rp(t)+"</b>";o.disabled=!st.l};
G("order").onclick=function(){
 var q=st.q||{},it=[],tot=0,pc=0,tp=[];
 jenis.forEach(function(x,i){var n=q[i]||0;if(n>0){it.push(n>1?x[0]+" x"+n:x[0]);tot+=x[1]*n;pc+=n}});
 if(!pc||!st.l)return;
 tot+=st.l[1]*pc;
 tops.forEach(function(x,i){var n=st.t[i]||0;if(n>0){tp.push(n>1?x[0]+" x"+n:x[0]);tot+=x[1]*n}});
 H.unshift({id:H.length?H[0].id+1:1,j:it.join(", "),l:st.l[0],t:tp,tot:tot,ts:Date.now()});
 save();render();
 st={j:null,q:{},l:null,t:{}};
 document.querySelectorAll(".btn.on").forEach(function(b){b.classList.remove("on")});
 document.querySelectorAll("#top .trow").forEach(function(r){r.classList.remove("on");r.querySelector("i").textContent="0";r.querySelector(".qm").disabled=true});
 jenis.forEach(function(x,i){paintJ(i)});
 G("lvl").classList.remove("show");upd();go("nota")};

/* rincian harian: jumlah porsi terjual per jenis */
function parseJ(s){return String(s).split(", ").map(function(x){var m=/^(.*) x(\d+)$/.exec(x);return m?[m[1],+m[2]]:[x,1]})}
var origLap=window.lap;
window.lap=function(){origLap();if(LV!="h")return;
 var r=dr("h",LO),A=r[0].getTime(),B=r[1].getTime(),cnt={},ord=[];
 jenis.forEach(function(j){cnt[j[0]]=0;ord.push(j[0])});
 H.forEach(function(n){if(n.ts<A||n.ts>=B)return;parseJ(n.j).forEach(function(p){if(!(p[0] in cnt)){cnt[p[0]]=0;ord.push(p[0])}cnt[p[0]]+=p[1]})});
 var mx=1;ord.forEach(function(k){if(cnt[k]>mx)mx=cnt[k]});
 var bars=G("lap").querySelector(".bars");
 if(bars)bars.innerHTML=ord.map(function(k){return '<div class="br"><u>'+esc(k)+'</u><div><i style="width:'+Math.round(cnt[k]/mx*100)+'%"></i></div><em>'+cnt[k]+' porsi</em></div>'}).join("")};

var rq=document.querySelector("#p-menu h2 .req");if(rq)rq.textContent="(wajib, bisa lebih dari 1, maks. "+MAX+" per jenis)";
rebuildJ();lap();
})();
