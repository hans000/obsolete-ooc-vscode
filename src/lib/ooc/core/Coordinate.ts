import { Direction, VectorType } from "..";

export default class Coordinate {
    public x: number;
    public y: number;
    public z: number;
    public dir: Direction = Direction.up;

    constructor(x: any, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }
    public toString(type: VectorType = 'normal') {
        if (type === 'local') {
            return `^${this.x} ^${this.y} ^${this.z}`
        }
        if (type === 'relative') {
            return `~${this.x} ~${this.y} ~${this.z}`
        }
        return `${this.x} ${this.y} ${this.z}`
    }
}