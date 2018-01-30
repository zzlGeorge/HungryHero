/**
 * 游戏主场景
 * */

var GameScene = cc.Scene.extend({

    _ui: null,
    _background: null,

    ctor: function () {
        this._super();

        var layer = new cc.Layer();
        this.addChild(layer);

        //背景
        this._background = new GameBackground();
        layer.addChild(this._background);

        //游戏数据状态ui
        this._ui = new GameSceneUI();
        layer.addChild(this._ui);
        this._ui.update();


        this.init();
    },

    init: function () {

    }
});