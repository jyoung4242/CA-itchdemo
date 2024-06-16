import { Color, Engine, Rectangle, TileMap } from "excalibur";
import { applyCellularAutomataRules } from "./CA";
import { drawTilemap, game, getNewNoiseField, tmap } from "./main";

export const bluey = new Rectangle({ width: 16, height: 16, color: Color.fromRGB(0, 0, 255, 1) });
export const whitey = new Rectangle({ width: 16, height: 16, color: Color.fromRGB(255, 255, 255, 1) });

export const model = {
  resetSim: (_e: any, m: any) => {
    m.tiles = Array(1296).fill(0);
    getNewNoiseField();
    drawTilemap();
  },
  runSim: (_e: any, m: any) => {
    m.tiles = applyCellularAutomataRules(m.tiles, 36, 36);
    redrawTilemap(m.tiles, tmap, game);
  },
  tiles: Array(1296).fill(0),
};

export const template = `
<style> 
    body{
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
    }
    div{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
   
</style> 
<div> 
    <canvas id='cnv'> </canvas> 
    <button id='btn' \${click@=>runSim}>CA Generation Step</button>
    <button \${click@=>resetSim}>Reset</button>
</div>`;

function redrawTilemap(map: number[], tilemap: TileMap, game: Engine) {
  game.remove(game.currentScene.tileMaps[0]);
  let tileIndex = 0;
  for (let tile of tilemap.tiles) {
    const value = map[tileIndex];
    if (value == 1) {
      tile.addGraphic(bluey);
    } else {
      tile.addGraphic(whitey);
    }
    tileIndex++;
  }
  game.add(tilemap);
}
