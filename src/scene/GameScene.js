/**
 * 游戏主场景
 * */

var GameScene = cc.Scene.extend({

    _hero: null,
    _ui: null,
    _gameOverUI: null,
    _background: null,
    itemBatchLayer: null,

    _foodManager: null,
    _obstacleManager: null,

    _touchY: 0,

    ctor: function () {
        this._super();

        var layer = new cc.Layer();
        this.addChild(layer);

        //背景
        this._background = new GameBackground();
        layer.addChild(this._background);

        this._hero = new Hero();
        // layer.addChild(this._hero);
        this.addChild(this._hero);

        this.itemBatchLayer = new cc.SpriteBatchNode(res.texture_png);
        this.addChild(this.itemBatchLayer);

        //游戏数据状态ui
        this._ui = new GameSceneUI();
        this.addChild(this._ui);
        this._ui.update();

        if ("touches" in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: this._onTouchMoved.bind(this)
            }, this);
        else
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: this._onMouseMove.bind(this)
            }, this);
        cc.eventManager.addListener({event: cc.EventListener.KEYBOARD, onKeyReleased: this._back}, this);


        this._foodManager = new FoodManager(this);
        this._obstacleManager = new ObstacleManager(this);

        this.init();

        return true;
    },

    init: function () {
        Sound.stop();
        Sound.playGameBgMusic();

        var winSize = cc.director.getWinSize();
        Game.user.lives = GameConstants.HERO_LIVES;
        Game.user.score = Game.user.distance = 0;
        Game.gameState = GameConstants.GAME_STATE_IDLE;
        Game.user.heroSpeed = this._background.speed = 0;
        this._touchY = winSize.height / 2;

        this._hero.x = -winSize.width / 2;
        this._hero.y = winSize.height / 2;

        this._foodManager.init();
        this._obstacleManager.init();

        this.scheduleUpdate();
    },

    _onTouchMoved: function (touches, event) {
        if (Game.gameState !== GameConstants.GAME_STATE_OVER)
            this._touchY = touches[0].getLocation().y;
    },

    _onMouseMove: function (event) {
        if (Game.gameState !== GameConstants.GAME_STATE_OVER)
            this._touchY = event.getLocationY();
    },

    /**
     * hero被碰撞N次后，结束游戏；结束之前，先播放hero掉落的动画
     */
    endGame: function () {
        this.x = 0;
        this.y = 0;
        Game.gameState = GameConstants.GAME_STATE_OVER;
        GameEffect.stopCoffeeEffect(this);
        // this.stopWindEffect();
        // this.stopMushroomEffect();
    },

    _gameOver: function () {
        if (!this._gameOverUI) {
            this._gameOverUI = new GameOverUI(this);
            this.addChild(this._gameOverUI);
        }
        this._gameOverUI.setVisible(true);
        this._gameOverUI.init();
        Sound.playLose();
    },

    /**
     *
     * @param elapsed 秒
     */
    update: function (elapsed) {
        var winSize = cc.director.getWinSize();
        switch (Game.gameState) {
            case GameConstants.GAME_STATE_IDLE:
                // Take off.
                if (this._hero.x < winSize.width * 0.5 * 0.5) {
                    this._hero.x += ((winSize.width * 0.5 * 0.5 + 10) - this._hero.x) * 0.05;
                    this._hero.y -= (this._hero.y - this._touchY) * 0.1;

                    Game.user.heroSpeed += (GameConstants.HERO_MIN_SPEED - Game.user.heroSpeed) * 0.05;
                    this._background.speed = Game.user.heroSpeed * elapsed;
                }
                else {
                    Game.gameState = GameConstants.GAME_STATE_FLYING;
                    this._hero.state = GameConstants.HERO_STATE_FLYING;
                }
                HeroAnimation._handleHeroPose(this._hero, this._touchY);
                this._ui.update();
                break;

            case GameConstants.GAME_STATE_FLYING:
                // If drank coffee, fly faster for a while.
                if (Game.user.coffee > 0)
                    Game.user.heroSpeed += (GameConstants.HERO_MAX_SPEED - Game.user.heroSpeed) * 0.2;
                else
                    GameEffect.stopCoffeeEffect(this);

                // If not hit by obstacle, fly normally.
                if (Game.user.hitObstacle <= 0) {
                    this._hero.state = GameConstants.HERO_STATE_FLYING;
                    this._hero.y -= (this._hero.y - this._touchY) * 0.1;

                    // If this._hero is flying extremely fast, create a wind effect and show force field around this._hero.
                    if (Game.user.heroSpeed > GameConstants.HERO_MIN_SPEED + 100) {
                        GameEffect.showWindEffect(this);
                        // Animate this._hero faster.
                        this._hero.toggleSpeed(true);
                    }
                    else {
                        // Animate this._hero normally.
                        this._hero.toggleSpeed(false);
                        GameEffect.stopWindEffect(this);
                    }
                    HeroAnimation._handleHeroPose(this._hero, this._touchY);

                } else {
                    // Hit by obstacle
                    if (Game.user.coffee <= 0) {
                        // Play this._hero animation for obstacle hit.
                        if (this._hero.state !== GameConstants.HERO_STATE_HIT) {
                            this._hero.state = GameConstants.HERO_STATE_HIT;
                        }

                        // Move hero to center of the screen.
                        this._hero.y -= (this._hero.y - winSize.height / 2) * 0.1;

                        // Spin the this._hero.
                        if (this._hero.y > winSize.height * 0.5)
                            this._hero.rotation -= Game.user.hitObstacle * 2;
                        else
                            this._hero.rotation += Game.user.hitObstacle * 2;
                    }

                    // If hit by an obstacle.
                    Game.user.hitObstacle--;

                    // Camera shake.
                    GameEffect._shakeAnimation(this);
                }

                // If we have a mushroom, reduce the value of the power.
                if (Game.user.mushroom > 0) Game.user.mushroom -= elapsed;
                else GameEffect.stopMushroomEffect(this);

                // If we have a coffee, reduce the value of the power.
                if (Game.user.coffee > 0) Game.user.coffee -= elapsed;

                Game.user.heroSpeed -= (Game.user.heroSpeed - GameConstants.HERO_MIN_SPEED) * 0.01;

                // Create food items.
                this._foodManager.update(this._hero, elapsed);
                // Create obstacles.
                this._obstacleManager.update(this._hero, elapsed);

                // Set the background's speed based on hero's speed.
                this._background.speed = Game.user.heroSpeed * elapsed;

                // Calculate maximum distance travelled.
                Game.user.distance += (Game.user.heroSpeed * elapsed) * 0.1;
                this._ui.update();

                break;

            case GameConstants.GAME_STATE_OVER:
                this._foodManager.removeAll();
                this._obstacleManager.removeAll();

                // Spin the hero.
                this._hero.setRotation(30);

                // Make the hero fall.

                // If hero is still on screen, push him down and outside the screen. Also decrease his speed.
                // Checked for +width below because width is > height. Just a safe value.
                if (this._hero.y > -this._hero.height / 2) {
                    Game.user.heroSpeed -= Game.user.heroSpeed * elapsed;
                    this._hero.y -= winSize.height * elapsed;
                }
                else {
                    // Once he moves out, reset speed to 0.
                    Game.user.heroSpeed = 0;

                    // Stop game tick.
                    this.unscheduleUpdate();

                    // Game over.
                    this._gameOver();
                }

                // Set the background's speed based on hero's speed.
                this._background.speed = Game.user.heroSpeed * elapsed;
                break;
        }

        //防止移动超人特效不动的情况
        if (this._mushroomEffect) {
            this._mushroomEffect.x = this._hero.x + this._hero.width / 4;
            this._mushroomEffect.y = this._hero.y;
        }
        if (this._coffeeEffect) {
            this._coffeeEffect.x = this._hero.x + this._hero.width / 4;
            this._coffeeEffect.y = this._hero.y;
        }
    }
});