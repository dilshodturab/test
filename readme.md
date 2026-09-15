Concurrent Order & Inventory Reservation Service

## TODO
- [x] fayl struktura va kerakli fayllarni yaratib olish.
- [x] app bootstrap qilish, error handlinglarni chiqish
- [x] dockerizing. 
- [x] DB schemalarni app bootstrap bo'lganda initialize qilish. 
- [ ] Auth implementation.
- [ ] 

## Decisions
- Appdan kutilgan narsalar ya'ni asosiy taskning ustida ishlash uchun avval qilinishi kerak bo'lgan narsalarni birinchi qilib oldim. Shu qatorda kerakli fayllarni yaratib oldim ichiga hech narsa yozmasam ham. Sabab endi bundan buyog'iga faqat kod yozish bilan shug'ullanaman. 
- Dockerize qilib oldim sabab men ishimni tugatdim deganimdan keyin yana boshqa ish qilmayman, men yozgan ko'dim localda va dockerda ham ishlashini realvaqtda ko'rib turaman, hamma logicani qilib bo'lganimdan keyin dockerga o'tgazganimda kutilmagan xatolik chiqish extimolini kamaytirdim.
- Jadvallar hozircha 3ta bo'ldi, users jadvalini jwt li authorization talab qilingani uchun qo'shdim. userlardan hozircha username va passwordan boshqa inputlarni kutish ortiqcha deb bildim.
- Jadvallarda id uchun uuid ishlatildi. "Because you know why. Who uses int as id nowadays?" ok jokes aside: UUIDni ishlatganimning sababi birinchidan uniquelik haqida bosh qotirmayman, ikkinchidan har bitta table uchun alohida alohida sequence ochib yurishdan ham qutilaman.
- orders jadvalida created_by column bilan bir userning orderi boshqa user orderlari orasida chiqib qolishi oldini oldim.
- orderga taskda aytilganidek bir necha xil item biriktirsa bo'ladi, lekin itemlarning quantitysini o'zgartirib bo'lmaydi ya'ni biriktirilgan itemni 1ta item deb olib ketayapman va o'sha biriktirilgan itemni stock quantitysidan -1 qilayapman. Agar itemlarni orderga biriktirishda quantitysi ham adjust qilish imkoniyati bo'lsin deyilganda orderga biriktirilgan itemni va uning quantitysini ham kiritadigan qilib qo'yar edim.
-
