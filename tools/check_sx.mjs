// Dùng: node tools/check_sx.mjs src/sx-n5-a.txt [...]   (kiểm tra câu ví dụ thêm, dạng: từ|câu|en|vi)
// Kiểm tra: furigana hợp lệ, câu có chứa từ (hoặc gốc từ đã chia), cách đọc của các từ có trong dữ liệu khớp với furigana.
import fs from 'fs';
const V=[5,4,3].flatMap(l=>JSON.parse(fs.readFileSync(`data/vocab/n${l}.json`,'utf8')));
const RB=/([一-龥々]+)\[([^\]]+)\]/g,plain=s=>s.replace(RB,'$1'),kj=s=>/[一-龥]/.test(s);
const pieces=s=>{const o=[];let i=0;for(const m of s.matchAll(RB)){for(const c of s.slice(i,m.index))o.push([c,c]);o.push([m[1],m[2]]);i=m.index+m[0].length}for(const c of s.slice(i))o.push([c,c]);return o};
const byJ=new Map();for(const v of V)if(kj(v.j)&&v.j[0]!='〜'){if(!byJ.has(v.j))byJ.set(v.j,new Set());byJ.get(v.j).add(v.r.replace(/[（(].*$/,''))}
let bad=0;const err=(f,n,m)=>{bad++;console.log(`${f}:${n}: ${m}`)};
for(const f of process.argv.slice(2)){fs.readFileSync(f,'utf8').split(/\r?\n/).forEach((line,n)=>{n++;if(!line.trim())return;const r=line.split('|');
if(r.length!=4||r.some(x=>!x.trim()))return err(f,n,'cần 4 cột: '+line.slice(0,40));const[w,j]=r,p=plain(j);
if(/[\[\]]/.test(p))err(f,n,'furigana sai (ngoặc thừa hoặc chữ trước ngoặc không phải Kanji): '+j);
for(const m of j.matchAll(RB))if(!/^[ぁ-ゖー]+$/.test(m[2]))err(f,n,'furigana không phải hiragana: '+m[0]);
if(/[一-龥]/.test(j.replace(RB,'')))err(f,n,'Kanji thiếu furigana: '+j.replace(RB,'').match(/[一-龥]+/g).join(','));
const stem=w.length>1&&kj(w)?w.slice(0,-1):w;if(!p.includes(w)&&!(stem!=w&&p.includes(stem)))err(f,n,'câu không có từ '+w);
// reading check: every known vocab word whose span aligns with ruby pieces must have the same reading
const P=pieces(j),pl=P.map(x=>x[0]).join('');for(const[jw,rs]of byJ){let k=pl.indexOf(jw);while(k>=0){let a=0,i=0;while(i<P.length&&a<k){a+=P[i][0].length;i++}
if(a==k){let b=a,rd='',e=i;while(e<P.length&&b<k+jw.length){b+=P[e][0].length;rd+=P[e][1];e++}if(b==k+jw.length&&!rs.has(rd)&&!(jw.length==1))err(f,n,`đọc ${jw}=${rd}, dữ liệu: ${[...rs].join('/')}`)}k=pl.indexOf(jw,k+1)}}})}
console.log(bad?bad+' lỗi':'OK');process.exit(bad?1:0);
