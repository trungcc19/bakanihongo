# Dùng: python3 tools/build_grammar.py   (đọc src/grammar-v2.txt, ghi data/grammar/nX.json)
# Mỗi dòng: l|p|form|en|vi|j1|en1|vi1|j2|en2|vi2|j3|en3|vi3 ; phần ngữ pháp trong câu đánh dấu {…}, furigana dạng 私[わたし]
import json,os
by={}
for line in open(os.path.join(os.path.dirname(__file__),'..','src','grammar-v2.txt'),encoding='utf8'):
    if not line.strip(): continue
    r=line.rstrip('\n').split('|')
    assert len(r)==14,(len(r),line[:40])
    ex=[{'j':r[i],'en':r[i+1],'vi':r[i+2]} for i in (5,8,11)]
    by.setdefault(int(r[0]),[]).append({'p':r[1],'l':int(r[0]),'form':r[2],'en':r[3],'vi':r[4],'ex':ex})
for l,a in by.items():
    json.dump(a,open(os.path.join(os.path.dirname(__file__),'..','data','grammar',f'n{l}.json'),'w',encoding='utf8'),ensure_ascii=False)
    print('n%d'%l,len(a))
