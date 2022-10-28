import "./App.scss"
import surnamesList from "./surnames.json"
import { useEffect, useRef, useState } from "react"
import { random } from "./utils/random"
import { PlayersBlock } from "./components/players-block/players-block"

interface Player {
    id?: string
    name?: string
    color?: number | null
}

interface Bracket {
    name?: string | null
    players?: Array<Player> | null
    children?: Array<Bracket> | null | undefined
}

interface Main {
    name?: string | null
    children?: Array<Bracket> | null
}

export const App: React.FC = () => {
    const refInputNumberOfPlayers = useRef<HTMLInputElement | null>(null)
    const [round, setRound] = useState<number | null>(null)
    const [prevBracket, setPrevBracket] = useState<Bracket | null>({
        name: null,
        players: [],
        children: []
    })
    const [players, setPlayers] = useState<Array<Player> | null>(null)
    const [bracket, setBracket] = useState<Main>({ // | Bracket
        name: null,
        children: null
    })

    const [value, setValue] = useState<number | null>(null)
    const [marginBlock, setMarginBlock] = useState<number>(0)

    const createPlayer = (): Player => {
        const randomValue: number = random(1, 769)
        const id = `${randomValue}`
        const name: string = surnamesList.surnames[randomValue]
        return {
            id: id,
            name: name,
            color: null
        }
    }

    const generatePlayers = (inputValue?: number | null) => {
        if (!inputValue) inputValue = 8
        if (typeof(inputValue) === "number") {
            if (inputValue <= 1) inputValue = 2
            if (inputValue >= 65) inputValue = 64
        }

        const result: Array<Player> = []
        for (let i = 0; i < inputValue; i++) {
            let player = createPlayer()
            player.color = i

            if(result.indexOf(player) > -1) {
                player = createPlayer()
            } else {
                result.push(player)
            }
        }
        setPlayers([...result])
    }

    const shuffle = (players: Array<object>): Array<Player> => {
        const result: Array<object> = [...players]
        for (let i = result.length - 1; i > 0; i--) {
            const j = random(0, i)
            const t = result[i]
            result[i] = result[j]
            result[j] = t
        }
        return result as Array<Player>
    }

    const mixPlayers = (): void => {
        if(!players) return
        if(round && round > 1) return
        setPlayers(() => [...shuffle(players)])
    }

    const battle = (players: Array<Player> | null | undefined): Array<Player> | null => {
        const result: Array<Player> = []
        if(!players) return null
        for (let i = 0; i < players.length; i++) {
            const pair = [players[i], players[i + 1]]
            if(!pair[1]) {
                result.push(pair[0])
            } else {
                result.push(pair[Math.floor(random(0, 2))])
            }
            if(players.length > 1) {
                i += 1
            }
        }
        return result
    }

    const insertResult = (): void => {
        setBracket(prev => {
            const main: Bracket | null | undefined = prev?.children?.[0]
            let lastRound: Bracket | null | undefined = main
            let prevRound: Bracket | null | undefined = null

            while(typeof(lastRound) === "object") {
                prevRound = lastRound
                lastRound = lastRound?.children?.[0] || null

                setPrevBracket(prev => ({
                    ...prev,
                        name: prevRound?.name || null,
                        players: prevRound?.players || null,
                        children: prevRound?.children || null
                }))

                if (!lastRound) {
                    if (prevRound) {
                        for (const key of Object.keys(prevRound!)) {
                            if (key === "children") {
                                prevRound[key] = [{
                                    name: `round: ${round}`,
                                    players: !round ? battle(players) : battle(prevRound?.players),
                                    children: null
                                }]
                            }
                        }
                        break
                    }
                }
            }
            return prev
        })
    }

    const marginHandler = (num: number): void => {
        setMarginBlock(prev => prev + num)
    }

    useEffect(() => {
        generatePlayers()
    }, [])

    useEffect(() => {
        setBracket(prev => ({
            ...prev,
            name: "Tournament",
            children: [{
                name: "start place",
                players: players ? [...players] : null,
                children: null
            }]
        }))
    }, [players])

    useEffect(() => {
        setRound(prev => prev ? prev + 1 : 1)
    }, [])

    useEffect(() => {
        if(prevBracket?.players && prevBracket.players.length > 2) {
            setRound(prev => prev ? prev + 1 : 1)
        }
    }, [prevBracket])

    useEffect(() => {
        if(round) {
            insertResult()
        }
    }, [round])

    // useEffect(() => {
    //     if(bracket) {
    //         console.log(bracket)
    //     }
    // }, [bracket])

    useEffect(() => {
        setRound(null)
        generatePlayers(refInputNumberOfPlayers!.current!.valueAsNumber)
    }, [value])

    return (
        <div className="main">
            <div>Bracket size:</div>
            <input
                type="number"
                placeholder="Введите количество участников"
                min={2}
                max={64}
                ref={refInputNumberOfPlayers}
                onChange={() => {
                    const value = refInputNumberOfPlayers.current?.valueAsNumber
                    if(value) {
                        setValue(value)
                    }
                    }}
            />
             <button
                onMouseDown={() => {
                    if(round) return
                    setRound(prev => prev ? prev + 1 : 1)
                }}
            >start</button>
            <button
                onMouseDown={() => mixPlayers()}
            >randomize</button>
            <PlayersBlock
                margin={marginBlock}
                setMargin={marginHandler}
                bracket={bracket}
            />
        </div>
    )
}