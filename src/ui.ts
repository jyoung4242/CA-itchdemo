import { Color, Engine, Rectangle, TileMap } from "excalibur";
import { applyCellularAutomataRules } from "./CA";
import { drawTilemap, game, getNewNoiseField, tmap } from "./main";

export const bluey = new Rectangle({ width: 16, height: 16, color: Color.fromRGB(0, 0, 255, 1) });
export const whitey = new Rectangle({ width: 16, height: 16, color: Color.fromRGB(255, 255, 255, 1) });

export const model = {
  OOBbehavior: undefined as HTMLSelectElement | undefined,
  cutoff0: undefined as HTMLInputElement | undefined,
  cutoff1: undefined as HTMLInputElement | undefined,
  resetSim: (_e: any, m: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    m.tiles = Array(1296).fill(0);
    getNewNoiseField();
    drawTilemap();
    if (m.OOBbehavior) m.OOBbehavior.value = "wall";
    if (m.cutoff0) m.cutoff0.value = "3";
    if (m.cutoff1) m.cutoff1.value = "5";
  },

  runSim: (_e: any, m: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    const oob = m.OOBbehavior?.value;
    const cutoff0 = parseInt(m.cutoff0?.value);
    const cutoff1 = parseInt(m.cutoff1?.value);
    m.tiles = applyCellularAutomataRules(m.tiles, 36, 36, oob, cutoff0, cutoff1);
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
    hud-layer{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
      .app{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;  
      }

      .button{
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        background-color: #ccc;
        border: 1px solid #000;
        cursor: pointer;
        font-size: 24px;
        color: #0000ff;

      }

      .controls{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        color: #0000ff;
        font-size: 24px;
        
      }

      select {
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        background-color: #ccc;
        color: #0000ff;
      }

      input {
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        background-color: #ccc;
        color: #0000ff;
        font-size: 16px;
        text-align: center;
      }

      .buttoncontainer{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    
   
</style> 
<div class="app" > 
    <div style="width: 800px; height: 600px; position: relative">
      <canvas id='cnv'> </canvas> 
      <hud-layer>
          <div class="buttoncontainer">
            <button class="button generate" \${click@=>runSim}>CA Generation Step</button>
            <button class="button reset" \${click@=>resetSim}>Reset</button>
          </div>
          
          <div class="controls">
            <label>Out of Bounds behavior</label>
            <select \${==>OOBbehavior}>
                <option value="wall">Make Wall</option>
                <option value="floor">Make Floor</option>
                <option value="mirror">Mirror</option>
                <option value="random">Random</option>
            </select>
            <label>0 cutoff</label>
            <input type="number" min="1" max="7" value="3" \${==>cutoff0} />
            <label>1 cutoff</label>
            <input type="number" min="1" max="7" value="5" \${==>cutoff1} />
          </div>
      </ hud-layer>
      
   
    </div>
    
</div>`;

function redrawTilemap(map: number[], tilemap: TileMap, game: Engine) {
  game.remove(game.currentScene.tileMaps[0]);
  let tileIndex = 0;
  for (const tile of tilemap.tiles) {
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
