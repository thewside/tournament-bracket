import "./players-bracket.scss"
import { colors } from "../../colors"
import React, { useEffect, useRef } from "react"
import { useContext } from "react"
import { HandlerPlayerContext } from "../../App"

interface Player {
    id?: string
    name?: string
    position?: number
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

export const PlayersBracket: React.FC<Main> = ({ round, isFirst}) => {
    const value = useContext(HandlerPlayerContext)
    const playerHandler = value?.players
    const refPlayer = useRef<HTMLHeadingElement | null>(null)
    let properties = {
        height: 0,
        width: 0,
        left: 0,
        top: 0
    }

    useEffect(() => {
        if(refPlayer.current){
            const options = refPlayer.current.getBoundingClientRect()
            properties = {
                ...properties,
                height: options.height,
                width: options.width,
                left: options.left
            }
        }
    })

    const drag = (e: React.MouseEvent, item: Pair): void => {
        if(e.button > 0) return
        if(typeof(item?.playerOne?.position) !== "number") return
        if(!isFirst) return
        if(round?.children) return

        const clickTarget = e.target as HTMLElement
        const options = clickTarget.getBoundingClientRect()
        properties = {
            ...properties,
            top: options.top
        }
        const color = clickTarget.style.backgroundColor

        const dragPlayer = Number(clickTarget.dataset.playerid)
        const shiftX = e.clientX - properties.left
        const shiftY = e.clientY - properties.top
        let posX = e.pageX - shiftX - clickTarget.offsetLeft
        let posY = e.pageY - shiftY - clickTarget.offsetTop

        clickTarget.style.backgroundColor = color.slice(0, -1) + ", 0.7)"
        clickTarget.classList.add("player-drag")

        const setPosition = (x: number, y: number): void => {
            clickTarget.style.transform = `translate(${x}px, ${y}px)`
        }


        setPosition(posX, posY)

        const move = (e: MouseEvent): void => {
            posX = e.pageX - shiftX - clickTarget.offsetLeft
            posY = e.pageY - shiftY - clickTarget.offsetTop
            setPosition(posX, posY)
        }

        const over = (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            if(target.dataset.playerid) {
                target.classList.add("lightened")
            }
        }

        const out = (e: MouseEvent): void => {
            const target = e.target as Element
            target.classList!.remove("lightened")
        }

        const scroll = () => {
            setPosition(
                window.pageXOffset,
                window.pageYOffset
            )
        }

        const drop = (e: MouseEvent): void => {
            window.removeEventListener("mouseover", over)
            window.removeEventListener("mouseout", out)
            window.removeEventListener("mousemove", move)
            window.removeEventListener("mouseup", drop)
            window.removeEventListener("scroll", scroll)

            const target = e.target as HTMLElement
            const dropPlayer = Number(target.dataset.playerid)
            clickTarget.classList!.remove("player-drag")
            clickTarget.classList!.remove("lightened")
            clickTarget.style!.transform = `translate(${0}px, ${0}px)`
            clickTarget.style.backgroundColor = color

            if(isFirst) playerHandler!(dragPlayer, dropPlayer)
            if(target.classList) {
                target.classList!.remove("lightened")
            }
        }

        window.addEventListener("mouseover", over)
        window.addEventListener("mouseout", out)
        window.addEventListener("mousemove", move)
        window.addEventListener("mouseup", drop)
        window.addEventListener("scroll", scroll)
    }

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
                        <div className="players">
                            <div className="pair">
                                <div className="pair-player-container">
                                    {item?.playerOne ? <h1
                                        ref={isFirst && index === 0 ? refPlayer : null}
                                        className="player"
                                        style={{
                                                backgroundColor: colors[item.playerOne.color!].rgb,
                                                cursor: isFirst && !round.children ? "pointer" : "default"
                                        }}
                                        data-playerid={typeof(item?.playerOne?.position) === "number" && isFirst ? item?.playerOne?.position : null }
                                        onMouseDown={e => isFirst ? drag(e, item) : null}
                                    >
                                        {item.playerOne.name}<br/>{item.playerOne.id}</h1> : <h1 style={{ backgroundColor: "grey"}}></h1>
                                    }
                                </div>
                                {item?.playerTwo ? <div className="pair-player-container">
                                    {item?.playerTwo ? <h1
                                        className="player"
                                        style={{
                                            backgroundColor: colors[item.playerTwo.color!].rgb,
                                            cursor: isFirst && !round.children ? "pointer" : "default"
                                        }}
                                        data-playerid={typeof(item?.playerOne?.position) === "number" && isFirst ? item!.playerOne!.position + 1 : null}
                                        onMouseDown={e => isFirst ? drag(e, item) : null}
                                    >
                                        {item.playerTwo.name}<br/>{item.playerTwo.id}</h1> : <h1 style={{ backgroundColor: "red"}}></h1>
                                    }
                                </div> : null}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}



    // const refPlayer = useRef<HTMLHeadingElement | null>(null)
    // let properties = {
    //     height: 0,
    //     width: 0
    // }
    // useEffect(()=>{
    //     if(refPlayer.current){
    //         const options = refPlayer.current.getBoundingClientRect()
    //         properties = {
    //             ...properties,
    //             height: options.height,
    //             width: options.width
    //         }
    //     }
    // })


                       {/* {!isFirst ?<div>
                            <svg height="210">
                                <line x1="0" y1="0" x2="100" y2="0" style={{
                                    stroke: "rgb(255,255,255)",
                                    strokeWidth: "20px"
                                }} />
                            </svg>
                            <svg height="210">
                                <line x1="0" y1="0" x2="100" y2="0" style={{
                                    stroke: "rgb(255,255,255)",
                                    strokeWidth: "20px"
                                }} />
                            </svg>
                        </div> : null} */}