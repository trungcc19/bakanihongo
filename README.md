# 日本語 N5→N3 (web app, không cần build)

Site tĩnh thuần HTML/CSS/JS. Dữ liệu nằm trong `data/` dạng JSON, app tự đọc `data/manifest.json`, nên thêm dữ liệu không cần sửa code.

## Chạy thử trên máy
`python3 -m http.server 8000` trong thư mục này, rồi mở http://localhost:8000 (không mở trực tiếp file index.html vì trình duyệt chặn fetch JSON).

## Deploy (chọn 1)
- **Netlify**: vào app.netlify.com/drop, kéo thả cả thư mục.
- **Cloudflare Pages / Vercel**: tạo project, chọn thư mục này, không cần build command, output là thư mục gốc.
- **GitHub Pages**: đẩy lên repo, Settings → Pages → branch main, thư mục root.

Trên iPhone: mở link bằng Safari → Chia sẻ → Thêm vào Màn hình chính. Service worker sẽ lưu cache để học offline (cần HTTPS, các host trên đều có).

## Cấu trúc dữ liệu
- `data/vocab/nX.json`, `data/kanji/nX.json`: `{j, r, en, vi, l}` (chữ, cách đọc, nghĩa Anh, nghĩa Việt, cấp 5/4/3)
- `data/grammar/nX.json`: `{p, l, en, vi, j, xe, xv}` (mẫu câu, cấp, giải thích Anh/Việt, câu ví dụ, dịch Anh/Việt)
- `data/reading/nX.json`: `{l, ti, j, en, vi, q:{en, vi, o:[...], a}}`. Furigana viết dạng `私[わたし]`.
- Nét chữ Kanji/Kana trong tab Viết được tải từ KanjiVG (CDN jsDelivr) và cache lại, nên mọi chữ có trong KanjiVG đều luyện viết được mà không cần thêm dữ liệu.

## Thêm hàng nghìn từ
1. Soạn file TSV (xuất từ Google Sheets) có dòng tiêu đề `j r en vi l`.
2. `node tools/import.mjs vocab words.tsv` (gộp vào file theo cấp, trùng thì cập nhật, tự cập nhật manifest).
3. Làm tương tự cho `kanji` và `grammar`.

Nguồn dữ liệu mở thường dùng (hãy kiểm tra giấy phép trước khi dùng): danh sách từ JLPT của Jonathan Waller (tanos.co.uk), JMdict và KANJIDIC2 (EDRDG), câu ví dụ Tatoeba, nét chữ KanjiVG. Các nguồn này không có cột tiếng Việt, cần dịch thêm.

## Lưu ý
Tiến độ học lưu trong localStorage của trình duyệt trên từng thiết bị.

## Tính năng mới (v3)
- **Lịch ôn (SRS):** mỗi thẻ có ngày ôn kế tiếp (10 phút → 1 → 3 → 7 → 16 → 35 ngày). Trang chủ hiện số thẻ cần ôn và thẻ mới hôm nay. Số thẻ mới mỗi ngày chỉnh trong ⚙️ Cài đặt.
- **Bài (Lesson):** trong ⚙️ Cài đặt, dán các từ của bài đang học kèm số bài để gắn nhãn hàng loạt; từ không có trong dữ liệu sẽ được liệt kê. Trên thẻ học cũng có ô chọn bài cho từng thẻ. Khi có nhãn, hàng nút "Bài" xuất hiện để lọc thẻ, kiểm tra và ngữ pháp. Khi nhập bằng TSV, thêm cột `lesson`.
- **Chia động từ:** Kiểm tra → Chia động từ (ます / て / ない / た), tự nhận nhóm 1, 2, 3 và hiện bảng chia sau mỗi câu.
- **Giao diện tablet:** tự rộng ra trên màn hình từ 720px. Bút S Pen dùng được trong tab Viết.

