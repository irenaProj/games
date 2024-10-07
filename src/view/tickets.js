import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { generateTickets } from "../calculators/generateTickets";
import { TabularData } from "./tabularData";

export const Tickets = ({ selectedSuggestedItems, targetEntry, dataStats, settings }) => {
    const [tickets, setTickets] = useState([]);
    const [ticketsNumber, setTicketsNumber] = useState(0);
    const [occurancesPerSelectedSuggestedItem, setOccurancesPerSelectedSuggestedItem] = useState(0);

    const onTicketsNumberUpdate = ({target:{value}}) => setTicketsNumber(parseInt(value));
    const onOccurancesPerSelectedSuggestedItemUpdate = ({target:{value}}) => setOccurancesPerSelectedSuggestedItem(parseInt(value));

    const handleSubmit = (event) => {
        // Do not refresh page
        event.preventDefault();

        const generatedTickets = generateTickets({
            selectedSuggestedItems, targetEntry, dataStats, settings,
            ticketsSettings: {
                ticketsNumber,
                occurancesPerSelectedSuggestedItem
            }
        });

        setTickets(generatedTickets)
    }

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm="3">
                                <Form.Group className="xs-3" controlId="ticketsNumber">
                                    <Form.Label>Number of tickets</Form.Label>
                                    <Form.Control type="number" placeholder="Tickets #"onChange={onTicketsNumberUpdate} />
                                    <Form.Text className="text-muted">
                                        Total number of generated tickets
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm="6">
                                <Form.Group className="xs-3" controlId="occurancesPerSelectedSuggestedItem">
                                    <Form.Label>Number of occurances for each selected suggested item</Form.Label>
                                    <Form.Control type="number" placeholder="Item occurances #" onChange={onOccurancesPerSelectedSuggestedItemUpdate} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                    {/* <p>{ticketsNumber} tickets</p>
                    <p>{occurancesPerSelectedSuggestedItem} repeats per item</p> */}
                </Col>
            </Row>
            <Row>
                <TabularData data={tickets} />
            </Row>
        </React.Fragment>
    );
}
