import {getAPIurl} from './Config.js'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';

import React, { Component } from 'react';

class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            version : '',
            processor : '',
            memory : '',
            disk : '',
            kernel : ''
        }
    }

    componentDidMount() {
        fetch(getAPIurl() + "/about")
        .then(response => response.json())
        .then(
          (result) => {
            this.setState({
              version: result.version,
              processor: result.processor,
              memory: result.memory,
              disk: result.disk,
              kernel: result.kernel
            });
          }
        )        
    }

    render() {
        return (
            <Container className="Page-text">
                <Row className="mt-4 ms-2">
                    <Col sm={4}>
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
            </Container>
        );
    }
}

export default About;
