[![Page Views Count](https://badges.toozhao.com/badges/01JVJ9DZTC41VE8M88F7J1M5CA/green.svg)](https://badges.toozhao.com/stats/01JVJ9DZTC41VE8M88F7J1M5CA "Get your own page views count badge on badges.toozhao.com")
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Qugurun/translate-phaser/blob/main/README.md)
[![ru](https://img.shields.io/badge/lang-ru-green.svg)](https://github.com/Qugurun/translate-phaser/blob/main/README.ru.md)

[![https://t.me/phaser_community](https://img.shields.io/badge/Phaser-Community_RU-blue?logo=telegram&logoColor=ffffff)](https://t.me/phaser_community "@phaser_community")

# **Translate Phaser Plugin**

**TranslatePlugin** — это плагин для **Phaser 3 и 4**, который упрощает локализацию текста (`Text` и `BitmapText`) в вашей игре. Поддерживает динамическое переключение языков и автоматическое обновление текста.

**Установка:**

```bash
npm install translate-phaser
```

---
### **Подключение плагина**

Добавьте плагин в конфигурацию вашей игры (`GameConfig`):

```javascript
import TranslatePlugin from "translate-phaser";

const config = {
    // ... другие настройки Phaser
    plugins: {
        global: [
            {
                key: "TranslatePlugin",
                plugin: TranslatePlugin,
                start: true,
                mapping: "translate",
                data: {
                    dir: "assets/locale",
                }
            }
        ]
    }
};
```

- В параметре `dir` укажите путь до папки с файлами перевода.
### **Подготовка переводов**

Создайте JSON-файлы для каждого языка в папке `assets/locale/`:

**`en.json`** (английский):

```json
{
    "{hello}": "Hello, world!",
    "{menu.start}": "Start Game",
    "{menu.settings}": "Settings"
}
```

**`ru.json`** (русский):

```json
{
    "{hello}": "Привет, мир!",
    "{menu.start}": "Начать игру",
    "{menu.settings}": "Настройки"
}
```

Файлы перевода можно получить из `*.csv` файла, для этого запустите `csv2json.js`. Скопируйте файл `csv2json.js` в свой проект, отредактируйте, указав путь до папки с файлом `*.csv` и куда будут сохраняться файлы `*.json`.

Запустите скрипт:

```bash
node csv2json.js
```

- для удобства работы добавьте в ваш `package.json` в секцию `scripts` команду для формирования файлов перевода.
  
```
"scripts": {
    "translate": "node csv2json.js"
}
```

CSV файл имеет вид: Название первого столбца важно чтобы был именно `key`, названия остальных столбцов являются идентификаторами языка и итоговыми именами для файлов перевода.

|key|ru|en|
|---|---|---|
|{settings}|Настройки|Settings|
|{game}|Игра|Game|
|{exit}|Выход|Exit|

Пример файла CSV:

[Пример таблицы](https://docs.google.com/spreadsheets/d/11lQEBhEIqXbmaXeNp7G18mlrq2J0pNZCpmwcyrIc_wk/edit?usp=sharing "https://docs.google.com/spreadsheets/d/11lQEBhEIqXbmaXeNp7G18mlrq2J0pNZCpmwcyrIc_wk/edit?usp=sharing")

Вы можете попытаться получить автоматический перевод через гугл таблицы, введя формулу:

![google_table.gif](https://github.com/Qugurun/translate-phaser/blob/main/google_table.gif)

Чтобы слова "не гуляли регистром".

Преобразует первые буквы всех слов в заглавные.  
`=PROPER(GOOGLETRANSLATE(A1;"en";"ru"))`

Преобразует символы заданной строки в нижний регистр.  
`=LOWER(GOOGLETRANSLATE(A1;"en";"ru"))`

Преобразует символы заданной строки в верхний регистр.  
`=UPPER(GOOGLETRANSLATE(A1;"en";"ru"))`
### **Начало работы**

В методе `preload` загрузите стартовый язык:

```javascript
preload() {
    this.load.json("en", "assets/locale/en.json");
}
```

 В методе `create` установите язык и создайте текст с ключом:

```javascript
create() {
    this.translate.setLanguage("en");
    const myText = this.add.text(x, y, "{hello}", { fontSize: "32px" });
    const myBitmapText = this.add.bitmapText(x, y, "myFont", "{key}", 32);
}
```

## **Документация**

Для смены языка используйте:

```javascript
this.translate.setLanguage("ru");
```

- Если файл перевода не был загружен ранее, он загрузится автоматически, и все текстовые объекты обновятся.

Получить перевод ключа: 
- Текст вернётся на текущем установленном языке

```javascript
console.log(this.translate.getTranslate("{myKey}"));
```

Узнать текущий установленный язык:

```javascript
console.log(this.translate.getLanguage());
```

Используйте несколько ключей и комбинируйте их с обычным текстом:

```js
const myText = this.add.text(x, y, "{key1} Привет {key2}", {fontSize: "50px"});
const myBitmapText = this.add.bitmapText(x, y, "myFont", "{key1} Привет {key2}", 32);
```

Установка нового ключа:

```javascript
myText.setTextKey("{newKey}");
myBitmapText.setTextKey("{newKey}");
```

Установка максимальной ширины текстового блока в px.

```javascript
myText.setFitWidth(200);
myBitmapText.setFitWidth(200);
```

- Текстовый объект автоматически подберёт размер текста чтобы максимально вписаться в указанный размеры по ширине с учётом расстояния между символами.

---

MIT © [Qugurun](https://github.com/Qugurun) 
