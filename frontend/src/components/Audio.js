/**
 * The Audio page file
 * @author Oren Sokoler
 */

import {getAPIurl} from './Config.js'

import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import Select from 'react-select'

import '../css/Page.css'; 

/**
 * The Audio page, handles setting of the Audio sub-system
 */
class Audio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items : [],
            current : {},
            selected : {},
            isSaveDisabled : true,
        }
    }

    getDeviceList() {
        fetch(getAPIurl() + "/audio")
        .then(response => response.json())
        .then(
          (result) => {
            const options = result.devices.map(device => ({value : device.id, label : device.name}))
            this.setState({
              items: options,
              current: options[result.current],
              selected: options[result.current]
            });
          }
        )
    }

    componentDidUpdate() {
    }
    
    componentDidMount() {
        this.getDeviceList()
    }

    onChangeDevice(option) {
        this.setState({ isSaveDisabled : true,
                        selected : this.state.items[option.value]})
        if (option.value !== this.state.current.value) {
            this.setState({ isSaveDisabled : false })
        }
    }

    onSaveClicked() {
        this.setState({ isSaveDisabled : true })
        const requestOptions = {
            method: 'POST',
        };       
        fetch(getAPIurl() + "/audio?device=" + this.state.selected.value, requestOptions)
        .then(this.getDeviceList())
    }

    render() {
        return (
            <Form>
                <Form.Group as={Row} className="mt-4 ms-4">
                    <Form.Label className="Page-text" column sm={2}>
                        Output device
                    </Form.Label>
                    <Col sm={5}>
                        <Select type="device" 
                                className="basic-single"
                                classNamePrefix="select"
                                isClearable={false}
                                onChange={this.onChangeDevice.bind(this)}
                                value={this.state.selected}
                                options={this.state.items}>
                        </Select>
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