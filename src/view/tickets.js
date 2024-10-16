import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { generateTickets } from "../calculators/generateTickets";
import { TabularData } from "./tabularData";
import { ITEM_PRIORITY_TYPES } from "../constants";
import { FloatingLabel } from "react-bootstrap";

export const Tickets = ({ selectedSuggestedItems, targetEntry, dataStats, settings, dataGroup }) => {
    const [tickets, setTickets] = useState([]);
    const [repeatedTickets, setRepeatedTickets] = useState([]);
    const [ticketsNumber, setTicketsNumber] = useState(0);
    const [useRelativePriority, setUseRelativePriority] = useState(false);
    const [ticketsStatsMap, setTicketsStatsMap] = useState({});
    const [itemsPerTicketCustom, setItemsPerTicketCustom] = useState(settings.itemsPerTicket);
    const [occurancesPerSelectedSuggestedItem, setOccurancesPerSelectedSuggestedItem] = useState(0);
    const plottedSelectedSuggestedItems = [];

    selectedSuggestedItems.forEach(si => {
        if (si.isPlotted) {
            plottedSelectedSuggestedItems.push(si)
        }
    })

    const [priorityPerSelectedSuggestedItem, setPriorityPerSelectedSuggestedItem] = useState(plottedSelectedSuggestedItems.map(si => ({ ...si, itemPriority: ITEM_PRIORITY_TYPES.NORMAL })));

    useEffect(() => {
        const _plottedSelectedSuggestedItems = [];

        selectedSuggestedItems.forEach(si => {
            if (si.isPlotted) {
                _plottedSelectedSuggestedItems.push(si)
            }
        })

        setPriorityPerSelectedSuggestedItem(_plottedSelectedSuggestedItems.map(si => ({ ...si, itemPriority: ITEM_PRIORITY_TYPES.NORMAL })));
    }, [selectedSuggestedItems]);

    const onTicketsNumberUpdate = ({ target: { value } }) => setTicketsNumber(parseInt(value));
    const onNumbersPerTicketUpdate = ({ target: { value } }) => setItemsPerTicketCustom(parseInt(value));
    const onRelativePriorityUpdate = () => setUseRelativePriority(!useRelativePriority);
    const onOccurancesPerSelectedSuggestedItemUpdate = ({ target: { value } }) => setOccurancesPerSelectedSuggestedItem(parseInt(value));
    const onPriorityPerSelectedSuggestedItemUpdate = (updatedItem) => {
        const updatedList = priorityPerSelectedSuggestedItem.map(selectedSuggestedItem => {
            if (selectedSuggestedItem.number !== updatedItem.number) {
                return selectedSuggestedItem;
            }

            return updatedItem
        });

        setPriorityPerSelectedSuggestedItem(updatedList);
    }

    const handleSubmit = (event) => {
        // Do not refresh page
        event.preventDefault();

        const { tickets, ticketsStatsMap, repeatedTickets } = generateTickets({
            selectedSuggestedItems: plottedSelectedSuggestedItems,
            targetEntry, dataStats, settings,
            dataGroup,
            ticketsSettings: {
                ticketsNumber,
                occurancesPerSelectedSuggestedItem,
                useRelativePriority,
                priorityPerSelectedSuggestedItem,
                itemsPerTicketCustom,
            }
        });

        setTickets(tickets);
        setTicketsStatsMap(ticketsStatsMap);
        setRepeatedTickets(repeatedTickets)
    }

    const renderItemsPriority = (selectedSuggestedItem) => {

        return (
            <Col sm="2">
                <FloatingLabel controlId={`selected-item-priority-${selectedSuggestedItem.number}`} label={`Item ${selectedSuggestedItem.number}`}>
                    <Form.Select value={selectedSuggestedItem.itemPriority} onChange={({ target: { value } }) => onPriorityPerSelectedSuggestedItemUpdate({ ...selectedSuggestedItem, itemPriority: parseFloat(value) })}>
                        {Object.values(ITEM_PRIORITY_TYPES).map((priorityType, index) => (<option key={index} value={priorityType}>{priorityType}</option>))}
                    </Form.Select>
                </FloatingLabel>
            </Col >
        )
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
                        </Row>
                        <Row>
                            <h6 style={{ textAlign: 'left', margin: '1rem 0 1rem 0' }}>Alternative 1: Set priority for selected items</h6>
                            {priorityPerSelectedSuggestedItem.map((selectedSuggestedItem) => renderItemsPriority(selectedSuggestedItem))}
                        </Row>
                        <Row>
                            <h6 style={{ textAlign: 'left', margin: '1rem 0 1rem 0' }}>Alternative 2: Use relative priority between entries</h6>
                            <Col sm="3">
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
                            <Col sm="5">
                                <Form.Group className="xs-3" controlId="occurancesPerSelectedSuggestedItem">
                                    <Form.Label>Number of occurances for each selected suggested item</Form.Label>
                                    <Form.Control type="number" placeholder="Item occurances #" onChange={onOccurancesPerSelectedSuggestedItemUpdate} />
                                </Form.Group>
                            </Col>
                            <Col sm="3">
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
                </Col>
            </Row>
            <Row>
                <TabularData data={Object.keys(ticketsStatsMap).map(key => ({
                    "Number": key,
                    "Number of tickets": ticketsStatsMap[key]
                }))} />
            </Row>
            <Row>
                <p>Repeated tickets: {repeatedTickets.length} </p>
                <TabularData data={repeatedTickets} />
            </Row>
            <Row>
                <TabularData data={tickets} />
            </Row>
        </React.Fragment>
    );
}
