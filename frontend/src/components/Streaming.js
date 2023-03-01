/**
 * The streaming services page
 * @author Oren Sokoler
 */

import {getAPIurl} from './Config.js'

import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import { Button } from 'react-bootstrap';
import {QRCodeSVG} from 'qrcode.react';

import '../css/Input.css';
import '../css/Page.css';

/**
 * The streaming page, handles enabling / disabling of streaming services
 */
class Streaming extends Component {

    constructor(props) {
        super(props);
        this.state = {
            TIDAL : false,
            isDisabled : false,
            isOpened : false,
            link : '',
            timer : null
        }
    }

    getStatus() {
        fetch(getAPIurl() + "/streaming")
        .then(response => response.json())
        .then(
          (result) => {
            if (result.TIDAL.waiting) {
                this.setState({
                    isOpened : true,
                    isDisabled : true
                });
                this.startTimer()
            }
            else {
                this.setState({
                    isOpened : false,
                    isDisabled : false,
                    TIDAL : result.TIDAL.enabled
                });
                this.stopTimer()
            }
          }
        )
    }

    startTimer() {
        if (this.state.timer === null) {
            this.setState({
                timer : setInterval(() => {this.getStatus()},2000)        
            })
        }
    }

    stopTimer() {
        if (this.state.timer !== null) {
            clearInterval(this.state.timer)
            this.setState({
                timer : null
            })   
        }        
    }
    
    componentDidMount() {
        this.getStatus()
    }

    componentWillUnmount() {
        this.stopTimer()
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    onTIDALChange() {
        this.setState({ 
            TIDAL : !this.state.TIDAL,
            isDisabled : true
        })
        const requestOptions = {
            method: 'POST',
        };      
        fetch(getAPIurl() + "/streaming?tidal=" + !this.state.TIDAL, requestOptions)
        .then(response => response.json())
        .then(
          (result) => {
            this.setState({
                link : result.link
            })
            this.getStatus()
          }
        )
    }

    render() {
        return (
            <Form className="Page-text" >
                <Form.Group as={Row} className="mt-4 ms-4">
                    <Col md="auto">
                        <Form.Check type="switch" 
                                    id="tidal-switch" 
                                    label="TIDAL" reverse
                                    checked={this.state.TIDAL}
                                    disabled={this.state.isDisabled}
                                    onChange={this.onTIDALChange.bind(this)}>
                        </Form.Check>
                        <Collapse in={this.state.isOpened}>
                            <div id="collapse-div" style={{width: '15em'}}>
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <p><QRCodeSVG value={this.state.link}/></p>
                                </div>
                                <p>Please scan the QR code with a mobile device or</p>
                                <p>Press <Button variant="primary" size="sm">here</Button> to login to TIDAL</p>
                            </div>
                        </Collapse>
                    </Col>
                </Form.Group>
            </Form>
        );
    }
}

export default Streaming;