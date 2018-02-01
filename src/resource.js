var res = {
    HelloWorld_png: "res/HelloWorld.png",
    texture_plist: "res/graphics/texture.plist",
    bgWelcome_jpg: "res/graphics/bgWelcome.jpg",
    bgLayer_jpg: "res/graphics/bgLayer.jpg",
    texture_png: "res/graphics/texture.png",
    coffee_plist:"res/particles/coffee.plist",
    eat_plist:"res/particles/eat.plist",
    wind_plist:"res/particles/wind.plist",
    mushroom_plist:"res/particles/mushroom.plist"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
