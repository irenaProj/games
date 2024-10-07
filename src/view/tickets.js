import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { getNumbers } from '../utils/getNumbers';
import { generateTickets } from "../calculators/generateTickets";
import { TabularData } from "./tabularData";

export const Tickets = ({ selectedSuggestedItems, targetEntry, dataStats, settings }) => {
    const maxTicketsNumber = getNumbers(50);
    const [ticketsNumber, setTicketsNumber] = useState(3);
    const {
        gameName,
        gameItemsCount,
        lastEntriesCount,
        lastEntryDate,
        consecutiveWeeksCount,
        minItem,
        maxItem,
        useSupplemental,
    } = settings

    const generatedTickets = generateTickets({
        selectedSuggestedItems, targetEntry, dataStats, settings,
        gameItemsCount
    });

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col xs={4}>
                    <DropdownButton id="tickets-num" title="Select tickets number" >
                        {maxTicketsNumber.map(number => (<Dropdown.Item as="button" key={number} onClick={() => setTicketsNumber(number)}>{number}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>{ticketsNumber} tickets</p>
                </Col>
            </Row>
            <Row>
                <TabularData data={generatedTickets} />
            </Row>
        </React.Fragment>
    );
}