## Đồng bộ iPhone ↔ Galaxy Tab (Supabase, miễn phí)
1. Tạo project tại supabase.com, vào SQL Editor và chạy:
```sql
create table progress(id text primary key, data jsonb not null, updated_at timestamptz default now());
alter table progress enable row level security;
create policy "anon all" on progress for all to anon using (true) with check (true);
```
2. Vào Project Settings → API, lấy **Project URL** và **anon / publishable key**.
3. Trên thiết bị thứ nhất: ⚙️ Cài đặt → Đồng bộ → mở "Máy thứ nhất" → dán URL và key → bấm "Kết nối và đồng bộ". Mã đồng bộ được tạo tự động nếu để trống.
4. Trên thiết bị thứ hai: không cần nhập gì. Trên máy thứ nhất bấm 📲 **Kết nối máy khác**, rồi dùng camera của máy thứ hai quét mã QR (hoặc gửi link cho chính mình và mở trên máy thứ hai). Tiến độ của hai máy được gộp theo thời gian của từng thẻ, nên học ở cả hai máy không bị mất.
5. App tự đồng bộ khi mở, vài giây sau khi học, khi chuyển sang app khác hoặc tắt màn hình, và khi có mạng lại.

Lưu ý bảo mật: URL, key và mã chỉ lưu trong trình duyệt của bạn, không nằm trong mã nguồn site. Mã đồng bộ đóng vai trò mật khẩu, nên đừng chia sẻ. Đây là cách đơn giản cho một người dùng, không phải hệ thống tài khoản.

## Cài như app trên Galaxy Tab / Android
Mở link bằng Chrome → menu ⋮ → "Cài đặt ứng dụng" (Install app). Để nghe tiếng Nhật, cài giọng Nhật trong Cài đặt → Quản lý chung → Chuyển văn bản thành giọng nói.

## Tính năng v4
- **Từ đã quên (🧠):** từ bạn bấm "Chưa nhớ" sau khi đã học, và từ trả lời sai trong kiểm tra hoặc chính tả nghe, được gom vào danh sách riêng (Thẻ học → Đã quên). Một từ rời khỏi danh sách sau 2 lần liên tiếp bấm "Đã nhớ" hoặc "Dễ". Danh sách cũng được đồng bộ giữa các thiết bị.
- **Đọc:** furigana có 3 chế độ (bật, tự động ẩn với từ bạn đã thuộc, tắt), nghe từng câu hoặc cả đoạn, bản dịch Anh/Việt, danh sách từ có trong bài (chạm để xem nghĩa và nghe).
- **Nghe:** gõ lại từ (hiragana), gõ lại câu, hoặc nghe cả đoạn rồi trả lời câu hỏi. Nút 🐢 phát chậm.

## Tính năng v5: câu ví dụ gắn với từ vựng
- Dữ liệu câu ví dụ: `data/sentence/nX.json` với `{l, j (có furigana dạng 私[わたし]), en, vi}`. Thêm bằng `node tools/import.mjs sentence file.tsv` (cột `l j en vi`).
- App tự dò từ vựng có trong mỗi câu, nên không cần gắn thẻ thủ công. Mặt sau thẻ từ vựng hiện tối đa 2 câu ví dụ chứa từ đó.
- **Đọc → 💬 Câu:** duyệt câu ví dụ (10 câu mỗi trang), furigana 3 chế độ, nghe từng câu, bản dịch Anh/Việt, chạm vào từ để xem nghĩa.
- **Kiểm tra → Điền từ:** chọn từ vựng điền vào chỗ trống trong câu (có gợi ý nghĩa của câu).
- **Nghe → Câu / Hiểu câu:** gõ lại câu nghe được, hoặc nghe câu rồi chọn nghĩa đúng.

## N5 hoàn chỉnh (v6)
- N5 hiện có 697 từ vựng, 102 Kanji, 53 mẫu ngữ pháp, 449 câu ví dụ và 19 đoạn đọc. Gần như mọi từ N5 đều có ít nhất 1 câu ví dụ (hiện trên mặt sau thẻ, trong Đọc → Câu, Điền từ và Nghe).
- Ba mục đếm 〜人, 〜本, 〜時間 dùng chung câu ví dụ với 人, 本, 時間.
- File nguồn của từng đợt nằm trong `src/` (định dạng TSV, nhập lại được bằng `tools/import.mjs`).

