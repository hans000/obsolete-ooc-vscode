const BLOCK: any = {
    rcb: '循环命令方块',
    ccb: '连锁命令方块',
    icb: '脉冲命令方块',
    init: `预处理指令，一般是积分版之类的`,
    end: `结尾处理指令，一般是清除marker等指令`,
}

export default function logicProvider(m: RegExpMatchArray) {
    const [_, a, b, c] = m;
    
    if (b === 'init' || b === 'end') {
        return [
            `**说明**`,
            `${BLOCK[b]}`,
        ]
    }
    const line1 = !!a ? '条件执行' : '无条件限制';
    const line2 = b ? BLOCK[b] : '连锁命令方块';
    const line3 = !!c ? '红石触发' : '保持开启';

    return [
        `**类型**`,
        `- ${line2} - ${line1} - ${line3}`, 
    ]
}