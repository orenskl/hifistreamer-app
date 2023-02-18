export function getAPIurl() {
    if (process.env.NODE_ENV === 'production') {
        return "http://" + window.location.hostname
    }
    else {
        return "http://music"
    }        
}

export default getAPIurl
