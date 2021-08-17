import { useState } from "react"
import './styles/RadioButtonGroup.scss'

const RadioButtonGroup = ({ name, data: { interest: { outgoing } }, setData }) => {
    const [, setOption] = useState(outgoing)

    const update = event => {
        setOption(event.target.name)
        setData(data => {
            const key = Object.keys(data)[0]
            return ({
                ...data, [key]: {
                    ...data[key],
                    [name]: event.target.name
                }
            })
        })
    }

    return (
        <form>
            {['yes', 'no', 'sometimes'].map(
                (radio, id) => (
                    <span className="radio-group" key={id}>
                        <input
                            type="radio"
                            id={radio}
                            name={radio}
                            value={radio}
                            checked={outgoing === radio}
                            onChange={update} />
                        <label htmlFor={radio}>
                            {radio}
                            <span className="radio"></span>
                        </label>
                    </span>
                )
            )}
        </form>
    )
}

export default RadioButtonGroup