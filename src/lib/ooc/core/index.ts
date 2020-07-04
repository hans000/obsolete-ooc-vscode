import createCoors from "./createCoors";
import CommandBlock from "./CommandBlock";
import parse, { TextToken } from "./parse";
import { getVersionRank, IConfig } from "..";

const head = [
    "summon FallingSand ~ ~1.5 ~ {Time:1,Block:\"minecraft:redstone_block\",Motion:[0d,-1d,0d],Passengers:[{id:FallingSand,Time:1,Block:\"minecraft:activator_rail\",Passengers:[{id:MinecartCommandBlock,Command:\"blockdata ~ ~-2 ~ {auto:0b,Command:\\\"\\\"}\"},",
    "summon falling_block ~ ~1.5 ~ {Time:1,Block:\"minecraft:redstone_block\",Motion:[0d,-1d,0d],Passengers:[{id:falling_block,Time:1,Block:\"minecraft:activator_rail\",Passengers:[{id:commandblock_minecart,Command:\"blockdata ~ ~-2 ~ {auto:0b,Command:\\\"\\\"}\"},",
    "summon minecraft:falling_block ~ ~1.5 ~ {Time:1,BlockState:{Name:\"minecraft:redstone_block\"},Motion:[0d,-1d,0d],Passengers:[{id:\"minecraft:falling_block\",Time:1,BlockState:{Properties:{powered:\"false\",shape:\"north_south\"},Name:\"minecraft:activator_rail\"},Passengers:[{id:\"minecraft:command_block_minecart\",Command:\"data merge block ~ ~-2 ~ {auto:0b,Command:\\\"\\\"}\"},",
]

const tail = [
    "{id:MinecartCommandBlock,Command:\"setblock ~ ~1 ~ command_block 0 replace {auto:1b,Command:\\\"fill ~ ~ ~ ~ ~-2 ~ air\\\"}\"},{id:MinecartCommandBlock,Command:\"kill @e[type=MinecartCommandBlock,r=1]\"}]}]}",
    "{id:commandblock_minecart,Command:\"setblock ~ ~1 ~ command_block 0 replace {auto:1b,Command:\\\"fill ~ ~ ~ ~ ~-2 ~ air\\\"}\"},{id:commandblock_minecart,Command:\"kill @e[type=commandblock_minecart,r=1]\"}]}]}",
    "{id:\"minecraft:command_block_minecart\",Command:\"setblock ~ ~1 ~ minecraft:command_block[conditional=false,facing=down]{auto:1b,Command:\\\"fill ~ ~ ~ ~ ~-2 ~ minecraft:air\\\"} replace\"},{id:\"minecraft:command_block_minecart\",Command:\"kill @e[type=minecraft:command_block_minecart,distance=..1]\"}]}]}",
]

const normal = [
    "{id:MinecartCommandBlock,Command:\"${}\"},",
    "{id:commandblock_minecart,Command:\"${}\"},",
    "{id:\"minecraft:command_block_minecart\",Command:\"${}\"},",
]

export function parseConfig(text: any): IConfig {
    const version = text.version
    const size = text.size.split(/\W+/).map((e: string) => +e)
    const offset = text.offset.split(/\s+/).map((e: string) => +e)
    return { version, size, offset, }
}

export default function OOC(text: string, config: IConfig) {
    const storage: TextToken[] = [];

    let mid = ""
    let init = ""
    let end = ""
    
    const tokens = parse(text)
    const rank = getVersionRank(config.version)
    tokens.forEach(token => {
        if (token.type === 'init') {
            init += normal[rank].replace(/\${}/, token.text)
        } else if (token.type === 'end') {
            end += normal[rank].replace(/\${}/, token.text)
        } else {
            storage.push(token)
        }
    })
    const coors = createCoors(tokens.length, config.size, config.offset)
    const x = config.offset[0]
    storage.forEach((item, index) => {
        const mod = index % x
        if (config.size.join('') !== '00' && (mod === 0 || mod === x - 1) && item.extra.conditioned) {
            throw new Error(`拐角存在条件方块`)
        }
        const coor = coors[index]
        const cmd = new CommandBlock({
            ...item.extra,
            text: item.text.replace(/\\/g, "\\\\").replace(/\"/g, "\\\""),
            coordinate: coor.toString('relative'),
            direaction: coor.dir,
            version: config.version,
        })
        mid = cmd + mid
    })
    return head[rank] + init + mid + end + tail[rank]
}
