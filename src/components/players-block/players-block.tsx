import './players-block.scss'
import {PlayerContainer} from '../player-container/player-container'

interface Player {
    id: string
    name: string
}

interface Bracket {
    name?: string
    players?: Array<object> | null
    children?: Array<Bracket>
}

interface Main {
    name?: string
    children?: Array<Bracket>
    playerList?: Array<Player>
}

interface Prop {
    bracket: Main
}

export const PlayersBlock: React.FC<Prop> = (bracket) => {
    console.log(bracket)
    return (
        <div className='players-block'>
            {/* {bracket.children?.map(()=>{
                return "q"
            })} */}
        </div>
    )
}