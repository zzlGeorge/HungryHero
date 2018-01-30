/**
 * 主菜单场景
 * */
var MenuScene = cc.Scene.extend({
    _hero: null,
    _playBtn: null,
    _aboutBtn: null,

    ctor: function () {
        this._super();
        var layer = new cc.Layer();
        this.addChild(layer);

        //欢迎背景
        var winSize = cc.director.getWinSize();
        var bgWelcome = new cc.Sprite(res.bgWelcome_jpg);
        bgWelcome.x = winSize.width / 2;
        bgWelcome.y = winSize.height / 2;
        layer.addChild(bgWelcome);

        //标题
        var title = new cc.Sprite("#welcome_title.png");
        title.x = 800;
        title.y = 555;
        layer.addChild(title);

        //超人
        this._hero = new cc.Sprite("#welcome_hero.png");
        this._hero.x = -this._hero.width / 2;
        this._hero.y = 400;
        layer.addChild(this._hero);

        //超人飞入菜单效果
        var move = cc.moveTo(2, cc.p(this._hero.width / 2 + 100, this._hero.y)).easing(cc.easeOut(2));
        this._hero.runAction(move);

        //按钮
        this._playBtn = new cc.MenuItemImage("#welcome_playButton.png", "#welcome_playButton.png", this._play);
        this._playBtn.x = 700;
        this._playBtn.y = 350;
        this._aboutBtn = new cc.MenuItemImage("#welcome_aboutButton.png", "#welcome_aboutButton.png", this._about, this);
        this._aboutBtn.x = 500;
        this._aboutBtn.y = 250;

        //声音按钮
        var soundButton = new SoundButton();
        soundButton.x = 45;
        soundButton.y = winSize.height - 45;
        var menu = new cc.Menu(this._playBtn, this._aboutBtn, soundButton);  //默认都居中叠在一起
        layer.addChild(menu);
        menu.x = menu.y = 0;    //如果不设置menu位置，则自动屏幕居中。

        Sound.playMenuBgMusic();//播放背景音乐
        this.scheduleUpdate();

        return true;
    },

    _play: function () {
        Sound.playCoffee();
        cc.director.runScene(new GameScene());
    },

    _about: function () {
        Sound.playMushroom();
        cc.director.runScene(new AboutScene());
    },

    update: function (dt) {//实现上下波动效果
        var currentDate = new Date();
        this._hero.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 25;
        this._playBtn.y = 350 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
        this._aboutBtn.y = 250 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
    }
});

