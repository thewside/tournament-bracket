import "./players-bracket.scss"
import { colors } from "../../colors"

interface Player {
    id?: string
    name?: string
    color?: number
}

interface Bracket {
    name?: string | null
    players?: Array<Player> | null
    children?: Array<Bracket> | null
    style?: React.CSSProperties | string | number
}

export const PlayersBracket: React.FC<Bracket> = ({name, players, style}) => {
    return (
        <div className="bracket-stage">
            <div className="name">
                <h1>{name}</h1>
            </div>
            <div className="players" style={style}>
                {players?.map((item, index) => {
                    const properties: React.CSSProperties = {
                        backgroundColor: colors[item.color || 0].rgb,
                    }
                    return <h1 style={properties} key={index}>{item.name}<br/>{item.id}</h1>
                })}
            </div>
        </div>
    )
}