import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TabularData } from "./tabularData"
import { occuranceFrequency } from '../calculators/occuranceFrequency';
import { getSortedByDate } from "../utils/getSortedByDate";
import { consecutiveFrequency } from '../calculators/consecutiveFrequency';
import { getSuggestedNumbers } from '../calculators/getSuggestedNumbers';
import { checkGapFrequency } from '../calculators/checkGapFrequency';
import { checkEntriesRepeatability } from '../calculators/checkEntriesRepeatability';
import { getDataDates } from '../utils/getDataDates';
import { sortEntriestIntoDataAndControlGroup } from '../utils/sortEntriestIntoDataAndControlGroup';

export function GameTab({ data }) {
    const dataDates = getDataDates(data);
    const [lastEntriesCount, setLastEntriesCount] = useState(1000);
    const [lastEntryDate, setLastEntryDate] = useState(dataDates[0]);
    // Numbers from the last 'consecutiveWeeksCount' entries are examined for consecutive frequency
    const [consecutiveWeeksCount, setConsecutiveWeeksCount] = useState(4);

    if (!data || !data.length) {
        return "No data";
    }

    const {
        targetEntry,
        dataGroup
    } = sortEntriestIntoDataAndControlGroup({
        data,
        lastEntriesCount,
        lastEntryDate,
    })
    const occuranceFrequencyData = occuranceFrequency(dataGroup);
    const strictConsecutiveFrequencyData = consecutiveFrequency(dataGroup, consecutiveWeeksCount);
    const gapFrequencyData = checkGapFrequency(dataGroup, consecutiveWeeksCount);
    const entiesRepeatabilityData = checkEntriesRepeatability(dataGroup, consecutiveWeeksCount);
    const suggestedItems = getSuggestedNumbers({
        data: dataGroup,
        occuranceFrequencyData,
        entiesRepeatabilityData,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        consecutiveWeeksCount
    })
    let eventKey = 0;

    return (
        <Container>
            <Row>
                <Col xs={4}>
                    <DropdownButton id="last-entries-count" title="Effective Entries Count" >
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(1000)}>All</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(60)}>60</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(20)}>20</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(10)}>10</Dropdown.Item>
                    </DropdownButton>
                    <p>Showing stats for the last {lastEntriesCount} entries</p>
                </Col>
                <Col xs={4}>
                    <DropdownButton id="consecutive-weeks-count" title="Consecutive Weeks Count" >
                        <Dropdown.Item as="button" onClick={() => setConsecutiveWeeksCount(6)}>6</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setConsecutiveWeeksCount(4)}>4</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setConsecutiveWeeksCount(3)}>3</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setConsecutiveWeeksCount(2)}>2</Dropdown.Item>
                    </DropdownButton>
                    <p>Suggesed numbers based on {consecutiveWeeksCount} entries</p>
                </Col>
                <Col xs={4}>
                    <DropdownButton id="lase-entry-date" title="Select last data entry" >
                        {dataDates.map(date => (<Dropdown.Item as="button" onClick={() => setLastEntryDate(date)}>{date}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>Data is based on {lastEntriesCount} entries from {lastEntryDate} and older</p>
                </Col>
            </Row>

            <Row>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Suggested Numbers</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={suggestedItems} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Entries Repeatability</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={entiesRepeatabilityData} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Occurance Frequency</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={occuranceFrequencyData} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Strict Consecutive Frequency</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={strictConsecutiveFrequencyData} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Gaps Frequency</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={gapFrequencyData} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Raw data</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={
                                getSortedByDate(dataGroup, false)
                            } />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </Container>
    );
}
