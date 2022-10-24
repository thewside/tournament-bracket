import "./players-bracket.scss"

interface Player {
    id?: string
    name?: string
    color?: number
}

interface Bracket {
    name?: string | null
    players?: Array<Player> | null
    children?: Array<Bracket> | null
}

export const PlayersBracket: React.FC<Bracket> = ({name, players}) => {
    return (
        <div className="bracket-stage">
            <div className="name">
                <h1>{name}</h1>
            </div>
            <div className="players">
                {players?.map((item, index) => {
                    let color = item.color === 0 ? "light" : "dark"
                    return <h1 className={color} key={index}>{item.name}</h1>
                })}
            </div>
        </div>
    )
}