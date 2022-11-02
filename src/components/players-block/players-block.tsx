import "./players-block.scss"
import { PlayersBracket } from "../players-bracket/players-bracket"

interface Player {
    id?: string
    name?: string
}

interface Pair {
    playerOne?: Player | null
    playerTwo?: Player | null
}

interface Bracket {
    name?: string | null
    players?: Array<Player> | null
    children?: Array<Bracket> | null
    pairs?: Array<Pair | null>
}

interface Main {
    bracket?: Bracket
}

export const PlayersBlock: React.FC<Main> = ({bracket}) => {
    const startBracket: Bracket | null = bracket?.children?.[0] || null
    const getBracketBlocks = () => {
        const result: Array<Bracket> | null = []

        let next: Bracket | null | undefined = startBracket
        let count = 0

        while(typeof(next) === "object") {
            const pairContainer: Array<Pair> = []
            if (next?.players) {
                for (let i = 0; i < next.players!.length; i++) {
                    if (i % 2 === 0) {
                        const pair: Pair = {
                            playerOne: next.players?.[i] || null,
                            playerTwo: next.players?.[i + 1] || null
                        }
                        pairContainer.push(pair)
                    }
                }
            }
            result.push({...next, pairs: pairContainer})
            next = next?.children?.[0]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            count += 1
            if (!next) {
                break
            }
        }
        return result
    }

    return (
        <div className="players-block">
            {getBracketBlocks()?.map((round, index) => {
                return <PlayersBracket key={index} round={round} isFirst={index === 0 ? true : false}/>
            })}
        </div>
    )
}