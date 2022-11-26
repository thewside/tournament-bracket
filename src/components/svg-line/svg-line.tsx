interface ComponentSvgLineProps {
    classCSS: string
    x1: string
    x2: string
    y1: string
    y2: string
}
export const SvgLine: React.FC<ComponentSvgLineProps> = ({classCSS, x1, x2, y1, y2}) => {
    return (
        <div className={classCSS}>
            <svg>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                style={{
                    stroke: "rgb(255,255,255)",
                    strokeWidth: "30px"
                }}/>
            </svg>
        </div>
    )
}