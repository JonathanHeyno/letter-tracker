import axiosInstance from './axios'

let baseUrl = 'letter_tracker/trackingData/'

const getTrackingData = (trackingId) => {
    const request = axiosInstance.get(baseUrl + trackingId)
    return request.then(response => response.data)
}

const functions = {
    getTrackingData
  }

export default functions
