import "./players-bracket.scss"
import { colors } from "../../colors"
import React, { useRef, useContext } from "react"
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
    block?: HTMLDivElement | null
    round?: Bracket | null
    isFirst?: boolean
    isLast?: boolean | number
    scale: number
}

let properties = {
    height: 0,
    width: 0,
    left: 0,
    top: 0,
    blockLeft: 0,
    blockTop: 0,
    scale: 0
}

const setPosition = (target: HTMLElement, x: number, y: number): void => {
    target.style.transform = `translate(${x}px, ${y}px)`
}

export const PlayersBracket: React.FC<Main> = ({block, round, isFirst, isLast, scale}) => {
    const value = useContext(HandlerPlayerContext)
    const playerHandler = value?.players
    const refPlayer = useRef<HTMLHeadingElement | null>(null)
    properties = {
        ...properties,
        scale: scale
    }
    const drag = (e: React.MouseEvent, item: Pair): void => {
        if(e.button > 0) return
        if(typeof(item?.playerOne?.position) !== "number") return
        if(!isFirst) return
        if(round?.children) return
        const clickTarget = e.target as HTMLElement
        const options = clickTarget.getBoundingClientRect()
        const blockProperties = block!.getBoundingClientRect()
        properties = {
            ...properties,
            height: options.height,
            width: options.width,
            left: options.left,
            top: options.top + window.scrollY,
            blockLeft: blockProperties.left,
            blockTop: blockProperties.top,
        }

        let posX = 0
        let posY = 0
        let pageX = e.pageX
        let pageY = e.pageY

        const dragX = e.clientX + window.scrollX
        const dragY = e.clientY + window.scrollY

        let shiftX = dragX - properties.left
        let shiftY = Math.floor(dragY - properties.top)
        const color = clickTarget.style.backgroundColor
        const dragPlayer = Number(clickTarget.dataset.playerid)

        clickTarget.style.backgroundColor = color.slice(0, -1) + ", 0.7)"
        clickTarget.classList.add("player-drag")
        setPosition(clickTarget, posX / scale, posY / scale)

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

        let scrollMove = false
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let timeout: ReturnType<typeof setTimeout> | null = null
        let interval: ReturnType<typeof setInterval> | null = null

        const delay = () => {
            timeout = setTimeout(() => {
                scrollMove = false
                timeout = null
                if(interval) clearInterval(interval)
                console.log("stop")

                setPosition(
                    clickTarget,
                    posX / properties.scale,
                    posY / properties.scale
                )
            }, 300)
        }
        const move = (e: MouseEvent): void => {
            pageY = e.pageY
            pageX = e.pageX
            posY = pageY - properties.top - shiftY
            posX = pageX - properties.left - shiftX // - window.scrollX
            setPosition(clickTarget, posX / properties.scale, posY / properties.scale)
        }

        const scroll = (e: Event) => {
            if(scrollMove) {
                if(interval) clearInterval(interval)
                interval = null
                return
            }
            scrollMove = true

            delay()
        }

        const drop = (e: MouseEvent): void => {
            window.removeEventListener("scroll", scroll)
            window.removeEventListener("mouseover", over)
            window.removeEventListener("mouseout", out)
            window.removeEventListener("mousemove", move)
            window.removeEventListener("mouseup", drop)
            console.log(clickTarget)
            clickTarget.classList!.remove("player-drag")
            clickTarget.classList!.remove("lightened")
            clickTarget.style!.transform = ""
            clickTarget.style.backgroundColor = color
            if(interval) clearInterval(interval)

            const target = e.target as HTMLElement
            if(!target.dataset) return
            const dropPlayer = Number(target.dataset.playerid)
            if(isFirst) playerHandler!(dragPlayer, dropPlayer)
            if(target.classList) {
                target.classList!.remove("lightened")
            }
        }

        window.addEventListener("scroll", scroll)
        window.addEventListener("mouseover", over)
        window.addEventListener("mouseout", out)
        window.addEventListener("mousemove", move)
        window.addEventListener("mouseup", drop)
    }
    return (
        <div className="bracket-stage">
            <div className="name">
                <h1>{round?.name}</h1>
            </div>
            <div className="players">
                {round?.pairs?.map((item, index) => {
                    return <div key={index} className="pairContainer">
                        <div className="players">
                            <div className="pair">
                                <div className="pair-player-container">
                                    {item?.playerOne
                                    ? <h1
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
                                {item?.playerTwo
                                  ? <div className="pair-player-container">
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
                                    </div>
                                  : isLast ? null : <div className={"pair-player-container"}></div> 
                                }
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


                        // {!isFirst ?<div>
                        //     <svg height="210">
                        //         <line x1="0" y1="0" x2="100" y2="0" style={{
                        //             stroke: "rgb(255,255,255)",
                        //             strokeWidth: "20px"
                        //         }} />
                        //     </svg>
                        //     <svg height="210">
                        //         <line x1="0" y1="0" x2="100" y2="0" style={{
                        //             stroke: "rgb(255,255,255)",
                        //             strokeWidth: "20px"
                        //         }} />
                        //    </svg>}