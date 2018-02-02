/**
 * Created by George on 2018/2/2.
 * ��Ϸ��һЩ��Ч
 */

var GameEffect = {
    _shakeAnimation: function (gameScene) {
        //ײ��ʱ���涶��
        // Animate quake effect, shaking the camera a little to the sides and up and down.
        if (Game.user.hitObstacle > 0) {
            gameScene.x = parseInt(Math.random() * Game.user.hitObstacle - Game.user.hitObstacle * 0.5);
            gameScene.y = parseInt(Math.random() * Game.user.hitObstacle - Game.user.hitObstacle * 0.5);
        } else if (gameScene.x !== 0) {
            // If the shake value is 0, reset the stage back to normal. Reset to initial position.
            gameScene.x = 0;
            gameScene.y = 0;
        }
    },

    showWindEffect: function (gameScene) {
        if (gameScene._windEffect)
            return;
        gameScene._windEffect = new cc.ParticleSystem(res.wind_plist);
        gameScene._windEffect.x = cc.director.getWinSize().width;
        gameScene._windEffect.y = cc.director.getWinSize().height / 2;
        gameScene._windEffect.setScaleX(100);
        gameScene.addChild(gameScene._windEffect);
    },

    stopWindEffect: function (gameScene) {
        if (gameScene._windEffect) {
            gameScene._windEffect.stopSystem();
            gameScene.removeChild(gameScene._windEffect);
            gameScene._windEffect = null;
        }
    },

    showCoffeeEffect: function (gameScene) {
        if (gameScene._coffeeEffect)
            return;
        gameScene._coffeeEffect = new cc.ParticleSystem(res.coffee_plist);
        gameScene.addChild(gameScene._coffeeEffect);
        gameScene._coffeeEffect.x = gameScene._hero.x + gameScene._hero.width / 4;
        gameScene._coffeeEffect.y = gameScene._hero.y;
    },

    stopCoffeeEffect: function (gameScene) {
        if (gameScene._coffeeEffect) {
            gameScene._coffeeEffect.stopSystem();
            gameScene.removeChild(gameScene._coffeeEffect);
            gameScene._coffeeEffect = null;
        }
    },

    showMushroomEffect: function (gameScene) {
        if (gameScene._mushroomEffect)//�������
            return;
        gameScene._mushroomEffect = new cc.ParticleSystem(res.mushroom_plist);
        gameScene.addChild(gameScene._mushroomEffect);
        gameScene._mushroomEffect.x = gameScene._hero.x + gameScene._hero.width / 4;
        gameScene._mushroomEffect.y = gameScene._hero.y;
    },

    stopMushroomEffect: function (gameScene) {
        if (gameScene._mushroomEffect) {
            gameScene._mushroomEffect.stopSystem();
            gameScene.removeChild(gameScene._mushroomEffect);
            gameScene._mushroomEffect = null;
        }
    },

    showEatEffect: function (gameScene, itemX, itemY) {
        var eat = new cc.ParticleSystem(res.eat_plist);
        eat.setAutoRemoveOnFinish(true);
        eat.x = itemX;
        eat.y = itemY;
        gameScene.addChild(eat);
    }
};
