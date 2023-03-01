/**
 * General configuration functions
 * @author Oren Sokoler
 */

/**
 * Returns the server URL
 */
export function getAPIurl() {
    if (process.env.NODE_ENV === 'production') {
        return "http://" + window.location.hostname
    }
    else { 
        return "http://" + process.env.REACT_APP_API_SERVER
    }        
}

export default getAPIurl
