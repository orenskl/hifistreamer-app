import {getAPIurl} from './Config.js'

import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';

import '../css/Page.css'; 

class Audio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items : [],
            isSaveDisabled : true,
            selected : -1
        }
    }

    getDeviceList() {
        fetch(getAPIurl() + "/audio")
        .then(response => response.json())
        .then(
          (result) => {
            const current = result.devices.splice(result.current,result.current+1)
            this.setState({
              items: current.concat(result.devices)
            });
          }
        )
    }
    
    componentDidMount() {
        this.getDeviceList()
    }

    onChangeDevice(event) {
        console.log(event)
        this.setState({ isSaveDisabled : true })
        if (event.target.selectedIndex > 0) {
            this.setState({ isSaveDisabled : false , 
                            selected : this.state.items[event.target.selectedIndex].id})
        }
    }

    onSaveClicked() {
        this.setState({ isSaveDisabled : true })
        const requestOptions = {
            method: 'POST',
        };       
        fetch(getAPIurl() + "/audio?device=" + this.state.selected, requestOptions)
        .then(this.getDeviceList())
    }

    render() {
        return (
            <Form>
                <Form.Group as={Row} className="mt-4 ms-4">
                    <Form.Label className="Page-text" column sm={2}>
                        Output device
                    </Form.Label>
                    <Col sm={4}>
                        <Form.Select type="device" 
                                     placeholder="" 
                                     onChange={this.onChangeDevice.bind(this)}>
                            {
                                this.state.items.map(device => <option key={device.id}>{device.name}</option>)
                            }
                        </Form.Select>
                        <Button className="mt-4" 
                                variant="primary" 
                                disabled={this.state.isSaveDisabled}
                                onClick={this.onSaveClicked.bind(this)}>
                            Save
                        </Button>                   
                    </Col>
                </Form.Group>
            </Form>
        );    
    }
}

export default Audio;