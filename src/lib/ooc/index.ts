import OOC from "./core"

export enum Direction { down, up, north, south, west, east, }

export enum BlockType { normal, chain, repeat, }

export enum BlockState { once, tick, }

export type VectorType = 'local' | 'normal' | 'relative'


export interface IConfig {
    size?: [number, number];
    offset?: [number, number, number];
    version?: string
}

export function getVersionRank(version: string) {
    if (!version) {
        return 2
    }
    const v = parseInt(version.slice(2))
    if (v > 16 || v < 9) {
        throw new Error('暂不支持该版本')
    } else if (v > 12) {
        return 2
    } else if (v > 10) {
        return 1
    } else {
        return 0
    }
}


export default OOC