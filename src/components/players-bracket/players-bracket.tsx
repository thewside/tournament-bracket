import "./players-bracket.scss"
import { colors } from "../../colors"
import React from "react"

interface Player {
    id?: string
    name?: string
    color?: number
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
    round: Bracket | null
    isFirst: boolean
}

export const PlayersBracket: React.FC<Main> = ({round, isFirst}) => {
    return (
        <div className="bracket-stage">
            <div className="name">
                <h1>{round?.name}</h1>
            </div>
            <div
                className="players"
            >
                {round?.pairs?.map((item, index) => {
                    return <div key={index} className="pairContainer">
                        <div>
                            {!isFirst ? <svg height="210">
                                <line x1="0" y1="0" x2="100" y2="0" style={{
                                    stroke: "rgb(255,255,255)",
                                    strokeWidth: "20px"
                                }} />
                            </svg> : null}
                            {!isFirst ? <svg height="210">
                                <line x1="0" y1="0" x2="100" y2="0" style={{
                                    stroke: "rgb(255,255,255)",
                                    strokeWidth: "20px"
                                }} />
                            </svg> : null}
                        </div>
                        <div className="players">
                            {item?.playerOne ? <h1 style={{ backgroundColor: colors[item.playerOne.color!].rgb }}>
                                {item.playerOne.name}<br />{item.playerOne.id}</h1>
                                : null}
                            {item?.playerTwo ? <h1 style={{ backgroundColor: colors[item.playerTwo.color!].rgb }}>
                                {item.playerTwo.name}<br />{item.playerTwo.id}</h1>
                                : null}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

// return <h1
// style={{backgroundColor: colors[item.color || 0].rgb}}
// key={indexPlayer}
// >{item.name}<br/>{item.id}</h1>

// {players?.map((item, indexPlayer, arr) => {
//     inline = {
//         ...inline,
//         backgroundColor: colors[item.color || 0].rgb
//     }
//     if(indexBlock === 0 && indexPlayer % 2 === 0) {
//         inline = {
//             ...inline,
//             marginTop: `${marginT}px`,
//             marginBottom: ""
//         }
//     } else {
//         inline = {
//             ...inline,
//             marginTop: "",
//             marginBottom: ""
//         }
//     }

//     if(indexBlock! > 0 && indexPlayer > 0 && indexPlayer % 2 === 0) {
//         inline = {
//             ...inline,
//             marginTop: `${marginT}px`,
//             marginBottom: "0px"
//         }
//     }

//     if(indexBlock! > 0 && indexPlayer > 0 && indexPlayer % 2 !== 0) {
//         inline = {
//             ...inline,
//             marginBottom: `${marginB}px`
//         }
//     }

//     return <h1
//         style={inline}
//         key={indexPlayer}
//     >{item.name}<br/>{item.id}</h1>
// })}