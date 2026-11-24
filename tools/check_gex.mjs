// Dùng: node tools/check_gex.mjs src/grammar-ex2.txt   (câu ví dụ ngữ pháp thêm, dạng: mẫu|câu có {phần ngữ pháp}|en|vi)
import fs from 'fs';
const G=[5,4,3].flatMap(l=>JSON.parse(fs.readFileSync(`data/grammar/n${l}.json`,'utf8'))),P=new Map(G.map(g=>[g.p,g]));
const RB=/([一-龥々]+)\[([^\]]+)\]/g,plain=s=>s.replace(RB,'$1').replace(/[{}]/g,'');
const seen=new Set(G.flatMap(g=>g.ex.map(e=>e.j)));let bad=0;const cnt={};
const err=(f,n,m)=>{bad++;console.log(`${f}:${n}: ${m}`)};
for(const f of process.argv.slice(2))fs.readFileSync(f,'utf8').split(/\r?\n/).forEach((line,n)=>{n++;if(!line.trim())return;const r=line.split('|');
if(r.length!=4||r.some(x=>!x.trim()))return err(f,n,'cần 4 cột');const[p,j]=r;if(!P.has(p))return err(f,n,'không có mẫu '+p);cnt[p]=(cnt[p]||0)+1;
if(!/\{[^}]+\}/.test(j))err(f,n,'thiếu {…}');if((j.match(/\{/g)||[]).length!=(j.match(/\}/g)||[]).length)err(f,n,'ngoặc {} lệch');
const s=j.replace(/[{}]/g,'');if(/[\[\]]/.test(s.replace(RB,'$1')))err(f,n,'furigana sai: '+j);
for(const m of s.matchAll(RB))if(!/^[ぁ-ゖー]+$/.test(m[2]))err(f,n,'furigana không phải hiragana: '+m[0]);
if(/[一-龥]/.test(s.replace(RB,'')))err(f,n,'Kanji thiếu furigana: '+s.replace(RB,'').match(/[一-龥]+/g).join(','));
if(seen.has(j))err(f,n,'trùng câu có sẵn');seen.add(j)});
const miss=G.filter(g=>!cnt[g.p]).map(g=>g.p);if(miss.length)console.log('chưa có câu thêm:',miss.length,miss.slice(0,8).join(' '));
console.log(bad?bad+' lỗi':'OK');process.exit(bad?1:0);
