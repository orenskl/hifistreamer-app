import {getAPIurl} from './Config.js'

import React from 'react';
import '../css/Page.css';

function Player(props) {
    return (
        <div className='Page-container'>
          <iframe title='Mopidy-Iris' 
                  src={getAPIurl() + ':6680/iris/?ui={"initial_setup_complete":true}'}
                  className='Page-content'/>
        </div>
    );
}

export default Player;