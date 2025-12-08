/**
 * The About page file
 * @author Oren Sokoler
 */

import {getAPIurl} from './Config.js'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container, ProgressBar } from 'react-bootstrap';

import React, { Component } from 'react';

import '../css/About.css'; 

/**
 * The about page, provides general information on the system
 */
class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            version : '',
            processor : '',
            memory : '',
            disk : '',
            kernel : '',
            cpu : 0,
            timer : null
        }
    }

    /**
     * Start the GET status polling
     */
    startTimer() {
        if (this.state.timer === null) {
            this.setState({
                timer : setInterval(() => {this.getInfo()}, 2000)        
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
        this.getInfo()
    }

    componentWillUnmount() {
        this.stopTimer()
    }

    getInfo() {
        fetch(getAPIurl() + "/about")
        .then(response => response.json())
        .then(
          (result) => {
            this.setState({
              version: result.version,
              processor: result.processor,
              memory: result.memory,
              disk: result.disk,
              kernel: result.kernel,
              cpu: result.cpu
            });
          }
        )  
        this.startTimer()      
    }

    render() {
        return (
            <Container className="Page-text">
                <Row className="mt-4 ms-2">
                    <Col>
                        HiFiStreamer version {this.state.version}
                    </Col>
                </Row>
                <Row className="mt-5 ms-2">
                    <Col sm={2}>Processor</Col>
                    <Col>{this.state.processor}</Col>
                </Row>
                <Row className="mt-2 ms-2">
                    <Col sm={2}>Memory</Col>
                    <Col>{this.state.memory}</Col>
                </Row>
                <Row className="mt-2 ms-2">
                    <Col sm={2}>Disk</Col>
                    <Col>{this.state.disk}</Col>
                </Row>
                <Row className="mt-2 ms-2">
                    <Col sm={2}>Kernel</Col>
                    <Col>{this.state.kernel}</Col>
                </Row>
                <Row className="mt-2 ms-2">
                    <Col sm={2} className="d-flex align-items-center">
                        CPU Usage
                    </Col>
                    <Col className="d-flex align-items-center">
                        <div className="progress-center-overlay w-50">
                            <ProgressBar
                                now={this.state.cpu}
                                className="transparent-progress"
                            />
                            <span className="center-label">
                                {this.state.cpu}%
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default About;
