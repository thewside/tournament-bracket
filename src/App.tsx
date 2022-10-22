import "./App.scss"
import surnamesList from "./surnames.json"
import { useEffect, useRef, useState } from "react"
import { random } from "./utils/random"
// import {PlayersBlock} from "./components/players-block/players-block"


interface Player {
    id?: string
    name?: string
}

interface Bracket {
    name?: string | null
    players?: Array<object> | null
    children?: Array<object> | null | undefined
}

interface Main {
    name?: string | null
    children?: Array<Bracket> | null
    // playerList?: Array<Player> | null
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
    const [bracket, setBracket] = useState<Main | Bracket>({
        name: null,
        children: null
    })

    const createPlayer = (): Player => {
        const randomValue: number = random(1, 769)
        const id = `${randomValue}`
        const name: string = surnamesList.surnames[randomValue]
        return {
            id: id,
            name: name
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
        setPlayers(()=>[...shuffle(players)])
    }

    const battle = (players: Array<Player> | null | undefined): Array<Player> | null => {
        const result: Array<Player> = []
        if(!players) return null
        for (let i = 0; i < players.length; i++) {
            const pair = [players[i], players[i + 1]]
            if(!pair[1]) {
                result.push(pair[0])
            } else {
                result.push(pair[random(0, 1)])
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
            console.log(prev)
            return prev
        })
    }

    // default 8 players
    useEffect(() => {
        generatePlayers()
    }, [])

    useEffect(() => {
        if (players) {
            setBracket(prev => ({
                ...prev,
                name: "Tournament",
                children: [{
                    name: "start place",
                    players: [...players],
                    children: null
                }]
            }))
        }
    }, [players])

    useEffect(() => {
        console.log(bracket)
        // if (bracket.children) {
        //     setRound(prev => prev ? prev + 1 : 1)
        // }
    }, [bracket])





    // useEffect(() => {
    //     refInputNumberOfPlayers!.current!.valueAsNumber = 8
    //     setPlayers(() => generatePlayers())
    //     setRound(prev => prev ? prev + 1 : 1)
    // }, [])

    // useEffect(() => {
    //     setBracket(prev => ({
    //         ...prev,
    //         name: "Tournament",
    //         children: [{
    //             name: "start place",
    //             players: players ? [...players] : null,
    //             children: null
    //         }]
    //     }))
    // }, [players])

    // useEffect(() => {
    //     if (typeof(round) === "number" && round > 0) {
    //         insertResult()
    //     }
    // }, [round])

    // useEffect(() => {
    //     console.log(bracket)
    // }, [bracket, setBracket])



    return (
        <div>
            <div>Bracket size:</div>
            <input
                type="number"
                placeholder="Введите количество участников"
                min={2}
                max={64}
                ref={refInputNumberOfPlayers}
            />
             {/* <button
                onMouseDown={() => {
                    if(!bracket?.children) return
                    if(prevBracket?.players && prevBracket?.players?.length > 0 && prevBracket?.players?.length < 3) return
                    setRound(prev => typeof(prev) === "number" ? prev + 1 : 1)
                }}
            >next</button> */}
            {/* <button
                onMouseDown={() => {
                    setRound(null)
                    setPlayers(() => [...generatePlayers(refInputNumberOfPlayers!.current!.valueAsNumber)])
                }}
            >accept</button> */}
            <button
                onMouseDown={() => mixPlayers()}
            >randomize</button>
            {/* <PlayersBlock bracket={bracket}/> */}
        </div>
    )
}