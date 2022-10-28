import "./players-block.scss"
import { PlayersBracket } from "../players-bracket/players-bracket"

interface Player {
    id?: string
    name?: string
}

interface Bracket {
    name?: string | null
    players?: Array<Player> | null
    children?: Array<Bracket> | null
}


interface Main {
    bracket?: Bracket
    margin?: number
    setMargin(num: number): void
}

export const PlayersBlock: React.FC<Main> = ({margin, setMargin, bracket}) => {
    const startBracket: Bracket | null | undefined = bracket?.children?.[0]
    const getBracketBlocks = (): Array<Bracket> | null => {
        const rounds: Array<Bracket> = []
        let next: Bracket | null | undefined = startBracket
        while(typeof(next) === "object") {
            rounds.push(next)
            next = next?.children?.[0]
            if (!next) {
                break
            }
        }
        return rounds
    }

    return (
        <div className="players-block">
            {getBracketBlocks()?.map((item, index) => {
                console.log(margin)
                return <PlayersBracket key={index} name={item.name} players={item.players}/>
            })}
            <button onClickCapture={() => setMargin(10)}>qqq</button>
        </div>
    )
}

    {/* <PlayersBracket players={startBracket?.players}/> */}