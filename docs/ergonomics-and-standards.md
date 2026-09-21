# Нормативи та ергономіка встановлення раковини і змішувача

> Дослідницький звіт Phase 1 проєкту SanMeyster. Джерело сирих нотаток:
> [`research/norms-ergonomics-raw.md`](../research/norms-ergonomics-raw.md),
> [`research/basins-raw.md`](../research/basins-raw.md),
> [`research/faucets-raw.md`](../research/faucets-raw.md).
>
> Дата дослідження: 2026-09-21. Жодне значення в цьому документі не вигадане:
> кожен рядок має джерело, дату перевірки та явно позначений тип (`mandatory`,
> `recommended`, `ergonomic`, `manufacturer`, `heuristic`). Де достовірного
> джерела не знайдено — це прямо зафіксовано в розділі «Відсутні дані», а не
> замовчано і не заповнено вигаданим числом.

## 1. Методологія та обмеження

- Пріоритет джерел: (1) державні нормативи України (ДБН, ДСТУ) →
  (2) офіційні стандарти EN/ISO/DIN → (3) офіційна документація виробників →
  (4) технічні креслення → (5) професійні ергономічні дослідження (NKBA) →
  (6) авторитетні галузеві джерела.
- Нормативи різних юрисдикцій **не змішуються** — кожен рядок таблиці
  прив'язаний до конкретної юрисдикції (UA / DE / professional / manufacturer).
  Немає єдиної "правильної" відстані — є значення для конкретної норми.
- Первинний текст ДБН В.2.5-64:2012 та ДБН В.2.2-40:2018 (зі Зміною №3) був
  завантажений і прочитаний повністю (PDF → текст), а не взятий з уривків
  пошукової видачі.
- Стандарти EN 14688, EN 200, EN 817, EN 274 та DIN 18040-2 **платні** —
  первинний текст недоступний публічно. Там, де знайдено лише область
  застосування (scope) без числових значень, це прямо зазначено. Значення
  DIN 18040-2 у цьому документі взяті з вторинних німецьких професійних
  джерел (не з першоджерела) — позначені відповідно.
- Стандарт ISO для геометрії встановлення раковини/змішувача **не існує** —
  це підтверджена відсутність, а не недослідженість.
- Дані виробників (Geberit, Villeroy & Boch, GROHE, hansgrohe) зібрані з
  офіційних сайтів там, де це було технічно можливо; частина офіційних
  джерел (`pro.villeroy-boch.com`, `grohe.com` для автоматизованих запитів)
  повертала HTTP 403 — у таких випадках використані незалежно підтверджені
  (≥2 джерела) роздрібні публікації тих самих виробничих характеристик,
  з позначкою рівня довіри.

## 2. Легенда

| Тип (`type`) | Значення |
|---|---|
| `mandatory` | Обов'язкова нормативна вимога (державний норматив або стандарт, що на нього посилається закон) |
| `recommended` | Рекомендація стандарту/професійного органу, не обов'язкова |
| `ergonomic` | Ергономічна рекомендація щодо зручності використання |
| `manufacturer` | Рекомендація конкретного виробника |
| `heuristic` | Практика галузі без формального стандарту — явно позначена, не видається за норматив |

| Юрисдикція | Значення |
|---|---|
| `UA` | Україна — ДБН, ДСТУ |
| `DE` | Німеччина — DIN 18040-2 (через вторинні джерела) |
| `EU` | Загальноєвропейські EN-стандарти |
| `ISO` | Міжнародні ISO-стандарти |
| `professional` | Професійні рекомендації (NKBA та інші), не державний норматив |
| `manufacturer` | Рекомендація виробника сантехніки |

## 3. UA — ДБН (найповніше покриття, пріоритетна юрисдикція)

Джерела: ДБН В.2.5-64:2012 «Внутрішній водопровід та каналізація» (Таблиця 24,
розділи 26.2–26.3.1); ДБН В.2.2-40:2018 «Інклюзивність будівель і споруд»
зі Зміною №3 (чинна з 01.05.2025), пп. 6.4.6, 11.6.3, 11.6а, 11.20, 11.25,
11.28, 11.29.

