export function applyCellularAutomataRules(
  map: number[],
  width: number,
  height: number,
  oob: string | undefined,
  cutoff0: number | undefined,
  cutoff1: number | undefined
): number[] {
  const newMap = new Array(width * height).fill(0);

  let zeroLimit = 4;
  if (cutoff0) zeroLimit = cutoff0 + 1;
  let oneLimit = 5;
  if (cutoff1) oneLimit = cutoff1;

  for (let i = 0; i < height * width; i++) {
    for (let x = 0; x < width; x++) {
      const wallCount = countAdjacentWalls(map, width, height, i, oob);
      if (map[i] === 1) {
        if (wallCount < zeroLimit) {
          newMap[i] = 0; // Change to floor if there are less than 4 adjacent walls
        } else {
          newMap[i] = 1; // Remain wall
        }
      } else {
        if (wallCount >= oneLimit) {
          newMap[i] = 1; // Change to wall if there are 5 or more adjacent walls
        } else {
          newMap[i] = 0; // Remain floor
        }
      }
    }
  }
  return newMap;
}

function countAdjacentWalls(map: number[], width: number, height: number, index: number, oob: string | undefined): number {
  let count = 0;

  const y = Math.floor(index / width);
  const x = index % width;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      //if (map[y + i][x + j] === 1) count++;

      const newY = y + i;
      const newX = x + j;
      if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
        const adjacentIndex = newY * width + newX;
        if (map[adjacentIndex] === 1) count++;
      } else {
        switch (oob) {
          case "floor":
            break;
          case "wall":
            count++;
            break;
          case "random":
            let coinflip = Math.random();
            if (coinflip > 0.5) count++;
            break;
          case "mirror":
            if (map[index] == 1) count++;
            break;
          default:
            count++; // Perceive out of bounds as wall
            break;
        }
      }
    }
  }
  return count;
}
