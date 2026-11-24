/* State, spaced repetition constants, durable storage (localStorage + IndexedDB mirror), daily history, cross-device sync (Supabase REST) */
const $=s=>document.querySelector(s),DAY=864e5,IV=[6e5,DAY,3*DAY,7*DAY,16*DAY,35*DAY];
let S={},hadLocal=false;try{const r=localStorage.getItem("jp2");hadLocal=!!r;S=JSON.parse(r)||{}}catch(e){}
S.ls=S.ls&&typeof S.ls=="object"?S.ls:{};
Object.assign(S,{b:S.b||{},w:S.w||{},lang:S.lang||"vi",lv:S.lv===undefined?5:S.lv,lsn:S.lsn||0,mode:S.mode||"v",qm:S.qm||"w",xp:S.xp||0,st:S.st||0,day:S.day||"",td:S.td||0,nl:S.nl||10,nd:S.nd||"",nn:S.nn||0,xt:S.xt||0,sb:S.sb||{},fg:S.fg||{},th:S.th||"",h:S.h||{},lb:S.lb||0,ts:S.ts||0});
for(const k in S.b)if(typeof S.b[k]=="number")S.b[k]=[S.b[k],Date.now(),0];
/* Progress fields only (what gets synced, backed up and merged) */
const state=()=>({b:S.b,w:S.w,wq:S.wq||{},gs:S.gs||{},ls:S.ls,fg:S.fg,xp:S.xp,st:S.st,day:S.day,td:S.td,h:S.h});
let pt,it,sy="";
/* ---- IndexedDB mirror: survives a cleared/corrupted localStorage and is the larger, more durable store ---- */
const idb=()=>new Promise((ok,no)=>{try{const r=indexedDB.open("nihongo",1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}});
async function idbPut(v){try{const d=await idb();d.transaction("kv","readwrite").objectStore("kv").put(v,"jp2")}catch(e){}}
async function idbGet(){try{const d=await idb();return await new Promise(ok=>{const r=d.transaction("kv").objectStore("kv").get("jp2");r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(null)})}catch(e){return null}}
function save(){S.ts=Date.now();try{localStorage.setItem("jp2",JSON.stringify(S))}catch(e){}clearTimeout(it);it=setTimeout(()=>idbPut(JSON.parse(JSON.stringify(S))),1500);if(S.sb.url&&S.sb.key&&S.sb.code){clearTimeout(pt);pt=setTimeout(sync,4000)}}
/* Ask the browser not to evict our data (Chrome/Android/installed PWA). */
let persisted=null;(async()=>{try{if(navigator.storage&&navigator.storage.persist){persisted=await navigator.storage.persisted();if(!persisted)persisted=await navigator.storage.persist()}}catch(e){}})();
/* On start: if localStorage was wiped, restore everything from IndexedDB; otherwise merge in anything newer. */
const boot=idbGet().then(r=>{if(!r)return idbPut(JSON.parse(JSON.stringify(S)));if(!hadLocal){S=Object.assign(S,r)}else merge(r);try{localStorage.setItem("jp2",JSON.stringify(S))}catch(e){}});
/* Daily history: S.h["YYYY-MM-DD"]=[answers, correct, xp] */
const dkey=(d=new Date())=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function hlog(ok,p){const k=dkey(),e=S.h[k]||[0,0,0];e[0]++;if(ok)e[1]++;e[2]+=p;S.h[k]=e}
const hd=()=>{const h={apikey:S.sb.key,"Content-Type":"application/json"};if(S.sb.key.startsWith("eyJ"))h.Authorization="Bearer "+S.sb.key;return h},api=()=>S.sb.url.replace(/\/$/,"")+"/rest/v1/progress";
function merge(r){if(!r)return;for(const k in r.b||{}){const a=S.b[k],b=r.b[k];if(Array.isArray(b)&&(!a||b[2]>a[2]))S.b[k]=b}
for(const k in r.w||{})S.w[k]=Math.max(S.w[k]||0,r.w[k]);S.gs=S.gs||{};for(const k in r.gs||{}){const a=S.gs[k]||[0,0],b=r.gs[k];if(b[1]>a[1])S.gs[k]=b}S.wq=S.wq||{};for(const k in r.wq||{})S.wq[k]=Math.max(S.wq[k]||0,r.wq[k]);
for(const k in r.ls||{}){const a=S.ls[k],b=r.ls[k];if(!a||b[1]>a[1])S.ls[k]=b}
for(const k in r.fg||{}){const a=S.fg[k],b=r.fg[k];if(!a||b[1]>a[1])S.fg[k]=b}
for(const k in r.h||{}){const a=S.h[k]||[0,0,0],b=r.h[k];S.h[k]=a.map((v,i)=>Math.max(v,b[i]||0))}
S.xp=Math.max(S.xp,r.xp||0);const dl=new Date(S.day||0),dr=new Date(r.day||0);
if(dr>dl){S.st=r.st;S.day=r.day;S.td=r.td}else if(+dr==+dl){S.st=Math.max(S.st,r.st||0);S.td=Math.max(S.td,r.td||0)}}
async function sync(){if(!(S.sb.url&&S.sb.key&&S.sb.code))return;try{sy="⏳";const g=await fetch(api()+"?id=eq."+encodeURIComponent(S.sb.code)+"&select=data",{headers:hd()});if(!g.ok)throw 0;merge((await g.json())[0]?.data);
const p=await fetch(api(),{method:"POST",headers:{...hd(),Prefer:"resolution=merge-duplicates"},body:JSON.stringify({id:S.sb.code,data:state(),updated_at:new Date().toISOString()})});if(!p.ok)throw 0;
sy="✅ "+new Date().toLocaleTimeString();S.ls0=Date.now();try{localStorage.setItem("jp2",JSON.stringify(S))}catch(e){}idbPut(JSON.parse(JSON.stringify(S)))}catch(e){sy="⚠️ sync error"}
if(typeof render=="function"&&["home","set"].includes(tab))render()}
/* Save immediately when the app is hidden/closed so nothing typed in the last seconds is lost. */
addEventListener("visibilitychange",()=>{if(document.visibilityState=="hidden"){try{localStorage.setItem("jp2",JSON.stringify(S))}catch(e){}idbPut(JSON.parse(JSON.stringify(S)))}});
