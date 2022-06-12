interface coord {
    x: number;
    y: number;
}
export default function getAllPossibleDirections(index: number, nrows: number, ncols: number): number[] {

    const origin: coord = {x: Math.floor(index / ncols), y: index % ncols}
    // Get all possbile directions from origin.
    const xCoords: number[] = [origin.x, origin.x+1, origin.x-1].filter((val) => val>=0 && val<nrows);
    const yCoords: number[] = [origin.y, origin.y+1, origin.y-1].filter((val) => val>=0 && val<ncols);
    const nearCoords: number[] = [];
    xCoords.forEach(x => {
        yCoords.forEach(y => {
            nearCoords.push(ncols * x + y)
        })
    })
    // We use slice to avoid the first value which is the origin coords
    return nearCoords.slice(1);
}