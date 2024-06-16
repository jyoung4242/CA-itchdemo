import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, TileMap, Vector } from "excalibur";
import { bluey, model, template, whitey } from "./ui";
//@ts-expect-error not included types in pagkage
import { PerlinGenerator } from "@excaliburjs/plugin-perlin";

export let generator: PerlinGenerator;
getNewNoiseField();
await UI.create(document.body, model, template).attached;

export const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.Fixed, // the display mode
});

export const tmap = new TileMap({
  tileWidth: 16,
  tileHeight: 16,
  columns: 36,
  rows: 36,
});

//loop through tiles in tmap and grab noise value
drawTilemap();
await game.start();
game.add(tmap);
game.currentScene.camera.zoom = 0.6;
game.currentScene.camera.pos = new Vector(300, 300);

export function drawTilemap() {
  //loop through tiles in tmap and grab noise value
  game.remove(game.currentScene.tileMaps[0]);
  let tileIndex = 0;
  for (const tile of tmap.tiles) {
    const noise = generator.noise(tile.x / tmap.columns, tile.y / tmap.rows);
    if (noise > 0.5) {
      model.tiles[tileIndex] = 1;
      tile.addGraphic(bluey);
    } else {
      model.tiles[tileIndex] = 0;
      tile.addGraphic(whitey);
    }
    tileIndex++;
  }
  game.add(tmap);
}

export function getNewNoiseField() {
  generator = new PerlinGenerator({
    seed: Date.now(), // random seed
    octaves: 2, // number of times noise is laid on itself
    frequency: 24, // number of times the pattern oscillates, higher is like zooming out
    amplitude: 0.91, // [0-1] amplitude determines the relative height of the peaks generated in the noise
    persistance: 0.95, // [0-1] he persistance determines how quickly the amplitude will drop off, a high degree of persistance results in smoother patterns, a low degree of persistance generates spiky patterns.
  });
}
