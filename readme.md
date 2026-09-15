Concurrent Order & Inventory Reservation Service

## TODO
- [x] fayl struktura va kerakli fayllarni yaratib olish.
- [x] app bootstrap qilish, error handlinglarni chiqish
- [x] dockerizing. 
- [x] DB schemalarni app bootstrap bo'lganda initialize qilish. 
- [x] user registration.
- [x] user login.
- [x] Auth implementation.
- [x] Product creation.
- [ ] order creation. work in progress


## Decisions
- Jadvallar hozircha 3ta bo'ldi, users jadvalini jwt li authorization talab qilingani uchun qo'shdim. userlardan hozircha username va passwordan boshqa inputlarni kutish ortiqcha deb bildim.

- Jadvallarda id uchun uuid ishlatildi. "Because you know why. Who uses int as id nowadays?" UUIDni ishlatganimning sababi birinchidan uniquelik haqida bosh qotirmayman, ikkinchidan har bitta table uchun alohida alohida sequence ochib yurishdan ham qutilaman.

- orders jadvalida created_by column bilan bir userning orderi boshqa user orderlari orasida chiqib qolishi oldini oldim.

- orderga taskda aytilganidek bir necha xil item biriktirsa bo'ladi, orderga biriktirilgan itemlarning quantitysini o'zgartirib bo'lmaydi ya'ni biriktirilgan itemni 1ta item deb olib ketayapman va o'sha biriktirilgan itemni stock quantitysidan -1 qilayapman. 

- idempotency-keyni client generate qilib backendga beradi. idempotency-keyni saqlab qo'yaman keyingi safar yana o'sha key bilan urinish qilib ko'rsa men idempotency key bilan orderlar orasidan idem_key ga teng bo'lgan orderni qidirib ko'raman agar shunday order topilsa va hech narsa qilmasdan shunchaki success responce qaytaraman. Agar unday keyli order topilmasa demak birinchi marta so'rov yuborganday tizim order yaratadi tanlangan product stock_quantitydan - qiladi.

- client generate qilgan idempotency-keyni uuid bo'lishligi majburiy.

-
