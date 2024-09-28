import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { checkAgainstTargetEntry } from "../calculators/checkAgainstTargetEntry"
import { getSuggestedNumbers } from "../calculators/getSuggestedNumbers"
import { getGenerateTickets } from '../calculators/getGenerateTickets';
import { getNumbers } from '../utils/getNumbers';
import { Col, DropdownButton } from 'react-bootstrap';
import { Dropdown } from 'bootstrap';

const ITEMS_PER_TICKET = {
    "/": 7,
    "/sl": 6,
    "/ol": 7
}

export const TargetEntryStats = ({
    targetEntry,
    dataGroup,
    occuranceFrequencyData,
    frequencyFactorsData,
    entiesRepeatabilityData,
    strictConsecutiveFrequencyData,
    gapFrequencyData,
    consecutiveWeeksCount,
    minItem,
    maxItem,
    useSupplemental
}) => {
    const maxTicketsNumber = getNumbers(50);
    const itemsCount = ITEMS_PER_TICKET[window.location.pathname] || 6;
    const [ticketsNumber, setTicketsNumber] = useState(3);
    const { suggestedItems } = getSuggestedNumbers({
        data: dataGroup,
        occuranceFrequencyData,
        frequencyFactorsData,
        entiesRepeatabilityData,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        consecutiveWeeksCount,
        minItem,
        maxItem,
        useSupplemental
    })
    const suggestedItemsCheckResult = checkAgainstTargetEntry({
        suggestedItems,
        targetEntry,
        useSupplemental
    });
    const generatedTickets = getGenerateTickets({ suggestedItems, targetEntry, frequencyFactorsData, ticketsNumber, itemsCount, useSupplemental });
    let eventKey = 0;

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col xs={4}>
                    <DropdownButton id="tickets-num" title="Select tickets number" >
                        {maxTicketsNumber.map(number => (<Dropdown.Item as="button" key={number} onClick={() => setTicketsNumber(number)}>{number}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>Min is {minItem}</p>
                </Col>
            </Row>
            <Row>
                <Accordion key="target-entry-stats" defaultActiveKey="0">
                    {
                        targetEntry && <Accordion.Item eventKey={`target-stats-${eventKey++}`}>
                            <Accordion.Header>Hits Check - {suggestedItemsCheckResult.length}</Accordion.Header>
                            <Accordion.Body>
                                <TabularData data={suggestedItemsCheckResult} />
                            </Accordion.Body>
                        </Accordion.Item>
                    }
                    <Accordion.Item eventKey={`target-stats-${eventKey++}`}>
                        <Accordion.Header>All suggested Numbers - {suggestedItems.length}</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={suggestedItems} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={`tickets-${eventKey++}`}>
                        <Accordion.Header>Generated tickets</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={generatedTickets} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </React.Fragment>
    )
}