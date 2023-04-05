/**
 * The network configuration page
 * @author Oren Sokoler
 */

import {getAPIurl} from './Config.js'

import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';

import {isIP} from 'is-ip';

import '../css/Page.css'; 

/**
 * The networking page, handles configuration of the network devices
 */
class Network extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSaveEnabled : false,
            isDHCP : true,
            IP : '',
            isIPValid : true,
            Netmask : '',
            isNetmaskValid : true,
            Gateway : '',
            isGatewayValid : true,
            DNS : '',
            isDNSValid : true,
            Hostname : '',
            timer : null
        }
    }

    /**
     * GET the network configuration state
     */
    getStatus() {
        fetch(getAPIurl() + "/network")
        .then(response => response.json())
        .then(
          (result) => {
            if (result.enabled) {
                this.stopTimer()
                this.setState({
                    isDHCP : result.method === 'dhcp',
                    IP : result.address,
                    Netmask : result.netmask,
                    Gateway : result.gateway,
                    DNS : result.dns,
                    Hostname : result.name
                })
            }
            else {
                this.startTimer()
                this.setState({
                    IP : '',
                    Netmask : '',
                    Gateway : '',
                    DNS : '',
                    Hostname : result.name
                })
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
                timer : setInterval(() => {this.getStatus()}, 2000)        
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
     * Change the network configuration
     */
    onConfigChange() {
        this.setState( {
            isSaveEnabled : true,
            isDHCP : !this.state.isDHCP
        })
    }

    /**
     * Save button clicker
     */
    onSaveClicked() {
        this.stopTimer()
        this.setState({ isSaveEnabled : false })
        const requestOptions = {
            method: 'POST',
        };   
        var Params = 'method='    
        if (this.state.isDHCP) {
            Params += 'dhcp'
        }
        else {
            Params += 'manual'
            Params += '&address=' + document.getElementById('IP').value
            Params += '&netmask=' + document.getElementById('Netmask').value
            Params += '&gateway=' + document.getElementById('Gateway').value
            Params += '&dns=' + document.getElementById('DNS').value
        }
        Params += '&name=' + document.getElementById('Hostname').value
        fetch(getAPIurl() + "/network?" + Params, requestOptions)
        .then(this.getStatus())
    }

    /**
     * Hostname changed
     */
    onHostnameChange(event) {
        this.setState({ Hostname : event.target.value,
                        isSaveEnabled : true
        })   
    }

    /**
     * IP Address changed
     */
    onIPChange(event) {
        switch (event.target.id) {
            case 'IP':
                if (isIP(event.target.value)) {
                    this.setState({ isIPValid : true,
                                    IP : event.target.value
                    })
                }
                else {
                    this.setState({ isIPValid : false,
                                    IP : event.target.value
                    })
                }
                break;   
            case 'Netmask':
                if (isIP(event.target.value)) {
                    this.setState({ isNetmaskValid : true,
                                    Netmask : event.target.value
                    })
                }
                else {
                    this.setState({ isNetmaskValid : false,
                                    Netmask : event.target.value
                    })
                }
                break;   
            case 'Gateway':
                if (isIP(event.target.value)) {
                    this.setState({ isGatewayValid : true,
                                    Gateway : event.target.value
                    })
                }
                else {
                    this.setState({ isGatewayValid : false,
                                    Gateway : event.target.value
                    })
                }
                break;   
            case 'DNS':
                if (isIP(event.target.value)) {
                    this.setState({ isDNSValid : true,
                                    DNS : event.target.value
                    })
                }
                else {
                    this.setState({ isDNSValid : false,
                                    DNS : event.target.value
                    })
                }
                break;   
            default:
                break;
        }
        if (isIP(document.getElementById('IP').value)      &&
            isIP(document.getElementById('Netmask').value) && 
            isIP(document.getElementById('Gateway').value) && 
            isIP(document.getElementById('DNS').value)) {
            this.setState({ isSaveEnabled : true })            
        }
        else {
            this.setState({ isSaveEnabled : false })            
        }
    }

    render() {
        return (
            <Form className='Page-text'>
                <Col>
                    <Form.Group as={Row} className="mt-4 ms-4">
                        <Col md="auto">
                            Configuration Method
                        </Col>
                        <Col>
                            <Form.Check inline 
                                        label="DHCP" 
                                        type='radio' 
                                        name="formHorizontalRadios"
                                        checked={this.state.isDHCP}
                                        onChange={this.onConfigChange.bind(this)}/>
                            <Form.Check inline 
                                        label="Manual" 
                                        type='radio' 
                                        name="formHorizontalRadios"
                                        checked={!this.state.isDHCP}
                                        onChange={this.onConfigChange.bind(this)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mt-4 ms-4">
                        <Form.Label column sm={2}>
                            IP
                        </Form.Label>
                        <Col md={'auto'}>
                            <Form.Control disabled={this.state.isDHCP}
                                          id="IP"
                                          defaultValue={this.state.IP}
                                          value={this.state.IP}
                                          placeholder='IP Address'
                                          isInvalid={!this.state.isIPValid}
                                          onChange={this.onIPChange.bind(this)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mt-4 ms-4">
                        <Form.Label column sm={2}>
                            Netmask
                        </Form.Label>
                        <Col md={'auto'}>
                            <Form.Control disabled={this.state.isDHCP} 
                                          id="Netmask" 
                                          defaultValue={this.state.Netmask}
                                          value={this.state.Netmask}
                                          placeholder='IP Mask'
                                          isInvalid={!this.state.isNetmaskValid}
                                          onChange={this.onIPChange.bind(this)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mt-4 ms-4">
                        <Form.Label column sm={2}>
                            Gateway
                        </Form.Label>
                        <Col md={'auto'}>
                            <Form.Control disabled={this.state.isDHCP} 
                                          id="Gateway" 
                                          defaultValue={this.state.Gateway}
                                          value={this.state.Gateway}
                                          placeholder='IP Address'
                                          isInvalid={!this.state.isGatewayValid}
                                          onChange={this.onIPChange.bind(this)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mt-4 ms-4">
                        <Form.Label column sm={2}>
                            DNS
                        </Form.Label>
                        <Col md={'auto'}>
                            <Form.Control disabled={this.state.isDHCP} 
                                          id="DNS" 
                                          defaultValue={this.state.DNS}
                                          value={this.state.DNS}
                                          placeholder='IP Address'
                                          isInvalid={!this.state.isDNSValid}
                                          onChange={this.onIPChange.bind(this)} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mt-5 ms-4">
                        <Form.Label column sm={2}>
                            Streamer Name
                        </Form.Label>
                        <Col md={'auto'}>
                            <Form.Control id="Hostname" 
                                          defaultValue={this.state.Hostname}
                                          value={this.state.Hostname}
                                          placeholder='Device name'
                                          onChange={this.onHostnameChange.bind(this)} />
                        </Col>
                    </Form.Group>
                    <Button className="mt-5 ms-4"
                            variant="primary" 
                            disabled={!this.state.isSaveEnabled}
                            onClick={this.onSaveClicked.bind(this)}>
                            Save
                    </Button>                   
                </Col>
            </Form>
        );
    }
}

export default Network;