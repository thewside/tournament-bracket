import './player-container.scss'
interface PropsPlayerContainer {
    player?: string | null | undefined
}
export const PlayerContainer: React.FC<PropsPlayerContainer> = ({player}) => {
    return (
        <div
            className='player-container'
        >
            { player || "-" }
        </div>
    )
}