import { Direction, BlockType, BlockState, getVersionRank } from "..";

export interface ICommandBlockData {
    text: string;
    coordinate: string;
    direaction: Direction;
    type: BlockType;
    state: BlockState;
    conditioned: boolean;
    version: string;
}

export default class CommandBlock {
    static mapType = ['', 'chain_', 'repeating_']
    static mapDir = ['down', 'up', 'north', 'south', 'west', 'east']
    private data: ICommandBlockData

    constructor(data: ICommandBlockData) {
        this.data = data
    }
    toString() {
        const rank = getVersionRank(this.data.version)
        if (rank === 2) {
            const head = "{id:\"minecraft:command_block_minecart\",Command:\"setblock "
            const mid = "{auto:" + +(this.data.state === BlockState.tick) + "b,Command:\\\""
            const tail = "\\\"} replace\"},"
            return `${head}${this.data.coordinate} minecraft:${CommandBlock.mapType[this.data.type] + 'command_block'}[conditional=${this.data.conditioned.toString()},facing=${CommandBlock.mapDir[this.data.direaction]}]${mid}${this.data.text}${tail}`
        }
        if (rank === 1) {
            const head = "{id:\"minecraft:commandblock_minecart\",Command:\"setblock "
            const mid = "replace {Command:\\\"";
            const tail = "\\\",auto:" + +(this.data.state === BlockState.tick) + "b}\"},"
            return `${head}${this.data.coordinate} ${CommandBlock.mapType[this.data.type] + 'command_block'} ${this.data.direaction + (this.data.conditioned ? 8 : 0)} ${mid}${this.data.text}${tail}`
        } else {
            const head = "{id:MinecartCommandBlock,Command:\"setblock "
            const mid = "replace {Command:\\\"";
            const tail = "\\\",auto:" + +(this.data.state === BlockState.tick) + "b}\"},"
            return `${head}${this.data.coordinate} ${CommandBlock.mapType[this.data.type] + 'command_block'} ${this.data.direaction + (this.data.conditioned ? 8 : 0)} ${mid}${this.data.text}${tail}`
        }
    }
}