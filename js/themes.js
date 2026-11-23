/* Automatic topic classification of vocab / kanji (rules over the English gloss + word form) */
const TH=[["greet","👋","Chào hỏi","Greetings"],["people","👪","Người & gia đình","People & family"],["num","🔢","Số & đơn vị","Numbers & units"],["time","📅","Thời gian & ngày tháng","Time & dates"],["verb","🏃","Động từ","Verbs"],["adj","✨","Tính từ","Adjectives"],["food","🍚","Ăn uống","Food & drink"],["cloth","👕","Quần áo","Clothes"],["place","🏙️","Địa điểm & nhà cửa","Places & home"],["nature","🌤️","Thiên nhiên & động vật","Nature & animals"],["body","🩺","Cơ thể & sức khỏe","Body & health"],["move","🚆","Giao thông","Transport"],["study","🏫","Học tập & công việc","Study & work"],["shop","🛒","Mua sắm & tiền","Shopping & money"],["things","🎒","Đồ vật & giải trí","Things & hobbies"],["dir","🧭","Vị trí & phương hướng","Position & direction"],["wh","❓","Từ hỏi & chỉ thị","Questions & demonstratives"],["adv","🔗","Trạng từ & liên từ","Adverbs & connectors"],["life","🧺","Sinh hoạt hằng ngày","Daily life"],["other","📦","Khác","Other"]];
const THN=Object.fromEntries(TH.map(a=>[a[0],a]));
const NAADJ=new Set(["静か","賑やか","元気","有名","便利","きれい","上手","下手","嫌い","簡単","暇","色々","大好き","大嫌い","真っ直ぐ","大変","不便","立派","丈夫","大切","大丈夫","同じ","好き","特別","親切"]);
const _tc={};
function themeOf(x){return _tc[x.id]||(_tc[x.id]=themeCalc(x))}
function themeCalc(x){const e=x.en.toLowerCase(),j=x.j,k=x.id[0]=="k";
if(/^(hello|good (morning|evening|night)|goodbye|thank|i am sorry|excuse me|please|you are welcome|welcome|nice to meet|best regards|how are you|have a good day|\(said|i am (home|leaving)|yes$|no$)/.test(e))return"greet";
if(/^to /.test(e))return/[うくぐすつぬぶむる]$/.test(j)?"verb":"adj";
if(!k&&(NAADJ.has(j)||(/い$/.test(j)&&j!="お手洗い")))return"adj";
if(/^(very|a little|a lot|together|all$|all the time|already|not yet|again|slowly|immediately|probably|more$|really|truth|but$|and then|after that|so, |well then|later|before, ahead|early, quickly|around \(time\)|about|always|sometimes|often|not at all|not very|a moment|most, number one|next$|other$|oneself|this kind|that kind|much more|a moment)/.test(e))return"adv";
if(/(today|tomorrow|yesterday|week|month|year|morning|evening|night|noon|daytime|a\.m\.|p\.m\.|weekend|birthday|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|^may$|june|july|august|september|october|november|december|\bdays?\b|\d+(st|nd|rd|th)|spring|summer|autumn|winter|o'clock|minutes|hours|^now$|every|holiday|tonight)/.test(e))return"time";
if(/^(what|who|where|when|why|how|which|this|that|here|there|over there|those)/.test(e))return"wh";
if(/^(one|two|three|four|five|six|seven|eight|nine|ten|zero|twenty|thirty|hundred|thousand|\d|half|number|gram|meter|kilo|yen)|counter|number ~/.test(e))return"num";
if(/(father|mother|brother|sister|family|parents|siblings|grandfather|grandmother|child|\bboy\b|\bgirl\b|^man\b|^woman|^person|student|teacher|doctor|friend|foreigner|adult|clerk|pupil|everyone|^i, me|^i \(|^you|^he,|^she,|^we, us)/.test(e))return"people";
if(/(^hand$|^eye$|mouth|^ear$|^nose$|tooth|^face$|^hair$|^head$|foot, leg|leg, foot|^body$|stomach|fever|common cold|illness|medicine|hospital)/.test(e))return"body";
if(k&&e=="water")return"nature";
if(k&&/^(see|go|come|eat|meet|write|read|talk|hear|go out|enter|rest|listen|say|buy|sell|walk|run|stand|sit|make|study|life, birth)/.test(e))return e.startsWith("study")||e.startsWith("life")?"study":"verb";
if(k&&/^(big|small|long|new|old|many|few|cheap|tall|white|red|blue|black|high|low|early|late|good|bad|strong|weak|far|near)/.test(e))return"adj";
if(/(rice|meal|breakfast|lunch|dinner|bread|\begg|meat|\bfish\b|vegetable|fruit|\btea\b|coffee|milk|sugar|salt|beer|alcohol|juice|soup|salad|curry|ramen|cake|apple|banana|pork|beef|chicken|food|drink|spoon|fork|knife|chopsticks|bowl|plate|cooking|boxed lunch|cafeteria|restaurant|\bcup\b|\bglass\b|^water$|^eat)/.test(e))return"food";
if(/(clothes|\bhat\b|socks|shoes|skirt|shirt|trousers|sweater|coat|necktie|button|glasses|handkerchief)/.test(e))return"cloth";
if(/(train|subway|\bbus\b|taxi|\bcar\b|automobile|bicycle|airplane|airport|station|vehicle|ticket|road|way$|elevator)/.test(e))return"move";
if(/(school|classroom|\bclass\b|lesson|study|homework|dictionary|notebook|pencil|\bpen\b|ballpoint|paper|\bbook|magazine|newspaper|composition|report|question|problem|exam|practice|kanji|language|english|\bword|page|library|university|work, job|job|part-time|sentence|character, letter|writing)/.test(e))return"study";
if(/(money|price|buy|sell|supermarket|department store|greengrocer|shop|present|gift|wallet|stamp|mail|envelope|shopping)/.test(e))return"shop";
if(/(bank|post office|\bpark\b|cinema|hotel|company|town|village|country|china|korea|america|japan|^world|^place$|^area|vicinity|police box|swimming pool|house|home|\broom\b|kitchen|entrance|exit|garden|toilet|restroom|\bbath|shower|apartment|stairs|building)/.test(e))return"place";
if(/(\bsun\b|moon|star|sky|rain|snow|\bwind\b|cloud|sunny|river|\bsea\b|mountain|tree|flower|grass|forest|pond|stone|insect|bird|animal|\bdog\b|\bcat\b|\bcow\b|fire|earth, soil|weather)/.test(e))return"nature";
if(/(desk|chair|\bbed\b|table|door|window|television|radio|camera|clock|watch|\bbag\b|umbrella|electricity|light|phone|photograph|picture|painting|air conditioner|heater|stove|map|mailbox|piano|guitar|cigarette|music|song|movie|sound|soap|sports|tennis|skiing|party|bookshelf)/.test(e))return"things";
if(/(\bleft\b|\bright\b|east|west|south|north|above|below|under|behind|front|inside|outside|next to|beside|between|\bside\b|^up|^down|straight|opposite|near|far)/.test(e))return"dir";
if(/(green|^talk|walk|cleaning|laundry|marriage|letter|name|color|colour|brown|floor|times$|thing$|matter|object|time$)/.test(e))return"life";
return"other"}
const thLabel=x=>{const a=THN[themeOf(x)];return a[1]+" "+(S.lang=="vi"?a[2]:a[3])};
