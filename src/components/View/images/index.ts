import AliensSprite from "./aliens-sprite.png";
import PlayerSpaceship from "./spaceship.png";
import Boss from "./boss.png";

const aliensSprite = new Image(600, 100);
aliensSprite.src = AliensSprite;
const playerSpaceship = new Image(100, 100);
playerSpaceship.src = PlayerSpaceship;
const bossImage = new Image(100, 100);
bossImage.src = Boss;

export { aliensSprite, playerSpaceship, bossImage };
