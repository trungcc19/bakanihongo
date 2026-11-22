// Dùng: node tools/import.mjs <vocab|kanji|grammar|reading> file.tsv
// TSV có dòng tiêu đề. vocab/kanji: j r en vi l | grammar: p l en vi j xe xv
import fs from 'fs';
const [,,type,tsv]=process.argv,K=type=='grammar'?'p':'j';
const [h,...rs]=fs.readFileSync(tsv,'utf8').trim().split(/\r?\n/).map(l=>l.split('\t'));
const by={};for(const r of rs){const o=Object.fromEntries(h.map((k,i)=>[k.trim(),(r[i]||'').trim()]));o.l=+o.l;if(o.lesson)o.lesson=+o.lesson;(by[o.l]??=[]).push(o)}
const mp='data/manifest.json',M=JSON.parse(fs.readFileSync(mp));M[type]??=[];
for(const l in by){const f=`${type}/n${l}.json`,p='data/'+f;fs.mkdirSync('data/'+type,{recursive:true});
const old=fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):[],m=new Map(old.map(x=>[x[K],x]));
by[l].forEach(x=>m.set(x[K],x));fs.writeFileSync(p,JSON.stringify([...m.values()]));if(!M[type].includes(f))M[type].push(f);console.log(f,m.size)}
fs.writeFileSync(mp,JSON.stringify(M,null,1));
