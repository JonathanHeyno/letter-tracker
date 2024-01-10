import { useState } from 'react'
import trackingService from '../services/trackingService'

const TrackingView = () => {
    const [trackingNumber, setTrackingNumber] = useState('')
    const [trackingData, setTrackingData] = useState([])

    const handleTrackingNumberChange = (event) => {
        setTrackingNumber(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        trackingService
            .getTrackingData(trackingNumber).then(response => {
                console.log(response.updates)
                setTrackingData(response.updates)
                console.log(trackingData)
            })
            .catch(error => {
                const message = 'ERROR: Something went wrong.'
                console.log(error)
            })
    }


    return (
        <div>
            MOI
            <form>
                <label htmlFor="trackerId">Tracking code:</label>
                <input type="text" id="trackerId" name="trackerId" value={trackingNumber} onChange={handleTrackingNumberChange}></input>
                <button onClick={handleSubmit}>Check code</button>
            </form>
        </div>
    )
}

export default TrackingView
