import AliensSprite from "./aliens-sprite.png";
import PlayerSpaceship from "./spaceship.png";
import Boss from "./boss.png";
import WigglyBullet from "./wiggly-bullet.png";
import ArrowKeys from "./arrow-keys.png";
import SpaceKey from "./space-key.png";
import SoundIcon from "./sound-icon.png";
import SquareKeys from "./square-keys.png";

const aliensSprite = new Image(600, 100);
aliensSprite.src = AliensSprite;
const playerSpaceship = new Image(100, 100);
playerSpaceship.src = PlayerSpaceship;
const bossImage = new Image(100, 100);
bossImage.src = Boss;
const wigglyBulletImage = new Image(100, 100);
wigglyBulletImage.src = WigglyBullet;
const squareKeysSprite = new Image(600, 100);
squareKeysSprite.src = SquareKeys;
const spaceKeyImage = new Image(600, 100);
spaceKeyImage.src = SpaceKey;
const soundIcon = new Image(25, 23);
soundIcon.src = SoundIcon;

export {
  aliensSprite,
  playerSpaceship,
  bossImage,
  wigglyBulletImage,
  spaceKeyImage,
  soundIcon,
  squareKeysSprite
};