## v7: chủ đề, sửa lỗi kiểm tra nghe, luyện viết mới
- **Chủ đề (thay cho ô "Bài" vô dụng trên thẻ):** từ vựng và Kanji được tự phân loại thành 20 chủ đề (chào hỏi, gia đình, số đếm, thời gian, động từ, tính từ, ăn uống, địa điểm, giao thông…). Chọn chủ đề ở Thẻ học, Kiểm tra (từ vựng, điền từ) và Nghe (từ). Mỗi thẻ hiện chủ đề của nó. Quy tắc phân loại nằm trong `js/themes.js`.
- **Bài (giáo trình):** hàng nút "Bài" chỉ hiện khi bạn đã gắn nhãn bài trong ⚙️ Cài đặt, kèm số từ của mỗi bài.
- **Kiểm tra → nút 🎧:** bật/tắt chế độ nghe không còn nhảy sang câu khác.
- **Luyện viết:** 3 chế độ.
  - Xem nét: chữ vẽ từng nét, có số.
  - Có hướng dẫn: nét xám, số và chấm ở điểm bắt đầu mỗi nét.
  - Không hướng dẫn: không có nét mẫu. Viết sai nét, sai chiều hoặc sai thứ tự thì nét nháy đỏ, bị xóa và app báo lý do (ví dụ "Sai thứ tự: đây là nét 2, cần viết nét 1 trước").
- Khung viết tự co theo chiều cao màn hình để thấy cả thông báo lẫn khung viết trên iPhone nhỏ.

