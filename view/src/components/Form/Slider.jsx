import { useState } from "react"
import { useSlider } from "@strv/react-sliders"
import './styles/Slider.scss'

const Slider = ({ name, data: { location: { distance } }, setData }) => {
    const [value, setValue] = useState(distance)
    const {
        getRailProps,
        getTrackProps,
        getHandleProps,
    } = useSlider({
        value,
        min: 0,
        max: 300,
        onChange: newDistance =>
            update(newDistance),
    })

    const update = newDistance => {
        setValue(newDistance)
        setData(data => {
            const key = Object.keys(data)[0]
            return ({
                ...data, [key]: {
                    ...data[key],
                    [name]: newDistance
                }
            })
        })
    }

    return (
        <div className="slider-container">
            <span className="slider-rail" {...getRailProps()} />
            <span className="slider-track" {...getTrackProps()} />
            <span className="slider-handle" {...getHandleProps()} />
        </div>
    )
}

export default Slider