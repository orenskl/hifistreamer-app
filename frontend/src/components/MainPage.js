import React, { Component } from 'react';

import NavBar from './NavBar';
import Player from './Player';
import System from './System';

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page : 'player'
        }    
        this.switchContent = this.switchContent.bind(this)
    }

    switchContent(isPlayer) {
        if (isPlayer) {
            this.setState({page:'player'})
        }
        else {
            this.setState({page:'system'})
        }
    }
    
    render() {
        if (this.state.page === 'player') {
            return (
                <div>
                    <Player/>
                    <NavBar selectHandler={this.switchContent}/>              
                </div>
            );
        }
        else {
            return (
                <div>
                    <System/>
                    <NavBar selectHandler={this.switchContent}/>              
                </div>
            );
        }
    }
}

export default MainPage;