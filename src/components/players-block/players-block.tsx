import "./players-block.scss"
import React, { useEffect, useRef, useState } from "react"
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



interface Pos {
    x: number
    y: number
    scale: number
    start: {startX?: number, startY?: number}
}

let constProps = {
    offsetTop: 0,
    scroll: 0
}

const scaleValue = 0.0002

let panning = false
let posX = 0
let posY = 0
let shiftX = 0
let shiftY = 0

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

    const maxSlide = 150 // slider = maxSlide / 100
    const minSlide = 10 // slider = maxSlide / 100
    const startMultiplier = 4

    const containerRef = useRef<HTMLInputElement | null>(null)
    const [pos, setPos] = useState<Pos>({
        x: 0,
        y: 0,
        scale: 1,
        start: {
            startX: 0,
            startY: 0
        }
    })
    useEffect(() => {
        // const screenWidth = document.body.clientWidth
        setPos(prev => ({
            ...prev,
                // x: screenWidth / 3,
                scale: minSlide / 100 * startMultiplier
        }))
        sliderRef.current!.valueAsNumber = minSlide * startMultiplier
        constProps = {
            ...constProps,
                offsetTop: containerRef.current!.getBoundingClientRect().top
        }
    }, [])

    const drag = (e: React.MouseEvent): void => {
        panning = false
        if(e.button > 0) return
        const clickTarget = e.target as HTMLElement
        if(clickTarget.dataset.playerid) return

        const mainBlock = containerRef.current!
        const properties = mainBlock.getBoundingClientRect()

        // mouse coords witn shift left and top = 0, 0
        shiftX = e.clientX - properties.left
        shiftY = Math.floor(e.clientY - properties.top)

        posX = e.pageX - shiftX
        posY = e.pageY - shiftY

        setPos(prev => ({
            ...prev,
                    ...prev.start,
                        startX: posX,
                        startY: posY - window.scrollY
        }))

        const move = (e: MouseEvent): void => {
            e.preventDefault()
            if(panning) return
            posX = e.pageX - shiftX
            posY = e.pageY - shiftY
            setPos(prev => ({
                ...prev,
                    x: posX,
                    y: posY - constProps.offsetTop
            }))
        }

        const drop = (): void => {
            panning = false
            window.removeEventListener("mousemove", move)
            window.removeEventListener("mouseup", drop)
        }
        window.addEventListener("mousemove", move)
        window.addEventListener("mouseup", drop)
    }

    const sliderRef = useRef<HTMLInputElement | null>(null)
    const onScroll = (e: React.WheelEvent) => {
        panning = true
        const delta = e.deltaY * -scaleValue
        let newScale = pos.scale! + delta

        if(newScale < minSlide / 100) {
            newScale = minSlide / 100
        }
        if(newScale > maxSlide / 100) {
            newScale = maxSlide / 100
        }

        const ratio = 1 - newScale / pos.scale!
        const newX = pos.x! + (e.clientX - pos.x!) * ratio
        const newY = pos.y! + (e.clientY - pos.y! - containerRef.current!.offsetTop + window.scrollY - (newScale * 100)) * ratio
        setPos(prev => ({
            ...prev,
                scale: newScale,
                x: newX,
                y: newY
        }))
        sliderRef.current!.valueAsNumber = newScale * 100
    }

    const sliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPos(prev => ({
            ...prev,
                scale: e.target.valueAsNumber / 100
        }))
    }

    const stopScroll = (e: WheelEvent) => e.preventDefault()
    useEffect(() => {
        containerRef.current?.addEventListener("wheel", stopScroll, {passive: false})
        return () => containerRef.current?.removeEventListener("wheel", stopScroll)
    }, [])

    return (
        <div className="main-block-container">
            <input type="range" min={minSlide} max={maxSlide}
                ref={sliderRef}
                className="block-slider"
                onChange={sliderChange}
            />
            <div className="block-container">
                <div
                    className="players-block"
                    ref={containerRef}
                    onWheel={onScroll}
                    onMouseDown={drag}
                    style={{transformOrigin: "0 0", transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`}}
                >
                    {getBracketBlocks()?.map((round, index, arr) => {
                        return <PlayersBracket
                            key={index}
                            block={containerRef.current}
                            round={round}
                            isFirst={index === 0 ? true : false}
                            isLast={(index > 0 && index === arr.length - 1) ? true : false}
                            scale={pos.scale}
                        />
                    })}
                </div>
            </div>

        </div>
    )
}