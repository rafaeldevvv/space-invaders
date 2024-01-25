import AliensSprite from "./aliens-sprite.png";
import PlayerSpaceship from "./spaceship.png";
import Boss from "./boss.png";
import WigglyBullet from "./wiggly-bullet.png";

const aliensSprite = new Image(600, 100);
aliensSprite.src = AliensSprite;
const playerSpaceship = new Image(100, 100);
playerSpaceship.src = PlayerSpaceship;
const bossImage = new Image(100, 100);
bossImage.src = Boss;
const wigglyBulletImage = new Image(100, 100);
wigglyBulletImage.src = WigglyBullet;

export { aliensSprite, playerSpaceship, bossImage, wigglyBulletImage };
