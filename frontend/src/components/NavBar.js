import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPlayer : true
        }
    }

    handleClickPlayer = () => {
        this.setState({
            isPlayer : true
        })
        this.props.selectHandler(true)
    };

    handleClickSettings = () => {
        this.setState({
            isPlayer : false
        })
        this.props.selectHandler(false)
    };

    render() {
        return (
            <div style={{height: '6vh', background:'grey'}}>
            <ButtonGroup style={{height:'100%'}}>
              <Button onClick={this.handleClickPlayer} 
                      variant="secondary" 
                      active={this.state.isPlayer ? true : false } 
                      style={{borderRadius: 0}}>Player</Button>
              <Button onClick={this.handleClickSettings} 
                      variant="secondary" 
                      active={this.state.isPlayer ? false : true } >System</Button>
            </ButtonGroup>
          </div>
        );
    }
}

export default NavBar;