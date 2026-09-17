Concurrent Order & Inventory Reservation Service

[dbdiagram.io dagi jadvallar arxitekturasi](https://dbdiagram.io/d/Concurrent-Order-and-Inventory-Reservation-Service-6aab97d3af7c3b0bd101b34c)

## TODO
- [x] fayl struktura va kerakli fayllarni yaratib olish.
- [x] app bootstrap qilish, error handlinglarni chiqish.
- [x] dockerizing. 
- [x] DB schemalarni app bootstrap bo'lganda initialize qilish. 
- [x] user registration.
- [x] user login.
- [x] Auth implementation.
- [x] Product creation.
- [x] order creation. work in progress
- [x] order createion qilishni idempotent qilish. 
- [x] get /orders/:id endpoint implementation.
- [x] orderni cancel qilish.
- [x] pendingdan confirmedga o'tgazadigan purchase endpoint qilish.
- [x] 15 minutda status o'zgarmaganlarini pendingga qaytarib qo'yish.
- [x] product creationga concurrent correctnes qo'shish.
- [x] redis caching qo'shish.



## Decisions
- Jadvallar hozircha 3ta bo'ldi, users jadvalini jwt li authorization talab qilingani uchun qo'shdim. userlardan hozircha username va passwordan boshqa inputlarni kutish ortiqcha deb bildim.

- Jadvallarda id uchun uuid ishlatildi. "Because you know why. Who uses int as id nowadays?" UUIDni ishlatganimning sababi birinchidan uniquelik haqida bosh qotirmayman, ikkinchidan har bitta table uchun alohida alohida sequence ochib yurishdan ham qutilaman.

- orders jadvalida created_by column bilan bir userning orderi boshqa user orderlari orasida chiqib qolishi oldini oldim.

- orderga taskda aytilganidek bir necha xil item biriktirsa bo'ladi, orderga biriktirilgan itemlarning quantitysini o'zgartirib bo'lmaydi ya'ni biriktirilgan itemni 1ta item deb olib ketayapman va o'sha biriktirilgan itemni stock quantitysidan -1 qilayapman. 

- idempotency-keyni client generate qilib backendga beradi. idempotency-keyni saqlab qo'yaman keyingi safar yana o'sha key bilan urinish qilib ko'rsa men idempotency key bilan orderlar orasidan idem_key ga teng bo'lgan orderni qidirib ko'raman agar shunday order topilsa va hech narsa qilmasdan shunchaki success responce qaytaraman. Agar unday keyli order topilmasa demak birinchi marta so'rov yuborganday tizim order yaratadi tanlangan product stock_quantitydan - qiladi.

- client generate qilgan idempotency-keyni uuid bo'lishligi majburiy.

- orderni faqat create qilgan odam cancel qila oladigan qilinishi kerak. Buning uchun order created_by degan columndan foydalanaman.

- product create qilishdagi concurrent correctnes logicasini dbga tashlab qo'yildi. Men har bita requstning payloadini heapda ushlab turish ideasi keldi lekin uni qilishga 3 kunni ichida ulgurmadim.

- hamma productlarni qaytaradigan endpointimni cache-aside strategiyasini ishlatgan holatda caching qilish. Get qilishda birinchi redisdan so'rab ko'raman agar yo'q bo'lsa dbdan olib redisga yozib keyin responce qilib berib yuboraman. Yangi product yaratilganda eski cacheni o'chirib yuboraman.

## All routes
users ga tegishli endpointlardan tashqari barcha endpointlar Bearer token so'raydi.

users
- post /api/v1/users/register -> yangi user qo'shish username va password majburiy
- post /api/v1/users/login -> register qilingan userni auth qilish uchun token 50minutda expire bo'ladi.

products
- post /api/v1/products/ -> product qo'shish uchun endpoint, name price va stock_quantity majbury.
- get /api/v1/products/ -> hamma productlar listini chiqarib olinadi. Order create qilishda shu yerdan product id olinadi.

orders
- post /api/v1/orders -> yangi order yaratish uchun kerak bo'ladi. products degan keyda array qabul qiladi.
- post /api/v1/orders/:id/confirm -> orderlarni confirm qilish uchun endpoint. Orderni yaratgan user confirm qila oladi.
- post /api/v1/orders/:id/cancel -> orderlarni cancel qilish uchun endpoint. Orderni yaratgan user cancel qila oladi.
- get /api/v1/orders -> userga tegishli hamma orderlarni olib kelish uchun endpoint
- get /api/v1/orders/:id -> order statusini qaytaradigan endpoint
