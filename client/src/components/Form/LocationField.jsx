import usePlacesAutocomplete, {
    getGeocode, getLatLng
} from 'use-places-autocomplete'
import useOnclickOutside from 'react-cool-onclickoutside'
import './styles/LocationField.scss'

const LocationField = ({ name, setData }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({ debounce: 300 })

    const popupRef = useOnclickOutside(() => clearSuggestions())

    const onInput = e => setValue(e.target.value)

    const update = ({ description }) => async () => {
        setValue(description, false)
        clearSuggestions()

        const geoCode = await getGeocode({ address: description })
        const { lat, lng } = await getLatLng(geoCode[0])

        setData(data => {
            const key = Object.keys(data)[0]
            return ({
                ...data, [key]: {
                    ...data[key],
                    [name]: {
                        value: description,
                        coordinates: {
                            latitude: lat,
                            longitude: lng
                        }
                    }
                }
            })
        })
    }

    return (
        <div className="location-field-container" ref={popupRef}>
            <input
                className="location-field-input"
                name={name}
                value={value}
                onChange={onInput}
                disabled={!ready}
                placeholder="search locations..." />
            {
                status === "OK" &&
                <ul className="location-field-menu">
                    {data.map((suggestion, id) =>
                        <li key={id} onClick={update(suggestion)}>
                            {suggestion.description}
                        </li>
                    )}
                </ul>
            }
        </div>
    )
}

export default LocationField