import { useState } from "react"
import Select from 'react-select'
import './styles/Combobox.scss'

const Combobox = ({ name, options, setData }) => {
    const [option, setOption] = useState(null)

    const update = item => {
        const value = item.value
        setOption(item)
        setData(data => {
            const key = Object.keys(data)[0]
            return ({
                ...data, [key]: {
                    ...data[key],
                    [name]: value
                }
            })
        })
    }

    return <Select
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder="select value..."
        defaultValue={option}
        options={options}
        onChange={update} />
}

export default Combobox