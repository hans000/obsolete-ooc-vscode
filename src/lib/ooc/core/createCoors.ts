import Coordinate from "./Coordinate";
import { Direction } from "..";

export default function(count: number, size = [4, 4], offset = [2, 0, 0]) {
    let flag = false
    let flag2 = false
    const L = size[0]
    const W = size[1]
    const C = count
    const LW = L * W
    const arr = []
    for (let i = 0; i <= C; i++) {
        const coor = new Coordinate(offset[0], offset[1], offset[2])
        if (i % L === 0) {
            flag = !flag
        }
        if (i % (L * W) === 0) {
            flag2 = !flag2
        }
        coor.z += flag2 ? i % LW / L >> 0 : (LW - 1 - i%LW) / L >> 0
        if (flag) {
            coor.x += i % L
            coor.dir = Direction.east
        } else {
            coor.x += L - 1 - i % L
            coor.dir = Direction.west
        }
        if((i + 1) % L === 0) {
            if (flag2) {
                coor.dir = Direction.south
            } else {
                coor.dir = Direction.north
            }
        }
        if((i + 1) % (L * W) === 0) {
            coor.dir = Direction.up
        }
        coor.y += i / LW >> 0
        arr.push(coor)
    }
    return arr
}