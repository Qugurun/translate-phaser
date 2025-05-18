[![Page Views Count](https://badges.toozhao.com/badges/01JVJ9DZTC41VE8M88F7J1M5CA/green.svg)](https://badges.toozhao.com/stats/01JVJ9DZTC41VE8M88F7J1M5CA "Get your own page views count badge on badges.toozhao.com")
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Qugurun/translate-phaser/blob/main/README.md)
[![ru](https://img.shields.io/badge/lang-ru-green.svg)](https://github.com/Qugurun/translate-phaser/blob/main/README.ru.md)

# **Translate Phaser Plugin**

**TranslatePlugin** is a plugin for **Phaser 3 and 4** that simplifies localization of text (`Text` and `BitmapText`) in your game. It supports dynamic language switching and automatic text updates.

**Installation:**

```bash
npm install translate-phaser
```

---
### **Plugin Integration**

Add the plugin to your game configuration (`GameConfig`):

```javascript
import TranslatePlugin from "translate-phaser";

const config = {
    // ... other Phaser settings
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

- In the `dir` parameter, specify the path to the folder with translation files.
### **Preparing Translations**

Create JSON files for each language in the `assets/locale/` folder:

**`en.json`** (English):

```json
{
    "{hello}": "Hello, world!",
    "{menu.start}": "Start Game",
    "{menu.settings}": "Settings"
}
```

**`ru.json`** (Russian):

```json
{
    "{hello}": "Привет, мир!",
    "{menu.start}": "Начать игру",
    "{menu.settings}": "Настройки"
}
```

You can generate translation files from a `*.csv` file by running `cvs2json.js`. Copy the `cvs2json.js` file into your project and edit it to specify the path to the folder with the `*.csv` file and where the resulting `*.json` files will be saved.

Run the script:

```bash
node cvs2json.js
```

- For convenience, add a command to the `scripts` section of your `package.json` to generate translation files.
  
```
"scripts": {
    "translate": "node cvs2json.js"
}
```

The CSV file should look like this: The name of the first column must be `key`, the names of the other columns are language identifiers and will be used as the resulting translation file names.

|key|ru|en|
|---|---|---|
|{settings}|Настройки|Settings|
|{game}|Игра|Game|
|{exit}|Выход|Exit|
|Example CSV file:|||

[Example table](https://docs.google.com/spreadsheets/d/11lQEBhEIqXbmaXeNp7G18mlrq2J0pNZCpmwcyrIc_wk/edit?usp=sharing "https://docs.google.com/spreadsheets/d/11lQEBhEIqXbmaXeNp7G18mlrq2J0pNZCpmwcyrIc_wk/edit?usp=sharing")

You can try to get an automatic translation via Google Sheets by entering the formula:

![google_table.gif](https://github.com/Qugurun/translate-phaser/blob/main/google_table.gif)

To control the case of words:

Capitalize the first letter of each word.  
`=PROPER(GOOGLETRANSLATE(A1;"en";"ru"))`

Convert all characters in the string to lowercase.  
`=LOWER(GOOGLETRANSLATE(A1;"en";"ru"))`

Convert all characters in the string to uppercase.  
`=UPPER(GOOGLETRANSLATE(A1;"en";"ru"))`
### **Getting Started**

In the `preload` method, load the initial language:

```javascript
preload() {
    this.load.json("en", "assets/locale/en.json");
}
```

In the `create` method, set the language and create text with a key:

```javascript
create() {
    this.translate.setLanguage("en");
    const myText = this.add.text(x, y, "{hello}", { fontSize: "32px" });
    const myBitmapText = this.add.bitmapText(x, y, "myFont", "{key}", 32);
}
```

## **Documentation**

To change the language, use:

```javascript
this.translate.setLanguage("ru");
```

- If the translation file was not loaded previously, it will be loaded automatically and all text objects will be updated.

Get the translation for a key: 
- The text will be returned in the currently set language

```javascript
console.log(this.translate.getTranslate("{myKey}"));
```

Get the currently set language:

```javascript
console.log(this.translate.getLanguage());
```

Use multiple keys and combine them with regular text:

```js
const myText = this.add.text(x, y, "{key1} Hello {key2}", {fontSize: "50px"});
const myBitmapText = this.add.bitmapText(x, y, "myFont", "{key1} Hello {key2}", 32);
```

Set a new key:

```javascript
myText.setTextKey("{newKey}");
myBitmapText.setTextKey("{newKey}");
```

Set the maximum width of the text block in px.

```javascript
myText.setFitWidth(200);
myBitmapText.setFitWidth(200);
```

- The text object will automatically adjust the text size to fit the specified width, taking into account the spacing between characters.

---

MIT © [Qugurun](https://github.com/Qugurun) 
