import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { generateTickets } from "../calculators/generateTickets";
import { TabularData } from "./tabularData";

export const Tickets = ({ selectedSuggestedItems, targetEntry, dataStats, settings, dataGroup }) => {
    const [tickets, setTickets] = useState([]);
    const [ticketsNumber, setTicketsNumber] = useState(0);
    const [useRelativePriority, setUseRelativePriority] = useState(false);
    const [ticketsStatsMap, setTicketsStatsMap] = useState({});
    const [itemsPerTicketCustom, setItemsPerTicketCustom] = useState(settings.itemsPerTicket);
    const [occurancesPerSelectedSuggestedItem, setOccurancesPerSelectedSuggestedItem] = useState(0);

    const onTicketsNumberUpdate = ({ target: { value } }) => setTicketsNumber(parseInt(value));
    const onNumbersPerTicketUpdate = ({ target: { value } }) => setItemsPerTicketCustom(parseInt(value));
    const onRelativePriorityUpdate = () => setUseRelativePriority(!useRelativePriority);
    const onOccurancesPerSelectedSuggestedItemUpdate = ({ target: { value } }) => setOccurancesPerSelectedSuggestedItem(parseInt(value));

    const handleSubmit = (event) => {
        // Do not refresh page
        event.preventDefault();

        const { tickets, ticketsStatsMap } = generateTickets({
            selectedSuggestedItems, targetEntry, dataStats, settings,
            itemsPerTicketCustom,
            dataGroup,
            ticketsSettings: {
                ticketsNumber,
                occurancesPerSelectedSuggestedItem,
                useRelativePriority,
            }
        });

        setTickets(tickets);
        setTicketsStatsMap(ticketsStatsMap)
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
                                    <Form.Control type="number" placeholder="Tickets #" onChange={onTicketsNumberUpdate} />
                                    <Form.Text className="text-muted">
                                        Total number of generated tickets
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm="5">
                                <Form.Group className="xs-3" controlId="occurancesPerSelectedSuggestedItem">
                                    <Form.Label>Number of occurances for each selected suggested item</Form.Label>
                                    <Form.Control type="number" placeholder="Item occurances #" onChange={onOccurancesPerSelectedSuggestedItemUpdate} />
                                </Form.Group>
                            </Col>
                            <Col sm="4">
                                {/* <Form.Group className="xs-3" controlId="useRelativePriority">
                                    <Form.Label>Use relative priority by week</Form.Label>
                                    <Form.Control type="c" placeholder="Numbers per ticket #" onChange={onRelativePriorityUpdate} />
                                </Form.Group> */}
                                <Form.Group className="xs-3" controlId="useRelativePriority">
                                    <Form.Label>Use relative priority by week</Form.Label>
                                    <Form.Check type={"checkbox"}>
                                        <Form.Check.Input
                                            type={"checkbox"}
                                            value={useRelativePriority}
                                            onClick={onRelativePriorityUpdate}
                                        />
                                    </Form.Check>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="4">
                                <Form.Group className="xs-3" controlId="itemsPerTicketCustom">
                                    <Form.Label>Number of items per ticket</Form.Label>
                                    <Form.Control type="number" placeholder="Numbers per ticket #" onChange={onNumbersPerTicketUpdate} />
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
                <TabularData data={Object.keys(ticketsStatsMap).map(key => ({
                    "Number": key,
                    "Number of tickets": ticketsStatsMap[key]
                }))} />
            </Row>
            <Row>
                <TabularData data={tickets} />
            </Row>
        </React.Fragment>
    );
}