| Parameter | Value | Unit | Type | Jurisdiction | Source | Section | URL |
|---|---:|---|---|---|---|---|---|
| Висота встановлення раковини (верх борту), стандартна | 800 | mm | mandatory | UA | ДБН В.2.5-64:2012 | Табл. 24, ч. II, 26.3.1 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Висота встановлення раковини — школи/дитячі медзаклади | 700 | mm | mandatory | UA | ДБН В.2.5-64:2012 | Табл. 24, ч. II, 26.3.1 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Висота встановлення раковини — дошкільні заклади/приміщення для інвалідів (об'єднана колонка) | 500 | mm | mandatory | UA | ДБН В.2.5-64:2012 | Табл. 24, ч. II, 26.3.1 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Висота раковини при спільному змішувачі з ванною | 850 | mm | mandatory | UA | ДБН В.2.5-64:2012 | ч. II, 26.3.1 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Допуск висоти — окремо встановлений прилад | ±20 | mm | mandatory | UA | ДБН В.2.5-64:2012 | Примітка до Табл. 24 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Допуск висоти — група однотипних приладів | ±5 | mm | mandatory | UA | ДБН В.2.5-64:2012 | Примітка до Табл. 24 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Мін. відстань між осями раковин у ряду | 650 | mm | mandatory | UA | ДБН В.2.5-64:2012 | ч. II, 26.3.1 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Бокова відстань до стіни (приміщення для інвалідів) | ≥200 | mm | mandatory | UA | ДБН В.2.5-64:2012 | ч. II, 26.3.1 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Висота встановлення туалетного крана/змішувача над бортом раковини | 200 | mm | mandatory | UA | ДБН В.2.5-64:2012 | ч. II, 26.2 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Висота встановлення крана/змішувача над бортом мийки ("раковина" у промисловому сенсі) | 250 | mm | mandatory | UA | ДБН В.2.5-64:2012 | ч. II, 26.2 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Для змішувачів з отвором у чаші висота визначається конструкцією виробу, а не нормою | — | — | mandatory (уточнення) | UA | ДБН В.2.5-64:2012 | Примітка до ч. II, 26.2 | [PDF](https://dreamdim.ua/wp-content/uploads/2019/10/DBN-V.2.5-64-2012-Vnutrishniy-vodoprovid-ta-kanali.pdf) |
| Висота доступного умивальника (без опори/тумби знизу) | 750–850 | mm | mandatory | UA | ДБН В.2.2-40:2018 (Зміна №3) | п. 11.6.3 | [PDF](https://mindev.gov.ua/storage/app/sites/1/uploaded-files/1-zmina-no-3-dbn-40-do-nakazu-ostannia.pdf) |
| Макс. відстань від переднього краю умивальника до регулятора змішувача | ≤300 | mm | mandatory | UA | ДБН В.2.2-40:2018 (Зміна №3) | п. 11.6.3 | [PDF](https://mindev.gov.ua/storage/app/sites/1/uploaded-files/1-zmina-no-3-dbn-40-do-nakazu-ostannia.pdf) |
| Тип змішувача для доступного умивальника | важільний або сенсорний | — | mandatory | UA | ДБН В.2.2-40:2018 (Зміна №3) | п. 11.6.3 | [PDF](https://mindev.gov.ua/storage/app/sites/1/uploaded-files/1-zmina-no-3-dbn-40-do-nakazu-ostannia.pdf) |
| Дзеркало (доступність): нижній край, не вище | ≤900 | mm | mandatory | UA | ДБН В.2.2-40:2018 (Зміна №3) | п. 11.6.3 | [PDF](https://mindev.gov.ua/storage/app/sites/1/uploaded-files/1-zmina-no-3-dbn-40-do-nakazu-ostannia.pdf) |
| Дзеркало (доступність): верхній край, не нижче | ≥1900 | mm | mandatory | UA | ДБН В.2.2-40:2018 (Зміна №3) | п. 11.6.3 | [PDF](https://mindev.gov.ua/storage/app/sites/1/uploaded-files/1-zmina-no-3-dbn-40-do-nakazu-ostannia.pdf) |
| Висота дитячого умивальника | 400–500 | mm | mandatory | UA | ДБН В.2.2-40:2018 (Зміна №3) | п. 11.6а | [PDF](https://mindev.gov.ua/storage/app/sites/1/uploaded-files/1-zmina-no-3-dbn-40-do-nakazu-ostannia.pdf) |
| Висота органів керування (включно з кранами) для МГН | 850–1100 | mm | mandatory | UA | ДБН В.2.2-40:2018 | п. 6.4.6 | [PDF](https://uu.edu.ua/upload/Inclusiya/Bezbaryernist/1832_DBN-v-2-2-40.pdf) |
| Мін. відстань органів керування від бокової стіни | ≥400 | mm | mandatory | UA | ДБН В.2.2-40:2018 | п. 6.4.6 | [PDF](https://uu.edu.ua/upload/Inclusiya/Bezbaryernist/1832_DBN-v-2-2-40.pdf) |
| Мін. розміри вбиральні з умивальником (індивід., житло) | 1.6 × 2.2 | m | mandatory | UA | ДБН В.2.2-40:2018 | п. 11.25 | [PDF](https://uu.edu.ua/upload/Inclusiya/Bezbaryernist/1832_DBN-v-2-2-40.pdf) |
| Мін. ширина проходу між рядами групових умивальників | ≥1.8 | m | mandatory | UA | ДБН В.2.2-40:2018 | п. 11.28 | [PDF](https://uu.edu.ua/upload/Inclusiya/Bezbaryernist/1832_DBN-v-2-2-40.pdf) |
| Тип змішувача, доступний санвузол | важільний/кнопковий або електронний | — | mandatory | UA | ДБН В.2.2-40:2018 | п. 11.29 | [PDF](https://uu.edu.ua/upload/Inclusiya/Bezbaryernist/1832_DBN-v-2-2-40.pdf) |

**Конфлікт у джерелах UA** (детально в розділі 8): ДБН В.2.5-64 дає 500 мм
для об'єднаної колонки "дошкільні заклади + приміщення для інвалідів", тоді
як ДБН В.2.2-40 (новіша, спеціалізована норма доступності) дає 750–850 мм
для доступного умивальника. Застосунок використовує 750–850 мм як значення
для профілю доступності, а 500 мм трактує окремо як застарілу/дитячу
величину.

## 4. EU / EN — виявлено, але без публічних числових значень

| Standard | Scope | Type | Jurisdiction | Status | URL |
|---|---|---|---|---|---|
| EN 14688:2015+A1:2018 (в Україні — ДСТУ EN 14688:2019, IDT) | Функціональні вимоги та методи випробувань умивальників | mandatory (за посиланням) | EU | Платний, публічних числових значень не знайдено | [iteh.ai](https://standards.iheh.ai/catalog/standards/cen/c086d3de-2e00-44bf-b1b5-4f8a7161e7eb/en-14688-2015) |
| EN 200 | Технічні вимоги до кранів/змішувачів (тип 1 і 2) | mandatory (за посиланням) | EU | Платний | [en-standard.eu](https://www.en-standard.eu) |
| EN 817 | Механічні змішувальні клапани — технічні вимоги | mandatory (за посиланням) | EU | Платний | [en-standard.eu](https://www.en-standard.eu/din-en-817-sanitary-tapware-mechanical-mixing-valves-pn-10-general-technical-specifications/) |
| EN 274 | Вимоги до зливної арматури сантехприладів | mandatory (за посиланням) | EU | Платний | — |

Жоден з цих стандартів не дав публічного числового значення, застосовного
до геометрії/сумісності раковини та змішувача. У застосунку вони відсутні
в таблиці правил — тільки згадуються як існуючі, але недоступні.

## 5. ISO — підтверджена відсутність стандарту

Пошук не виявив жодного ISO-стандарту, що регулює геометрію встановлення
умивальника чи змішувача. У Європі цю область покриває EN (EN 14688 для
умивальників, EN 200/817 для арматури), а не ISO. Це підтверджена
відсутність, а не пропуск дослідження.

## 6. DE — DIN 18040-2 (через вторинні джерела, первинний текст платний)

Первинний текст DIN 18040-2 недоступний публічно (din.de/beuth.de). Значення
нижче взяті з незалежних німецьких професійних джерел, що цитують стандарт;
там, де джерела розходяться — обидва варіанти наведено, конфлікт описано
окремо.

| Parameter | Value | Unit | Type | Jurisdiction | Source | URL |
|---|---:|---|---|---|---|---|
| Доступний умивальник: макс. висота переднього краю | ≤80 | cm | mandatory | DE | DIN 18040-2 (вторинне джерело) | [din18040.de](https://din18040.de/waschplatz-waschbecken.htm) |
| Доступний умивальник: альтернативний діапазон висоти | 80–85 | cm | mandatory | DE | DIN 18040-2 (Aktion Barrierefreies Bad) | [PDF](https://www.aktion-barrierefreies-bad.de/wp-content/uploads/Checkliste_Barrierefreie_B%C3%A4der_DIN-18040-2_26_03_2018.pdf) |
| Простір під умивальником, мін. глибина (вимога "R" — інвалідний візок) | ≥55 | cm | mandatory | DE | DIN 18040-2 (вторинне джерело) | [din18040.de](https://din18040.de/waschplatz-waschbecken.htm) |
| Простір під умивальником, мін. ширина (вимога "R") | ≥90 | cm | mandatory | DE | DIN 18040-2 (вторинне джерело) | [bau-szene.de](https://bau-szene.de/waschplatz-nach-norm/) |
| Висота простору під умивальником (на 30 см від переднього краю) | 67 | cm | mandatory | DE | DIN 18040-2 (Aktion Barrierefreies Bad) | [PDF](https://www.aktion-barrierefreies-bad.de/wp-content/uploads/Checkliste_Barrierefreie_B%C3%A4der_DIN-18040-2_26_03_2018.pdf) |
| Макс. відстань змішувача від переднього краю | ≤40 | cm | mandatory | DE | DIN 18040-2 (вторинне джерело) | [din18040.de](https://din18040.de/waschplatz-waschbecken.htm) |
| Альтернативне значення відстані змішувача (конфлікт) | ≥20 | cm | mandatory | DE | DIN 18040-2 (Aktion Barrierefreies Bad) | [PDF](https://www.aktion-barrierefreies-bad.de/wp-content/uploads/Checkliste_Barrierefreie_B%C3%A4der_DIN-18040-2_26_03_2018.pdf) |
| Вільний простір перед умивальником, стандарт | 120 × 120 | cm | mandatory | DE | DIN 18040-2 (вторинне джерело) | [baunetzwissen.de](https://www.baunetzwissen.de/bad-und-sanitaer/fachwissen/barrierefreiheit/barrierefreie-sanitaerraeume-nach-din-18040-2-172838) |
| Вільний простір перед умивальником, вимога "R" | 150 × 150 | cm | mandatory | DE | DIN 18040-2 (Aktion Barrierefreies Bad) | [PDF](https://www.aktion-barrierefreies-bad.de/wp-content/uploads/Checkliste_Barrierefreie_B%C3%A4der_DIN-18040-2_26_03_2018.pdf) |
| Дзеркало: нижній край не вище | ≤100 | cm | mandatory | DE | DIN 18040-2 (вторинне джерело) | [din18040.de](https://din18040.de/waschplatz-waschbecken.htm) |

## 7. Professional — NKBA Bath Planning Guidelines (первинний текст, США)

Джерело: NKBA (National Kitchen & Bath Association) Bath Planning Guidelines,
офіційний PDF. Це професійна рекомендація, **не державний норматив** —
одиниці виміру збережено оригінальними (дюйми), з приблизним перерахунком
у мм для довідки.

| Parameter | Value | Unit | Type | Jurisdiction | Source | Section |
|---|---:|---|---|---|---|---|
| Вільний простір перед умивальником, рекомендовано | ≥30 (≈762) | in (mm) | recommended | professional | NKBA Bath Planning Guidelines | Guideline 4 |
| Вільний простір перед умивальником, мін. за US IRC | ≥21 (≈533) | in (mm) | mandatory (US model code) | professional/US | NKBA, citing IRC P 2705.1.5 | Guideline 4 |
| Простір для маневрування візком перед умивальником | 30 × 48 (≈762×1219) | in (mm) | recommended (accessibility) | professional | NKBA, citing ICC A117.1 | Guideline 4 |
| Відстань від осі умивальника до бокової стіни, рекомендовано | ≥20 (≈508) | in (mm) | recommended | professional | NKBA Bath Planning Guidelines | Guideline 5 |
| Мін. відстань від стіни до краю умивальника | 4 (≈102) | in (mm) | recommended | professional | NKBA Bath Planning Guidelines | Guideline 5 |
| Мін. відстань від осі умивальника до стіни (US IRC мінімум) | ≥15 (≈381) | in (mm) | mandatory (US model code) | professional/US | NKBA, citing IRC P 2705.1.5 | Guideline 5 |
| Відстань від осі умивальника до стіни, доступність | ≥24 (≈610) | in (mm) | recommended (accessibility) | professional | NKBA, citing ICC A117.1-2009 §1004.11.3 | Guideline 5 |
| Відстань між осями двох умивальників, рекомендовано | ≥36 (≈914) | in (mm) | recommended | professional | NKBA Bath Planning Guidelines | Guideline 6 |
| Відстань між осями двох умивальників, US IRC мінімум | ≥30 (≈762) | in (mm) | mandatory (US model code) | professional/US | NKBA, citing IRC P 2705.1.5 | Guideline 6 |
| Висота умивальника/тумби, рекомендований діапазон | 32–43 (≈813–1092) | in (mm) | recommended | professional | NKBA Bath Planning Guidelines | Guideline 7 |
| Висота переднього краю умивальника, доступність | ≤34 (≈864) | in (mm) | recommended (accessibility) | professional | NKBA, citing ICC A117.1-2009 §606.3 | Guideline 7 |
| Дзеркало над умивальником, нижній край, доступність | ≤40 (≈1016) | in (mm) | recommended (accessibility) | professional | NKBA, citing ICC A117.1-2009 §603.3 | Guideline 23 |
| Розетка GFCI, макс. відстань нижче борту умивальника | ≤12 (≈305) | in (mm) | mandatory (US model code) | professional/US | NKBA, citing IRC E 3901.6 | Guideline 24 |

## 8. Manufacturer — рекомендації виробників

| Parameter | Value | Unit | Type | Source | URL |
|---|---:|---|---|---|---|
| Висота встановлення умивальника, загальне правило | 85–90 | cm | manufacturer | Geberit — "The perfect installation height" | [geberit.co.uk](https://www.geberit.co.uk/bathroom-products/inspiration/tips-tricks/the-perfect-installation-height/) |
| Висота встановлення умивальника, таблиця стандартних висот | 85–95 | cm | manufacturer | Geberit — "The perfect installation height" | [geberit.co.uk](https://www.geberit.co.uk/bathroom-products/inspiration/tips-tricks/the-perfect-installation-height/) |
| ComfortZone — відстань виливу змішувача до умивальника, іменована/номерна величина в мм, прив'язана до конкретних пар моделей | 80–260 (типовий діапазон) | mm | manufacturer | hansgrohe ComfortZone | [hansgrohe.com](https://www.hansgrohe.com/bath/guide/technologies/comfortzone) |

ComfortZone hansgrohe — це методологічно найближчий реальний аналог того,
що обчислює SanMeyster: виробник публікує таблиці сумісності "ця модель
змішувача з ComfortZone N мм підходить до цих моделей умивальників", а не
загальну формулу. У Phase 2 ця ідея використана як натхнення для концепції
`target_zone`, але сама числова таблиця hansgrohe — це `manufacturer`-дані,
що не поширюються на інші бренди.

## 9. Heuristic / галузева практика (без формального стандарту)

Ці значення **не є нормативом** — жодного формального стандарту чи
державного документу з такими числами не знайдено в жодній дослідженій
юрисдикції. Джерела — комерційні гайди виробників сантехніки та профільних
постачальників. Позначені `heuristic`, у застосунку ніколи не подаються як
`mandatory` чи `recommended`.

| Parameter | Value | Unit | Type | Source | URL |
|---|---:|---|---|---|---|
| Глибина чаші, житлова практика | 5–8 (≈127–203) | in (mm) | heuristic | yidabath.com — Commercial Hand Wash Basin Spec Guide | [yidabath.com](https://www.yidabath.com/commercial-hand-wash-basin-specification-guide-contractors/) |
| Глибина чаші, готельна/офісна практика | 5.5–6 (≈140–152) | in (mm) | heuristic | yidabath.com | [yidabath.com](https://www.yidabath.com/commercial-hand-wash-basin-specification-guide-contractors/) |
| Мінімальна глибина чаші проти розбризкування (комерц. контекст) | ≥5 (≈127) | in (mm) | heuristic | yidabath.com | [yidabath.com](https://www.yidabath.com/commercial-hand-wash-basin-specification-guide-contractors/) |
| Виліт змішувача, маленька раковина | 4–8 (≈102–203) | in (mm) | heuristic | Kingston Brass — Faucet Spout Guide | [kingstonbrass.com](https://www.kingstonbrass.com/blogs/blog/what-should-know-about-faucet-spouts-before-purchasing) |
| Виліт змішувача, типова раковина/чаша | 5–7 (≈127–178) | in (mm) | heuristic | RBROHANT — Faucet Heights and Spout Ranges | [rbrohant.com](https://www.rbrohant.com/blogs/news/bathroom-faucet-heights-and-spout-ranges) |
| Точка падіння води — target zone у чаші | 1/3–1/2 углиб чаші, 127–254 мм від внутрішнього краю, ближче до зливу | mm | heuristic | Coohom — Wall Mixer Height vs Basin Height | [coohom.com](https://www.coohom.com/article/wall-mixer-height-vs-basin-height-complete-placement-comparison-guide) |
| Висота виливу над бортом, комфортний діапазон проти розбризкування | 100–200 (≈4–8) | mm (in) | heuristic | Architectural Bathroom Fixtures | [architecturalfaucets.com](https://architecturalfaucets.com/architectural-detailing-faucet-mounting-heights-and-ergonomic-considerations/) |
| Макс. вертикальний перепад вилив→чаша проти розбризкування | ≤250 (≤10) | mm (in) | heuristic | Architectural Bathroom Fixtures | [architecturalfaucets.com](https://architecturalfaucets.com/architectural-detailing-faucet-mounting-heights-and-ergonomic-considerations/) |

## 10. Конфлікти нормативів

### 10.1 UA: висота доступного умивальника (500 мм проти 750–850 мм)

ДБН В.2.5-64:2012 (Таблиця 24) дає **500 мм** для об'єднаної колонки
"дошкільні заклади і приміщення для інвалідів, які пересуваються за
допомогою різних пристроїв". ДБН В.2.2-40:2018 зі Зміною №3 (чинна з
01.05.2025), п. 11.6.3, дає **750–850 мм** для доступного умивальника без
опори знизу — і це значення узгоджується з потребою у просторі для колін
під чашею (потрібно ~700 мм вільної висоти під бортом, тобто борт не може
бути на висоті 500 мм). Ймовірно, 500 мм із старішої норми успадковано з
радянського SNiP 2.04.01-85 і стосується здебільшого дошкільної (дитячої)
половини об'єднаної колонки, а не дорослого користувача на візку — але
таблиця це не розділяє.

**Рішення для застосунку**: профіль доступності UA використовує
750–850 мм (ДБН В.2.2-40, новіша спеціалізована норма). Значення 500 мм
зберігається окремо як застаріле/дитяче, не приховується.

### 10.2 DE: DIN 18040-2 — висота умивальника та відстань змішувача

Незалежні вторинні джерела розходяться між собою: висота — ≤80 см проти
80–85 см; відстань змішувача від переднього краю — ≤40 см (максимум) проти
≥20 см (мінімум, інша логіка вимоги). Оскільки первинний текст стандарту
платний, конфлікт не вдалося остаточно вирішити звіркою з оригіналом.
Застосунок надає перевагу значенням, підтвердженим 2–3 незалежними
джерелами (≤80 см, ≤40 см, ≥55 см простір для колін) і позначає
DIN-похідні значення як "вторинне джерело, не звірено з першотекстом".

## 11. Відсутні дані (не вигадані, а прямо позначені як відсутні)

### UA
- Немає норми щодо горизонтальної відстані від виливу/аератора до заднього
  краю чаші для звичайного (не доступного) встановлення.
- Немає норми щодо "точки падіння води"/target zone в чаші.
- Немає норми щодо мінімальної глибини чаші.
- Бокова відстань 200 мм — тільки для приміщень для інвалідів, немає норми
  для звичайного житлового встановлення одиночної раковини.
- Повний текст ДСТУ EN 14688:2019 не знайдено (платний).
- Не підтверджено, чи ДБН В.2.2-9:2018 (громадські будівлі) містить власну
  окрему норму висоти умивальника — додатки з посиланнями не знайдено.

### EU / EN
- Жодного публічного числового значення з EN 14688/200/817/274 — усі платні.
- Немає єдиної загальноєвропейської норми доступності (DIN 18040 — лише
  німецька; інші країни ЄС мають власні норми, не досліджено — поза обсягом).

### ISO
- Підтверджена відсутність відповідного стандарту.

### DE
- Точні номери пунктів DIN 18040-2 для кожного значення не підтверджені
  (вторинні джерела не завжди цитують номер пункту).
- Немає значення для мінімальної глибини чаші чи точки падіння води — DIN
  18040-2 покриває доступність, а не гідравліку розбризкування.

### Professional / NKBA
- NKBA не покриває глибину чаші чи геометрію точки падіння — це джерело
  лише некодифікованого комерційного блогу.
- NKBA орієнтована на США (дюйми, IRC/ICC A117.1) — еквівалентний
  європейський професійний орган не досліджувався (поза обсягом).

### Каталог виробів (див. research/basins-raw.md, research/faucets-raw.md)
- Жодна з 21 дослідженої моделі раковин (Geberit, Villeroy & Boch) не дала
  підтвердженої відстані від отвору змішувача до заднього краю, координат
  зливу X/Y чи внутрішньої глибини чаші — ці дані існують лише в
  CAD/BIM-файлах за логіном виробника, недоступних у цьому дослідженні.
- Виліт (`spout_projection`) та висота виливу (`spout_height`) знайдені
  для 5 з 5 моделей hansgrohe (першоджерело, висока довіра) та лише
  частково для 5 моделей GROHE (grohe.com блокує автоматичні запити —
  дані з підтверджених роздрібних передруків, довіра середня/низька).
- Кут нахилу струменя, форма аератора (розсіювання) — не знайдено в жодній
  моделі жодного бренду.

## 12. Висновок для Phase 2 (інженерна модель)

1. **Немає єдиного "target zone" з нормативу** — концепція має будуватись
   на: (a) ДБН-обмеженнях, де вони є (висота крана над бортом: 200/250 мм;
   макс. 300 мм від переднього краю для доступного профілю); (b)
   `heuristic`-даних про точку падіння (1/3–1/2 углиб чаші, ближче до
   зливу) — явно позначених як евристика; (c) геометрії конкретної моделі
   раковини (ширина/глибина чаші) там, де вони відомі.
2. **Відстань отвору змішувача від заднього краю раковини** не нормована
   в жодній дослідженій юрисдикції для звичайного встановлення — модель
   сумісності мусить або опиратись на дані конкретного виробника
   (`faucetHolePosition` в каталозі, коли відомо), або позначати це поле
   `null` з попередженням про якість даних, а не вигадувати число.
3. **Дані каталогу переважно неповні на рівні координат** (drain X/Y,
   відстань отвору від краю) — інженерна модель (`geometry engine`) має
   коректно працювати і деградувати до консервативних обчислень (з
   позначкою "недостатньо даних"), коли ці поля `null`, а не падати чи
   підставляти вигадані числа.
4. Профілі нормативів (`UA`, `DE`, `professional`) реалізуються окремо —
   без змішування, з можливістю показати користувачу, який профіль
   застосовано і чому.
