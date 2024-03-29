/**
 * The system main page
 * @author Oren Sokoler
 */

import React from 'react';

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import Audio from './Audio';
import Streaming from './Streaming';
import Network from './Network';
import About from './About';

import '../css/Page.css';
import "../css/NavLink.css"

/**
 * The system tab pane - navigates between the system pages
 */
function System() {
    return (
        <div className='Page-container' style={{background:'#565e64'}}>
            <Tab.Container id="left-tabs" defaultActiveKey="audio">
                <Row>
                    <Col sm={2}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="audio">Audio</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="streaming">Streaming</Nav.Link>
                            </Nav.Item>
{/*                            <Nav.Item>
                                <Nav.Link eventKey="shares">Shares</Nav.Link>
                            </Nav.Item> */}
                            <Nav.Item>
                                <Nav.Link eventKey="network">Network</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="about">About</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="audio">
                                <Audio/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="streaming">
                                <Streaming/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="network">
                                <Network/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="about">
                                <About/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}

export default System;