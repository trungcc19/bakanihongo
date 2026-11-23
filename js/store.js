/* State, spaced repetition constants, cross-device sync (Supabase REST) */
const $=s=>document.querySelector(s),DAY=864e5,IV=[6e5,DAY,3*DAY,7*DAY,16*DAY,35*DAY];
let S={};try{S=JSON.parse(localStorage.getItem("jp2"))||{}}catch(e){}
S.ls=S.ls&&typeof S.ls=="object"?S.ls:{};
Object.assign(S,{b:S.b||{},w:S.w||{},lang:S.lang||"vi",lv:S.lv===undefined?5:S.lv,lsn:S.lsn||0,mode:S.mode||"v",qm:S.qm||"w",xp:S.xp||0,st:S.st||0,day:S.day||"",td:S.td||0,nl:S.nl||10,nd:S.nd||"",nn:S.nn||0,xt:S.xt||0,sb:S.sb||{},fg:S.fg||{},th:S.th||""});
for(const k in S.b)if(typeof S.b[k]=="number")S.b[k]=[S.b[k],Date.now(),0];
const state=()=>({b:S.b,w:S.w,ls:S.ls,fg:S.fg,xp:S.xp,st:S.st,day:S.day,td:S.td});
let pt,sy="";
function save(){try{localStorage.setItem("jp2",JSON.stringify(S))}catch(e){}if(S.sb.url&&S.sb.key&&S.sb.code){clearTimeout(pt);pt=setTimeout(sync,4000)}}
const hd=()=>{const h={apikey:S.sb.key,"Content-Type":"application/json"};if(S.sb.key.startsWith("eyJ"))h.Authorization="Bearer "+S.sb.key;return h},api=()=>S.sb.url.replace(/\/$/,"")+"/rest/v1/progress";
function merge(r){if(!r)return;for(const k in r.b||{}){const a=S.b[k],b=r.b[k];if(!a||b[2]>a[2])S.b[k]=b}
for(const k in r.w||{})S.w[k]=Math.max(S.w[k]||0,r.w[k]);
for(const k in r.ls||{}){const a=S.ls[k],b=r.ls[k];if(!a||b[1]>a[1])S.ls[k]=b}
for(const k in r.fg||{}){const a=S.fg[k],b=r.fg[k];if(!a||b[1]>a[1])S.fg[k]=b}
S.xp=Math.max(S.xp,r.xp||0);const dl=new Date(S.day||0),dr=new Date(r.day||0);
if(dr>dl){S.st=r.st;S.day=r.day;S.td=r.td}else if(+dr==+dl){S.st=Math.max(S.st,r.st||0);S.td=Math.max(S.td,r.td||0)}}
async function sync(){if(!(S.sb.url&&S.sb.key&&S.sb.code))return;try{sy="⏳";const g=await fetch(api()+"?id=eq."+encodeURIComponent(S.sb.code)+"&select=data",{headers:hd()});if(!g.ok)throw 0;merge((await g.json())[0]?.data);
const p=await fetch(api(),{method:"POST",headers:{...hd(),Prefer:"resolution=merge-duplicates"},body:JSON.stringify({id:S.sb.code,data:state(),updated_at:new Date().toISOString()})});if(!p.ok)throw 0;
sy="✅ "+new Date().toLocaleTimeString();try{localStorage.setItem("jp2",JSON.stringify(S))}catch(e){}}catch(e){sy="⚠️ sync error"}
if(typeof render=="function"&&["home","set"].includes(tab))render()}
