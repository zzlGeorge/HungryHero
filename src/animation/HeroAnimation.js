/**
 * Created by George on 2018/2/2.
 *
 * ���˶���
 */

var HeroAnimation = {

    _handleHeroPose: function (hero, touchY) {
        //�ƶ����ʱʹ������б
        var winSize = cc.director.getWinSize();
        // Rotate hero based on mouse position.
        if (Math.abs(-(hero.y - touchY) * 0.2) < 30)
            hero.setRotation((hero.y - touchY) * 0.2);

        // Confine the hero to stage area limit
        if (hero.y < hero.height * 0.5) {
            hero.y = hero.height * 0.5;
            hero.setRotation(0);
        }
        if (hero.y > winSize.height - hero.height * 0.5) {
            hero.y = winSize.height - hero.height * 0.5;
            hero.setRotation(0);
        }
    }

};