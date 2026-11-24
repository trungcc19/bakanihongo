# Dùng: python3 tools/build_grammar.py   (đọc src/grammar-v2.txt + src/grammar-notes.txt, ghi data/grammar/nX.json)
# grammar-v2.txt, mỗi dòng: l|p|form|en|vi|j1|en1|vi1|j2|en2|vi2|j3|en3|vi3 ; phần ngữ pháp trong câu đánh dấu {…}, furigana dạng 私[わたし]
# grammar-notes.txt, mỗi dòng: p|cách dùng (tiếng Việt, các ý cách nhau bằng " • ")|usage (English)
import json,os
here=os.path.dirname(__file__)
notes={}
np_=os.path.join(here,'..','src','grammar-notes.txt')
if os.path.exists(np_):
    for line in open(np_,encoding='utf8'):
        if not line.strip(): continue
        r=line.rstrip('\n').split('|')
        assert len(r)==3,(len(r),line[:40])
        notes[r[0]]=(r[1],r[2])
by={}
for line in open(os.path.join(here,'..','src','grammar-v2.txt'),encoding='utf8'):
    if not line.strip(): continue
    r=line.rstrip('\n').split('|')
    assert len(r)==14,(len(r),line[:40])
    ex=[{'j':r[i],'en':r[i+1],'vi':r[i+2]} for i in (5,8,11)]
    g={'p':r[1],'l':int(r[0]),'form':r[2],'en':r[3],'vi':r[4],'ex':ex}
    if r[1] in notes: g['nv'],g['ne']=notes[r[1]]
    else: print('no note:',r[1])
    by.setdefault(int(r[0]),[]).append(g)
for l,a in by.items():
    json.dump(a,open(os.path.join(here,'..','data','grammar',f'n{l}.json'),'w',encoding='utf8'),ensure_ascii=False)
    print('n%d'%l,len(a))
