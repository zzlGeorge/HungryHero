var FoodManager = cc.Class.extend({
    _container: null,
    _gameScene: null,

    _itemsToAnimate: null,

    ctor: function (gameScene) {
        this._container = gameScene.itemBatchLayer;
        this._gameScene = gameScene;
        this._itemsToAnimate = [];
    },

    init: function () {
        this.removeAll();
    },
    removeAll: function () {
        if (this._itemsToAnimate.length > 0) {
            for (var i = this._itemsToAnimate.length - 1; i >= 0; i--) {
                var item = this._itemsToAnimate[i];
                this._itemsToAnimate.splice(i, 1);
                cc.pool.putInPool(item);
                this._container.removeChild(item);
            }
        }
    },

    update: function (hero, elapsed) {
        this._animateFoodItems(hero, elapsed);
    },

    _animateFoodItems: function (hero, elapsed) {//食物的运动
        var item;
        for (var i = this._itemsToAnimate.length - 1; i >= 0; i--) {
            item = this._itemsToAnimate[i];

            if (item) {
                // If hero has eaten a mushroom, make all the items move towards him.
                if (Game.user.mushroom > 0 && item.type <= GameConstants.ITEM_TYPE_5) {
                    // Move the item towards the player.
                    item.x -= (item.x - hero.x) * 0.2;
                    item.y -= (item.y - hero.y) * 0.2;
                } else {
                    // If hero hasn't eaten a mushroom,
                    // Move the items normally towards the left.
                    item.x -= Game.user.heroSpeed * elapsed;
                }

                // If the item passes outside the screen on the left, remove it (check-in).

                if (item.x < -80 || Game.gameState === GameConstants.GAME_STATE_OVER) {
                    this._itemsToAnimate.splice(i, 1);
                    cc.pool.putInPool(item);        //必须先放进池（自己在Item中写了retain操作，再removeChild
                    this._container.removeChild(item);
                    continue;
                }
            }
        }
    }
});