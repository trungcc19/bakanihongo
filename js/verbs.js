/* Verb conjugation engine: ます / て / ない / た for group 1, 2, 3 verbs */
const UR={う:"い",く:"き",ぐ:"ぎ",す:"し",つ:"ち",ぬ:"に",ぶ:"び",む:"み",る:"り"},NA={う:"わ",く:"か",ぐ:"が",す:"さ",つ:"た",ぬ:"な",ぶ:"ば",む:"ま",る:"ら"},TE={う:"って",つ:"って",る:"って",む:"んで",ぶ:"んで",ぬ:"んで",く:"いて",ぐ:"いで",す:"して"},SU={ます:"ます",て:"て",ない:"ない",た:"た"},FL={ます:"ます形",て:"て形",ない:"ない形",た:"た形"};
const G1X=["帰る","入る","走る","知る","切る","要る","減る","限る"];
const isV=x=>/^to /.test(x.en)&&/[うくぐすつぬぶむる]$/.test(x.j);
function grp(x){if(x.j=="する"||x.j=="来る")return 3;if(!x.j.endsWith("る")||G1X.includes(x.j)||x.j=="ある")return 1;return/[いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ]$/.test(x.r.slice(0,-1))?2:1}
function cj(w,f,gg){const g=gg||grp(w);if(w.j=="する")return["し"+SU[f],"し"+SU[f]];if(w.j=="来る")return["来"+SU[f],(f=="ない"?"こ":"き")+SU[f]];
const h=s=>{const l=s.slice(-1),st=s.slice(0,-1);if(g==2)return st+SU[f];if(f=="ます")return st+(UR[l]||l)+"ます";if(f=="ない")return w.j=="ある"?"ない":st+(NA[l]||l)+"ない";let t=/(行く|いく)$/.test(s)?"って":(TE[l]||"て");if(f=="た")t=t.replace(/て$/,"た").replace(/で$/,"だ");return st+t};return[h(w.j),h(w.r)]}
const fm=v=>v[0]==v[1]?v[0]:v[0]+"（"+v[1]+"）";
