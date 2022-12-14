import "./players-bracket.scss"
import { colors } from "../../colors"
import React, { useRef, useContext } from "react"
import { HandlerPlayerContext } from "../../App"
import { SvgLine } from "../svg-line/svg-line"
import "../svg-line/svg-line.scss"

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

let lineCoords = {
    start: 0,
    end: 0
}
const setPosition = (target: HTMLElement, x: number, y: number): void => {
    target.style.transform = `translate(${x}px, ${y}px)`
}

export const PlayersBracket: React.FC<Main> = ({block, round, isFirst, isLast, scale}) => {
    const value = useContext(HandlerPlayerContext)
    const playerHandler = value?.players
    properties = {
        ...properties,
        scale: scale
    }

    const refPlayers = useRef<HTMLDivElement | null>(null)
    const playersRef = refPlayers?.current
    const firstPlayerCoords = playersRef?.firstElementChild?.getBoundingClientRect()
    const lastPlayerCoords = playersRef?.lastElementChild?.getBoundingClientRect()

    lineCoords = {
        ...lineCoords,
        start: lineCoords.start === 0 ? firstPlayerCoords?.top || 0 : 0,
        end: lastPlayerCoords?.bottom || 100
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
            blockTop: blockProperties.top
        }
        let posX = 0
        let posY = 0
        let pageX = e.pageX
        let pageY = e.pageY

        const dragX = e.clientX + window.scrollX
        const dragY = e.clientY + window.scrollY

        const shiftX = dragX - properties.left
        const shiftY = Math.floor(dragY - properties.top)
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

        const scroll = () => {
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
            <div className="round-and-players">
                <div className="name">
                    <h1>{round?.name}</h1>
                </div>
                <div className="players" ref={refPlayers}>
                    {round?.pairs?.map((item, index, arr) => {
                        return (
                            <div key={index}>
                                <div className="pair-and-stroke">
                                    {!isFirst
                                        ? <SvgLine 
                                            classCSS={"before-pair-svg-hor-stroke"}
                                        x1={"0"}
                                        x2={"100%"}
                                        y1={"50%"}
                                            y2={"50%"}
                                        />
                                        : null}
                                    <div className="pair">
                                        <div className="pair-player-container">
                                            {item?.playerOne
                                                ? <h1
                                                    className="player"
                                                    style={{
                                                        backgroundColor: colors[item.playerOne.color!].rgb,
                                                        cursor: isFirst && !round.children ? "pointer" : "default"
                                                    }}
                                                    data-playerid={typeof(item?.playerOne?.position) === "number" && isFirst ? item?.playerOne?.position : null}
                                                    onMouseDown={e => isFirst ? drag(e, item) : null}
                                                >
                                                    {item.playerOne.name}<br />{item.playerOne.id}</h1> : <h1 style={{ backgroundColor: "grey" }}></h1>
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
                                                    {item.playerTwo.name}<br />{item.playerTwo.id}</h1> : <h1 style={{ backgroundColor: "red" }}></h1>
                                                }
                                            </div>
                                            : isLast ? null : <div className={"pair-player-container"}></div>
                                        }
                                    </div>
                                    {arr.length > 1
                                        ? <div className="svg-container">
                                        <SvgLine
                                            classCSS={"pair-svg-hor-stroke"}
                                            x1={"0"}
                                            x2={"110%"}
                                            y1={"50%"}
                                            y2={"50%"}
                                        />
                                        {index % 2 === 0 && index !== arr.length - 1
                                        ? <SvgLine
                                            classCSS={"pair-svg-ver-stroke"}
                                            x1={"2"}
                                            x2={"2"}
                                            y1={"85"}
                                            y2={"100%"}
                                        />
                                        : index === arr.length - 1
                                        ? <SvgLine
                                            classCSS={"pair-svg-ver-stroke"}
                                            x1={"2"}
                                            x2={"2"}
                                            y1={"115"}
                                            y2={"0"}
                                        />
                                        : <SvgLine
                                            classCSS={"pair-svg-ver-stroke"}
                                            x1={"0"}
                                            x2={"0"}
                                            y1={"115"}
                                            y2={"0"}
                                        />}
                                        </div>
                                        : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}