## v8
- **Chọn chủ đề**: nút thả xuống dạng lưới 2 cột (3 cột trên tablet), không còn cuộn ngang; chip bài học tự xuống dòng.
- **Nút 🔊**: chỉ phát âm, không đổi chữ/câu hỏi; thẻ học có nút 🔊 riêng, chạm vào thẻ vẫn lật.
- **Luyện viết**: dữ liệu nét chữ nằm sẵn trong `data/strokes.json` (578 ký tự, tải 1 lần, được service worker cache → dùng offline). Không còn tải từ CDN; nếu lỗi sẽ có nút "Thử lại".
- **Ngữ pháp**: thẻ gập/mở, ô "Cấu trúc", mỗi mẫu có ≥3 ví dụ, phần ngữ pháp được tô màu/gạch chân bằng cú pháp `{…}`. Nguồn: `src/grammar-v2.txt` → `python3 tools/build_grammar.py`.
- Dữ liệu nét chữ: KanjiVG © Ulrich Apel, giấy phép CC BY-SA 3.0 (https://kanjivg.tagaini.net). Phần dữ liệu `data/strokes.json` giữ nguyên giấy phép này.

## v9: thẻ ngẫu nhiên, luyện viết theo romaji, lưu dữ liệu bền hơn, N4/N3 đầy đủ hơn
- **Thẻ học ngẫu nhiên:** thẻ cần ôn và thẻ mới được lấy ngẫu nhiên, không theo thứ tự cố định. Nút **🔀 Ngẫu nhiên** để luyện tự do: xáo thẻ từ bộ lọc hiện tại (cấp, chủ đề), không giới hạn thẻ mới. Trong chế độ này, "Chưa nhớ" đưa thẻ về lịch ôn sớm, còn "Đã nhớ" không làm lùi lịch ôn. Khi ôn xong trong ngày cũng có nút để luyện tiếp.
- **Luyện viết theo romaji:** đề bài hiện phiên âm romaji (Kanji: âm On IN HOA, âm Kun chữ thường) kèm nghĩa Việt/Anh. Không còn bảng chọn chữ. Chữ được bốc ngẫu nhiên theo cấp N5/N4/N3, ưu tiên chữ chưa viết. Có nút ← Trước, 🔀 Chữ khác và 👁 Xem đáp án. Chế độ "Không hướng dẫn" là mặc định và được ghi nhớ. Kanji phải xem đáp án hoặc sai từ 3 nét trở lên sẽ được đưa vào danh sách 🧠 Đã quên.
- **Lưu dữ liệu:**
  - Lưu 2 bản: localStorage và IndexedDB. Nếu một bản bị xóa, app tự khôi phục từ bản kia.
  - Tự lưu ngay khi đóng hoặc chuyển app.
  - Xin quyền bộ nhớ bền vững (persistent storage) để trình duyệt không tự xóa dữ liệu.
  - Lịch sử học theo ngày (số lượt trả lời, số câu đúng, XP), có biểu đồ 14 ngày ở Trang chủ. Lịch sử này cũng được đồng bộ.
  - File sao lưu có ngày trong tên. Khôi phục sẽ **gộp** vào tiến độ hiện tại, không ghi đè.
  - Nhắc sao lưu nếu chưa bật đồng bộ và đã quá 7 ngày chưa sao lưu.
  - ⚙️ Cài đặt có mục 💽 hiển thị trạng thái lưu trữ.
- **Dữ liệu N4/N3:**
  - Kanji: đủ danh sách N4 (178 chữ) và N3 (342 chữ), có âm Hán Việt. Có thêm 飲, 買, 魚 cho N5.
  - Từ vựng: N4 265 từ, N3 210 từ, mỗi từ có câu ví dụ riêng.
  - Ngữ pháp: N4 42 mẫu, N3 36 mẫu, mỗi mẫu 3 ví dụ.
  - Bài đọc: thêm 5 bài cho mỗi cấp.
  - Nét chữ của toàn bộ 625 Kanji đã có trong `data/strokes.json` nên luyện viết được khi offline.
- Nguồn dữ liệu: `src/kanji-n4.tsv`, `src/kanji-n3.tsv`, `src/vocab-n4.txt`, `src/vocab-n3.txt` (dạng `từ|đọc|en|vi|câu|câu en|câu vi`, tách thành `src/vocab-nX.tsv` và `src/sent-nX.tsv` để nhập bằng `tools/import.mjs`), `src/grammar-v2.txt`, `src/reading-n4n3.json`.

## v10: chấm nét chặt hơn, đáp án viết tay, ngữ pháp chi tiết, thêm dữ liệu
- **Chấm nét mới:** mỗi nét được so về vị trí trung bình, điểm đầu, điểm cuối, độ dài và hướng đi (chia nét thành 8 đoạn). Nét nguệch ngoạc hoặc chồng vào giữa không còn được chấp nhận. Có 3 mức chấm 🎯 Dễ / Chuẩn / Khó (mặc định Chuẩn). Khi sai, app báo lý do: sai vị trí đầu/cuối, quá dài/ngắn, cong sai chỗ, sai chiều, sai thứ tự.
- **Đáp án dạng viết tay:** viết xong, app hiện chữ chuẩn theo nét KanjiVG (đúng kiểu chữ dùng để chấm, không phải font máy), vẽ lại theo thứ tự nét, chạm để xem lại. Chữ chuẩn hiện mờ màu xanh dưới nét bạn viết để so sánh. Có điểm **độ chính xác %** cho mỗi chữ, được lưu và đồng bộ. Kanji dưới 60% sẽ vào danh sách 🧠 Đã quên.
- **Ngữ pháp:**
  - Mỗi mẫu có thêm mục **💡 Cách dùng**: hoàn cảnh dùng, mức lịch sự, lỗi hay gặp, phân biệt với mẫu giống nó. Nguồn: `src/grammar-notes.txt` (dạng `mẫu|tiếng Việt (các ý cách nhau bằng " • ")|English`).
  - Có ô tìm kiếm mẫu ngữ pháp.
  - **Kiểm tra → Ngữ pháp:** chọn phần ngữ pháp điền vào chỗ trống trong câu ví dụ. App ghi lại kết quả từng mẫu (✓đúng/tổng) và cho ra mẫu hay sai nhiều hơn. Nút "Luyện mẫu này" trong từng mẫu.
- **Thẻ Kanji:** mặt sau liệt kê tối đa 6 từ vựng có chữ đó (ưu tiên cùng cấp).
- **Dữ liệu thêm:**
  - Từ vựng: N4 thêm 143 từ (tổng 408), N3 thêm 208 từ (tổng 418), mỗi từ có câu ví dụ.
  - Ngữ pháp: N4 thêm 15 mẫu (tổng 57), N3 thêm 18 mẫu (tổng 54).
  - Nguồn: `src/vocab-n4-b2.txt`, `src/vocab-n3-b2.txt`, `src/grammar-v2.txt`.

## v11: viết cả từ, ẩn nghĩa khi làm bài, Kana đầy đủ
- **Kiểm tra → Điền từ / Ngữ pháp:** nghĩa của câu chỉ hiện sau khi đã chọn đáp án.
- **Viết → Từ:** viết cả từ vựng có Kanji (ví dụ 学校, 食べ物), lần lượt từng chữ. App hiện cách đọc romaji và nghĩa của từ. N5 có 540 từ, N4 381 từ, N3 382 từ. Viết xong, app hiện cả từ dạng viết tay và độ chính xác chung. Ở chế độ Xem nét, chạm vào ô chữ để xem nét của chữ đó. N5 chỉ có khoảng 100 Kanji theo chuẩn JLPT (app có 105), nên chế độ này giúp có nhiều bài viết hơn.
- **Nét chữ:** `data/strokes.json` có thêm 337 chữ (Kanji trong từ vựng, kana đục, kana nhỏ, ー), tổng 1155 chữ, dùng được khi offline.
- **Kana:** bảng chữ có thêm âm đục (が, ぱ…) và âm ghép (きゃ…). Phần viết Hiragana/Katakana có thêm âm đục.
- **Kiểm tra → Từ vựng:** đáp án nhiễu được lấy ở cấp gần với từ đang hỏi, cùng loại (động từ/không phải động từ) và không trùng nghĩa.
- **Phím tắt khi Kiểm tra trên máy tính:** 1–4 để chọn đáp án, Enter để sang câu tiếp.
- **Kanji N4:** thêm 立, 言, 公, là các chữ có trong danh sách N4 chuẩn nhưng trước đây bị thiếu.

## v12: lộ trình học, thêm câu cho Điền từ và Ngữ pháp, đồng bộ dễ hơn
- **🎯 Lộ trình học** (Trang chủ → Chi tiết):
  - Chọn cấp đang học (N5/N4/N3) và tốc độ: Nhẹ / Vừa / Nhanh. N5 mất 4/3/2 tháng, N4 6/4/3 tháng, N3 9/6/4 tháng.
  - App tính số từ mới và Kanji mới mỗi ngày từ phần còn lại và số ngày còn lại, rồi tự đặt số thẻ mới mỗi ngày theo đó. Nếu bị chậm, số này tự tăng (tối đa 40).
  - Trang chủ có danh sách **Hôm nay**: Kana (chỉ ở N5, khi chưa viết hết), ôn thẻ đến hạn, thẻ mới, viết, ngữ pháp, điền từ, đọc/nghe. Mỗi mục bấm vào là đến đúng phần cần học.
  - Trang Lộ trình có tiến độ của từ vựng, Kanji và ngữ pháp, cho biết bạn đang đúng hay chậm tiến độ, ngày dự kiến xong, thứ tự một buổi học, và những gì nên tập trung ở từng cấp.
- **Kiểm tra → Điền từ:**
  - Thêm 1124 câu ví dụ mới (`src/sx-n*-*.txt`, dạng `từ|câu|en|vi`). Gần như mọi từ có từ 2 câu trở lên.
  - Các câu ví dụ ngữ pháp cũng được dùng làm câu điền từ.
  - Động từ và tính từ đã chia cũng được hỏi (ví dụ 食べました → chọn 食べる).
  - Mỗi từ lần lượt dùng hết các câu của nó rồi mới lặp lại; từ vừa hỏi không bị hỏi lại ngay.
- **Ngữ pháp:** mỗi mẫu có thêm 3 câu, tổng 6 câu (`src/grammar-ex2-n*.txt`). Phần Kiểm tra dùng hết các câu của một mẫu rồi mới lặp lại.
- **Kiểm tra dữ liệu:**
  - `node tools/check_sx.mjs src/sx-*.txt` kiểm tra furigana, câu có chứa từ, và cách đọc có khớp với dữ liệu không.
  - `node tools/check_gex.mjs src/grammar-ex2-n*.txt` kiểm tra câu ngữ pháp.
  - Build: `node tools/build_sx.mjs` và `python tools/build_grammar.py`.
- **Nhận diện từ trong câu:** phân biệt được 外す với 外, 渡す với 渡る, 足す với 足… dựa vào đuôi chia phía sau.
- **Đồng bộ:**
  - Máy thứ hai chỉ cần quét mã QR hoặc mở link từ máy thứ nhất.
  - Tự đồng bộ khi mở app, khi rời app và khi có mạng lại.
  - Lộ trình, việc đã làm hôm nay và số thẻ mới đã học hôm nay cũng được đồng bộ.
