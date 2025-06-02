/**
 * Plugin for text and bitmapText translate in Phaser.
 * Version: 0.0.10
 * Author: Qugurun
 * License: MIT
 */

import "phaser";

export default class TranslatePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);

        const plugin = this;

        this._translation = {};
        this.config = []
        this._current = null;

        // https://docs.phaser.io/phaser/concepts/gameobjects/text
        const prototypeText = Phaser.GameObjects.GameObjectFactory.prototype.text;
        Phaser.GameObjects.GameObjectFactory.prototype.text = function (x, y, text, style) {
            const object = prototypeText.call(this, x, y, text, style);
            _patchTranslatableTextObject.call(this, object, text);
            return object;
        }

        // https://docs.phaser.io/phaser/concepts/gameobjects/bitmap-text
        const prototypeBitmapText = Phaser.GameObjects.GameObjectFactory.prototype.bitmapText;
        Phaser.GameObjects.GameObjectFactory.prototype.bitmapText = function (x, y, font, text, size, align) {
            const object = prototypeBitmapText.call(this, x, y, font, text, size, align);
            _patchTranslatableTextObject.call(this, object, text);
            return object;
        }

        function _patchTranslatableTextObject(object, text) {
            if (!this.scene._textObjects) {
                this.scene._textObjects = [];
            }
            this.scene._textObjects.push(object);
            let _text = "";

            if (Array.isArray(text)) {
                for (const item of text) {
                    _text += "\n" + item;
                }
            } else {
                _text = text;
            }

            object.translate = {
                text: _text,
                fontSize: object.style ? object.style.fontSize : (object.fontSize || undefined),
                isFitWidth: false,
                fitWidthValue: 0,
            }

            object.setFitWidth = function (value) {
                if (typeof value == "number") {
                    this.translate.isFitWidth = true;
                    this.translate.fitWidthValue = value;
                    if (this.setFontSize && this.translate.fontSize) {
                        this.setFontSize(this.translate.fontSize);
                    }
                    let letterSpacing = 0;
                    if (typeof this.letterSpacing === 'number') {
                        letterSpacing = this.letterSpacing;
                    } else if (typeof this._letterSpacing === 'number') {
                        letterSpacing = this._letterSpacing;
                    }
                    let textLength = (this.text && this.text.length) ? this.text.length : 0;
                    let totalWidth = this.width;
                    if (textLength > 1 && letterSpacing) {
                        totalWidth += (textLength - 1) * letterSpacing;
                    }
                    if (totalWidth > value && this.setFontSize && this.translate.fontSize) {
                        const currentSize = parseInt(this.translate.fontSize);
                        const newSize = (currentSize * value) / totalWidth;
                        this.setFontSize(newSize);
                    }
                }
                return this;
            }

            object.setTextKey = function (value) {
                if (typeof value == "number") value = value.toString();

                let _text = "";
                if (Array.isArray(value)) {
                    for (const item of value) {
                        _text += "\n" + item;
                    }
                } else {
                    _text = value;
                }
                this.translate.text = _text;
                if (this.setText) {
                    this.setText(plugin.getTranslate(_text));
                }
                if (this.translate.isFitWidth) {
                    this.setFitWidth(this.translate.fitWidthValue);
                }
            }
            object.setTextKey(text);
        }
    }

    init(params) {
        this.dir = params.dir;
    }

    getTranslate(key) {
        if (typeof key == "number") key = value.toString();

        let result = key;

        const inputString = key;
        const regex = /\{[^{}]+\}/g;
        const matches = inputString.match(regex);

        if (matches) {
            matches.forEach(match => {
                const matchedKey = match
                if (match in this._translation) {
                    const replacement = this._translation[match];
                    result = result.replace(match, replacement);
                }
            });
        }

        return result;
    }

    _setTextKey() {
        this.game.scene.scenes.forEach(function (sceneObject) {
            if (sceneObject._textObjects) {
                for (const textObject of sceneObject._textObjects) {
                    textObject.setTextKey(textObject.translate.text);
                }
            }
        });
    }

    getLanguage() {
        return this._current;
    }

    setLanguage(value) {
        this._current = value;

        let scene = this.game.scene.scenes[0];
        scene.load.setPath(this.dir);
        if (scene.cache.json.get(value) == undefined) {
            scene.load.json(value, `${value}.json`);
            scene.load.on('complete', () => {
                this._translation = scene.cache.json.get(value);
                this._setTextKey();
            }, scene);
            scene.load.start()
        } else {
            this._translation = scene.cache.json.get(value);
            this._setTextKey();
        }
    }
}
