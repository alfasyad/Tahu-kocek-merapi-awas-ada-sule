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
