import { ICommandBlockData } from "./CommandBlock"
import { BlockType, BlockState, IConfig } from ".."

type TokenType = 'init' | 'end' | 'normal'

export interface TextToken {
    text: string;
    type: TokenType;
    extra?: Pick<ICommandBlockData, 'conditioned' | 'state' | 'type'>;
}

export type TextTokenType = 'init' | 'end' | 'scb' | 'ccb' | 'icb'

function getTokenType(type: string): TokenType {
    return type === 'init' || type === 'end' ? type : 'normal'
}
function getBlockType(type: string): BlockType {
    return type === 'rcb' ? BlockType.repeat : type === 'icb' ? BlockType.normal : BlockType.chain
}
function parseConfig(config: IConfig, field: string, value: string) {
    if (field === 'version') {
        config.version = value
    } else if (field === 'size') {
        const [a, b] = value.split(/\W+/)
        config.size = [+a, +b]
    } else if (field === 'offset') {
        const [x, y, z] = value.split(/\s+/)
        config.offset = [+x, +y, +z]
    }
}
export default function(text: string) {
    const tokens: TextToken[] = []
    const config: IConfig = {}
    let conditioned = false
    let blockState: BlockState = BlockState.tick
    let type: TextTokenType = 'ccb'
    let count = 0
    let readConfig = false
    let readEnd = false

    const lines = text.split('\n')
    for(let line of lines) {
        line = line.trim()
        if (!line.length) continue;
        // 解析配置
        if (!readConfig) {
            if (/#\s*\[\s*config\s*\]/.test(line)) {
                readConfig = true
                continue
            }
        }
        // 解析正文
        const match = line.match(/#\s*\[\s*(>*)\s*(rcb|ccb|icb|init|end)\s*(\*?)\s*(\d*)\s*\]/)
        if (match) {
            readEnd = true
            const [_, c, w, s, n] = match
            conditioned = !!c
            type = (w || 'ccb') as TextTokenType
            blockState = s ? BlockState.once : BlockState.tick
            count = n === "" ? -1 : +n
            continue
        }
        if (line.startsWith('#')) {
            // 读取配置
            if (readConfig && !readEnd) {
                const match = line.match(/#\s*-(version|size|offset)\s+(.+)/)
                if (match) {
                    const [_, k, v] = match
                    parseConfig(config, k, v.trim())
                }
            }
            continue
        }
        const obj: TextToken = {
            text: line,
            type: 'normal',
        }
        if (count) {
            obj.type = getTokenType(type)
            if (obj.type === 'normal') {
                obj.extra = {
                    conditioned,
                    type: getBlockType(type),
                    state: blockState,
                }
            }
        } else {
            obj.extra = {
                conditioned: false,
                type: BlockType.chain,
                state: BlockState.tick,
            }
        }
        count--
        tokens.push(obj)
    }
    return {
        tokens,
        config,
    }
}