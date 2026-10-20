/* Tahu Kocek Merapi - akun opsional dan sinkron antar HP (Firebase) */
(function(){
"use strict";
var App=window.App;if(!App)return;
var FB={apiKey:"AIzaSyAMceJ4ZH9l24GVjpT9Fuzov72NVqm3JgY",authDomain:"tahu-kocek-merapi-1e9c1.firebaseapp.com",projectId:"tahu-kocek-merapi-1e9c1",appId:"1:140061209222:web:d1ce1e967cb162fc90d707"};
var G=function(i){return document.getElementById(i)},noop=function(){};
var cu=null,cdb=null,CA=null,unsub=null,unsubM=null,prev={},mode="in",ready=false;
var chip=G("bAkun"),mod=G("mAkun");

/* ---------- tampilan akun ---------- */
function uname(){return cu&&cu.email?cu.email.split("@")[0].replace(/[^a-z0-9._-]/g,""):""}
function label(){chip.textContent=cu?"👤 "+uname():"👤 Akun"}
function view(){var h,t=mode=="up"?"Daftar":"Masuk",X='<button class="mb g" data-a="x">Tutup</button>';
 if(!FB.apiKey)h='<h3>Akun</h3><p>Fitur login belum diaktifkan. Aplikasi tetap jalan normal tanpa akun, data tersimpan di HP ini.</p>'+X;
 else if(!ready)h='<h3>Akun</h3><p>Memuat layanan akun. Pastikan internet menyala, lalu buka lagi.</p>'+X;
 else if(cu)h='<h3>Akun</h3><p>Masuk sebagai <b>'+uname()+'</b>.<br>Nota, laporan, dan menu otomatis menyatu di semua HP yang masuk dengan akun ini.</p><button class="mb" data-a="out">Keluar</button>'+X;
 else h='<h3>'+t+'</h3><p>Opsional. Dengan akun, nota dan laporan dari beberapa HP jadi satu. Cukup masuk sekali, tidak perlu masuk lagi setiap hari.</p><div class="seg"><button data-a="in" class="'+(mode=="in"?"on":"")+'">Masuk</button><button data-a="up" class="'+(mode=="up"?"on":"")+'">Daftar</button></div><input id="un" placeholder="Username" autocapitalize="none" autocorrect="off" autocomplete="username"><input id="pw" type="password" placeholder="Password (min. 6 karakter)" autocomplete="'+(mode=="up"?"new-password":"current-password")+'"><p class="er" id="er"></p><button class="mb" data-a="go" id="go">'+t+'</button><button class="mb g" data-a="x">Nanti saja</button>';
 mod.innerHTML='<div class="mbox">'+h+'</div>'}
function open(){view();mod.classList.add("show")}
function close(){mod.classList.remove("show")}
var M={"auth/email-already-in-use":"Username sudah dipakai, pilih yang lain","auth/invalid-credential":"Username atau password salah","auth/wrong-password":"Username atau password salah","auth/user-not-found":"Username atau password salah","auth/weak-password":"Password minimal 6 karakter","auth/network-request-failed":"Tidak ada internet","auth/operation-not-allowed":"Login Email/Password belum diaktifkan di Firebase","auth/too-many-requests":"Terlalu banyak percobaan, coba lagi nanti"};
function submit(){var un=G("un").value.trim().toLowerCase(),pw=G("pw").value,er=G("er"),b=G("go"),t=mode=="up"?"Daftar":"Masuk";
 if(!/^[a-z0-9._-]{3,20}$/.test(un)){er.textContent="Username 3–20 karakter: huruf kecil, angka, titik, atau strip";return}
 if(pw.length<6){er.textContent="Password minimal 6 karakter";return}
 er.textContent="";b.disabled=true;b.textContent="Memproses…";
 var em=un+"@tahukocek.app";
 (mode=="up"?CA.createUserWithEmailAndPassword(em,pw):CA.signInWithEmailAndPassword(em,pw)).then(close).catch(function(e){er.textContent=M[e.code]||"Gagal: "+(e.code||"coba lagi");b.disabled=false;b.textContent=t})}
mod.onclick=function(e){if(e.target===mod){close();return}
 var a=e.target.getAttribute("data-a");if(!a)return;
 if(a=="x")close();else if(a=="in"||a=="up"){mode=a;view()}
 else if(a=="out")CA.signOut().then(close);else if(a=="go")submit()};
chip.onclick=open;

/* ---------- sinkron nota ---------- */
function col(){return cdb.collection("users").doc(cu.uid).collection("notas")}
function dc(n){return {j:n.j||"",l:n.l,t:n.t||[],s:n.s||[],tot:n.tot,ts:n.ts}}
function snap(){prev={};App.getNotes().forEach(function(n){prev[n.ts]=1})}
App.onNotes=function(H){
 if(!(cu&&cdb))return;var now={};
 H.forEach(function(n){now[n.ts]=1;if(!prev[n.ts]){n.c=1;col().doc(String(n.ts)).set(dc(n)).catch(noop)}});
 Object.keys(prev).forEach(function(k){if(!now[k])col().doc(k).delete().catch(noop)});
 prev=now};
function attach(){snap();
 unsub=col().orderBy("ts","desc").onSnapshot(function(s){
  if(s.metadata.fromCache&&!s.docs.length)return;
  var a=s.docs.map(function(d){return d.data()});
  a.sort(function(x,y){return y.ts-x.ts});
  var k=a.length;a.forEach(function(n,i){n.id=k-i;n.c=1});
  App.setNotes(a);snap();label()},noop)}

/* ---------- sinkron menu (disimpan di dokumen _menu, tidak perlu ubah aturan Firebase) ---------- */
function mdoc(){var u=firebase.auth().currentUser;return u?firebase.firestore().collection("users").doc(u.uid).collection("notas").doc("_menu"):null}
App.onMenu=function(){try{var d=mdoc();if(d)d.set({menu:JSON.stringify(App.getMenu())}).catch(noop)}catch(e){}};
function watchMenu(u){if(unsubM){unsubM();unsubM=null}if(!u)return;
 var first=true;
 unsubM=mdoc().onSnapshot(function(s){
  if(s.exists){var j=(s.data()||{}).menu;
   if(j&&j!==JSON.stringify(App.getMenu())){try{App.setMenu(JSON.parse(j))}catch(e){}}}
  else{if(s.metadata&&s.metadata.fromCache)return;if(first)App.onMenu()}
  first=false},noop)}

/* ---------- masuk / keluar ---------- */
function onUser(u){cu=u;if(unsub){unsub();unsub=null}label();watchMenu(u);if(!u)return;
 var un=App.getNotes().filter(function(n){return !n.c});
 function chunk(i){if(i>=un.length)return Promise.resolve();
  var b=cdb.batch();un.slice(i,i+400).forEach(function(n){b.set(col().doc(String(n.ts)),dc(n))});
  return b.commit().then(function(){return chunk(i+400)})}
 chunk(0).then(function(){un.forEach(function(n){n.c=1});App.setNotes(App.getNotes());attach()}).catch(noop)}
function init(){firebase.initializeApp(FB);CA=firebase.auth();cdb=firebase.firestore();
 try{cdb.enablePersistence({synchronizeTabs:true}).catch(noop)}catch(e){}
 ready=true;CA.onAuthStateChanged(onUser)}

/* ---------- mulai ---------- */
if(FB.apiKey){
 if(window.firebase)init();
 else{var B="https://www.gstatic.com/firebasejs/10.12.2/firebase-",L=["app","auth","firestore"],i=0;
  (function nx(){if(i>=L.length){init();return}var s=document.createElement("script");s.src=B+L[i++]+"-compat.js";s.onload=nx;document.head.appendChild(s)})()}}
})();
