import { useState } from "react"
import { useRangeSlider } from "@strv/react-sliders"
import './styles/RangeSlider.scss'

const RangeSlider = ({ name, data: { about: { range } }, setData }) => {
    const [values, setValues] = useState(range)
    const {
        getRailProps,
        getTrackProps,
        getMinHandleProps,
        getMaxHandleProps
    } = useRangeSlider({
        value: values,
        min: 18,
        max: 60,
        onChange: newRange =>
            update(newRange),
    })

    const update = newRange => {
        setValues(newRange)
        setData(data => {
            const key = Object.keys(data)[0]
            return ({
                ...data, [key]: {
                    ...data[key],
                    [name]: newRange
                }
            })
        })
    }

    return (
        <div className="range-slider-container">
            <span className="range-slider-rail" {...getRailProps()} />
            <span className="range-slider-track" {...getTrackProps()} />
            <span className="range-slider-handle" {...getMinHandleProps()} />
            <span className="range-slider-handle" {...getMaxHandleProps()} />
        </div>
    )
}

export default RangeSlider