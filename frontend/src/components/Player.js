import React from 'react';
import '../css/Page.css';

function Player(props) {
    var mopidyIrisURL = 'http://' + window.location.hostname + ':6680/iris' 
    return (
        <div className='Page-container'>
          <iframe title='Mopidy-Iris' 
                  src={mopidyIrisURL}
                  className='Page-content'/>
        </div>
    );
}

export default Player;