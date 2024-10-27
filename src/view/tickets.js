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
    const [ticketsNumber, setTicketsNumber] = useState(0);
    const [ticketsStatsMap, setTicketsStatsMap] = useState({});
    const [itemsPerTicketCustom, setItemsPerTicketCustom] = useState(settings.itemsPerTicket);
    const plottedSelectedSuggestedItems = [];

    selectedSuggestedItems.forEach(si => {
        if (si.isPlotted) {
            plottedSelectedSuggestedItems.push(si)
        }
    })

    const [priorityPerSelectedSuggestedItem, setPriorityPerSelectedSuggestedItem] = useState(plottedSelectedSuggestedItems.map(si => ({ ...si, itemPriority: ITEM_PRIORITY_TYPES.NORMAL })));
    const [highestFirstItem, setHighestFirstItem] = useState(plottedSelectedSuggestedItems[0].number);

    useEffect(() => {
        const _plottedSelectedSuggestedItems = [];

        selectedSuggestedItems.forEach(si => {
            if (si.isPlotted) {
                _plottedSelectedSuggestedItems.push(si)
            }
        })

        setPriorityPerSelectedSuggestedItem(_plottedSelectedSuggestedItems.map(si => ({ ...si, itemPriority: ITEM_PRIORITY_TYPES.NORMAL })));
        setHighestFirstItem(_plottedSelectedSuggestedItems[0].number)
    }, [selectedSuggestedItems]);

    const onTicketsNumberUpdate = ({ target: { value } }) => setTicketsNumber(parseInt(value));
    const onNumbersPerTicketUpdate = ({ target: { value } }) => setItemsPerTicketCustom(parseInt(value));
    const oHighestFirstItemUpdate = ({ target: { value } }) => setHighestFirstItem(parseInt(value));
    const onPriorityPerSelectedSuggestedItemUpdate = (updatedItem) => {
        const updatedList = priorityPerSelectedSuggestedItem.map(selectedSuggestedItem => {
            if (selectedSuggestedItem.number !== updatedItem.number) {
                return selectedSuggestedItem;
            }

            return updatedItem
        });

        setPriorityPerSelectedSuggestedItem(updatedList);
    }

    const handleSubmit = async (event) => {
        // Do not refresh page
        event.preventDefault();

        const { tickets, ticketsStatsMap } = await generateTickets({
            targetEntry,
            settings,
            ticketsSettings: {
                ticketsNumber,
                priorityPerSelectedSuggestedItem,
                itemsPerTicketCustom,
                highestFirstItem
            }
        });

        setTickets(tickets);
        setTicketsStatsMap(ticketsStatsMap);
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
                            <Col sm="3">
                                <Form.Group className="xs-3" controlId="highestFirstItem">
                                    <Form.Label>Highest first number</Form.Label>
                                    <Form.Select aria-label="Highest first number" value={highestFirstItem} onChange={oHighestFirstItemUpdate}>
                                        {selectedSuggestedItems.map((itemInfo, index) => (<option key={index} value={itemInfo.number}>{itemInfo.number}</option>))}
                                    </Form.Select>

                                    <Form.Text className="text-muted">
                                        Highest first number on a ticket: {highestFirstItem}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            {priorityPerSelectedSuggestedItem.map((selectedSuggestedItem) => renderItemsPriority(selectedSuggestedItem))}
                        </Row>
                        <Row>
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
                <TabularData data={tickets} />
            </Row>
        </React.Fragment>
    );
}
