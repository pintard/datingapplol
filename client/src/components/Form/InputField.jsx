import { useState } from 'react'
import './styles/InputField.scss'

const InputField = ({ name, type, setData }) => {
    const [input, setInput] = useState(name === "age" ? 18 : '')

    const update = ({ target: { value } }) => {
        setInput(value)
        setData(data => {
            const key = Object.keys(data)[0]
            return ({
                ...data, [key]: {
                    ...data[key],
                    [name]: !isNaN(+value) ? +value : value
                }
            })
        })
    }

    return <input
        type={type}
        min={18}
        name={name}
        value={input}
        onChange={e => update(e)} />
}

export default InputField