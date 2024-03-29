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
import { QRCodeSVG } from 'qrcode.react';

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
            timer : null,
        }
    }

    /**
     * GET the TIDAL service status
     */
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

    /**
     * Start the GET status polling
     */
    startTimer() {
        if (this.state.timer === null) {
            this.setState({
                timer : setInterval(() => {this.getStatus()},2000)        
            })
        }
    }

    /**
     * Stop the GET status polling
     */
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

    /**
     * Change the TIDAL service status, enable or disable
     */
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
                    <Col sm={3}>
                        TIDAL
                    </Col>
                    <Col>
                        <Form.Check type="switch" 
                                    id="tidal-switch" 
                                    checked={this.state.TIDAL}
                                    disabled={this.state.isDisabled}
                                    onChange={this.onTIDALChange.bind(this)}>
                        </Form.Check>
                    </Col>
                    <Row className="mt-2">
                        <Collapse in={this.state.isOpened}>
                                <div id="collapse-div" style={{width: '18em'}}>
                                    <div style={{display: 'flex', justifyContent: 'center'}}>
                                        <p><QRCodeSVG value={this.state.link}/></p>
                                    </div>
                                    <p>Please scan the QR code with a mobile device or visit this link:<br/>
                                    <u>{'https://' + this.state.link}</u><br/> to login to TIDAL</p>
                                </div>
                        </Collapse>                    
                    </Row>
                </Form.Group>
            </Form>
        );
    }
}

export default Streaming;