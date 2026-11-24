// Dùng: node tools/build_sx.mjs   (gộp src/sx-n*-*.txt → src/sent-sx-nX.tsv rồi nhập vào data/sentence/nX.json)
// Mỗi dòng sx: từ|câu (furigana 漢字[かな])|English|Tiếng Việt. Kiểm tra trước bằng: node tools/check_sx.mjs src/sx-*.txt
import fs from 'fs';import {execFileSync} from 'child_process';
for(const l of [5,4,3]){const fs_=fs.readdirSync('src').filter(f=>f.startsWith(`sx-n${l}-`)&&f.endsWith('.txt'));if(!fs_.length)continue;
const rows=fs_.flatMap(f=>fs.readFileSync('src/'+f,'utf8').split(/\r?\n/).filter(x=>x.trim()).map(x=>{const[,j,en,vi]=x.split('|');return[l,j,en,vi].join('\t')}));
const out=`src/sent-sx-n${l}.tsv`;fs.writeFileSync(out,'l\tj\ten\tvi\n'+rows.join('\n')+'\n');console.log(out,rows.length);
execFileSync('node',['tools/import.mjs','sentence',out],{stdio:'inherit'})}
