import { useHistory, useLocation } from 'react-router-dom'
import { useState } from 'react'
import InputField from './Form/InputField'
import Combobox from './Form/Combobox'
import RangeSlider from './Form/RangeSlider'
import Slider from './Form/Slider'
import RadioButtonGroup from './Form/RadioButtonGroup'
import LocationField from './Form/LocationField'

const user = {
    signUp: {
        username: '',
        password: '',
        repeatPassword: ''
    },
    about: {
        age: 18,
        gender: '',
        interest: '',
        range: []
    },
    location: {
        address: {
            value: '',
            coordinates: {
                latitude: null,
                longitude: null
            }
        },
        distance: null
    },
    interest: {
        hobbies: '',
        outgoing: '',
        pets: ''
    }
}

/**
 * Checks if the the given object is incomplete based on the
 * global user object
 *
 * @param {Object} object - the object to check against
 * @returns {boolean} true if contains at least one empty
 */
const containsEmptyValue = object => {
    let newObject = Object.assign({}, ...Object.values(object), object.location.address)
    delete newObject.address
    return Object.values(newObject).some(x => x === '' || x.length === 0 || x === null)
}

/**
 * Verifies if a current multi-step form view is eligible for
 * progress, updates memory reference for user object and then
 * renders subsequent view
 *
 * @param {Object} data - the object state to check for form validation
 * @param {History} history - the react router useHistory reference
 */
const verify = async (data, history) => {
    const [key, fields] = Object.entries(data)[0]
    const routeMap = {
        signUp: "about",
        about: "location",
        location: "interest",
        interest: "result"
    }
    if (Object.values(fields).every(val => val)) {
        if (key === "signUp" && fields.password !== fields.repeatPassword) return alert('passwords must match')
        if (key === "about" && fields.age < 18) return alert('must be 18 years old or older')

        user[key] = fields

        if (key !== "interest") history.push(`/${routeMap[key]}`)
        else { // Submit
            if (!containsEmptyValue(user)) {
                try {
                    const post = new Request('/api/users', {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    })
                    const response = await fetch(post)
                    const matches = await response.json()
                    history.push({
                        pathname: `/${routeMap[key]}`,
                        state: {
                            username: user.signUp.username,
                            matches: matches.length > 0 ? matches : []
                        }
                    })
                } catch (err) { console.error(err) }
            } else {
                alert('contains empty properties... start from home')
                history.push('/')
            }
        }
        console.log(user)
    } else alert("all fields must be filled")
}

export const SignUpView = () => {
    const history = useHistory()
    const [data, setData] = useState({
        signUp: {
            username: "",
            password: "",
            repeatPassword: ""
        }
    })

    return (
        <div className="stage-view">
            <h2>create ur account!</h2>
            <span>
                <label>username</label>
                <InputField
                    type="text"
                    name="username"
                    placeholder="user@email.com"
                    setData={setData} />
            </span>
            <span>
                <label>password</label>
                <InputField
                    type="password"
                    name="password"
                    placeholder="insert at least 6 characters"
                    setData={setData} />
            </span>
            <span>
                <label>repeat password</label>
                <InputField
                    type="password"
                    name="repeatPassword"
                    placeholder="repeat your previous password"
                    setData={setData} />
            </span>
            <button onClick={() => verify(data, history)}>continue</button>
        </div>
    )
}

export const AboutView = () => {
    const history = useHistory()
    const [data, setData] = useState({
        about: {
            age: 18,
            gender: "",
            interest: "",
            range: [21, 29]
        }
    })
    const genders = ["man", "woman", "other"].map(x => ({ label: x, value: x }))
    const interests = ["men", "women", "others", "everyone"].map(x => ({ label: x, value: x }))

    return (
        <div className="stage-view">
            <h2>who are you?</h2>
            <span>
                <label>age</label>
                <InputField type="number" name="age" setData={setData} />
            </span>
            <span>
                <label>gender</label>
                <Combobox name="gender" options={genders} setData={setData} />
            </span>
            <span>
                <label>interested in</label>
                <Combobox name="interest" options={interests} setData={setData} />
            </span>
            <span>
                <span>
                    <label>age range</label>
                    <label className="sub-text">
                        from {data.about.range[0]} to {data.about.range[1]}
                    </label>
                </span>
                <RangeSlider name="range" data={data} setData={setData} />
            </span>
            <button onClick={() => verify(data, history)}>continue</button>
        </div>
    )
}

export const LocationView = () => {
    const history = useHistory()
    const [data, setData] = useState({
        location: {
            address: {
                value: "",
                coordinates: {
                    latitude: null,
                    longitude: null
                }
            },
            distance: 30
        }
    })

    return (
        <div className="stage-view">
            <h2>where are you?</h2>
            <span>
                <label>location</label>
                <LocationField name="address" setData={setData} />
            </span>
            <span>
                <span>
                    <label>distance</label>
                    <label className="sub-text">up to {data.location.distance} mi</label>
                </span>
                <Slider name="distance" data={data} setData={setData} />
            </span>
            <button onClick={() => verify(data, history)}>continue</button>
        </div>
    )
}

export const InterestView = () => {
    const history = useHistory()
    const [data, setData] = useState({
        interest: {
            hobbies: "",
            outgoing: "yes",
            pets: ""
        }
    })
    const hobbies = ["kayaking", "walking", "swimming", "knitting", "basketball", "none"].map(x => ({ label: x, value: x }))
    const pets = ["dog", "cat", "fish", "snake", "exotic", "none"].map(x => ({ label: x, value: x }))

    return (
        <div className="stage-view">
            <h2>what are you into?</h2>
            <span>
                <label>hobbies</label>
                <Combobox name="hobbies" options={hobbies} setData={setData} />
            </span>
            <span>
                <label>outgoing</label>
                <RadioButtonGroup name="outgoing" data={data} setData={setData} />
            </span>
            <span>
                <label>pets</label>
                <Combobox name="pets" options={pets} setData={setData} />
            </span>
            <button onClick={() => verify(data, history)}>submit</button>
        </div>
    )
}

export const ResultView = () => {
    const location = useLocation()

    if (location.state) {
        const { username, matches } = location.state
        if (matches.length <= 0) return <h1 id="matches-header">No matches found!</h1>

        return (
            <div>
                <h1 id="matches-header">Matches for {username}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>username</th>
                            <th>address</th>
                            <th>age</th>
                            <th>gender</th>
                            <th>hobbies</th>
                            <th>outgoing</th>
                            <th>pets</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match, id) => (
                            <tr key={id}>
                                <td>{match.username}</td>
                                <td>{match.address}</td>
                                <td>{match.age}</td>
                                <td>{match.gender}</td>
                                <td>{match.hobbies}</td>
                                <td>{match.outgoing}</td>
                                <td>{match.pets}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
    
    return <div>nothing here</div>
}