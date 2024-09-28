import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { TabularData } from "./tabularData"
import { occuranceFrequency } from '../calculators/occuranceFrequency';
import { getSortedByDate } from "../utils/getSortedByDate";
import { consecutiveFrequency } from '../calculators/consecutiveFrequency';
import { checkGapFrequency } from '../calculators/checkGapFrequency';
import { checkEntriesRepeatability } from '../calculators/checkEntriesRepeatability';
import { getDataDates } from '../utils/getDataDates';
import { sortEntriestIntoDataAndTargetEntry } from '../utils/sortEntriestIntoDataAndTargetEntry';
import { getNumbers } from '../utils/getNumbers';
import { targetEntryStats } from './targetEntryStats';
import { DataStatsTab } from './dataStatsTab';

const GAME_NAME_MAP = {
    "/": "PB",
    "/sl": "SL",
    "/ol": "OL"
}

export function Game({ data }) {
    const dataDates = getDataDates(data);
    const items = getNumbers()
    const [lastEntriesCount, setLastEntriesCount] = useState(data.length);
    const [lastEntryDate, setLastEntryDate] = useState(dataDates[0]);
    // Numbers from the last 'consecutiveWeeksCount' entries are examined for consecutive frequency
    const [consecutiveWeeksCount, setConsecutiveWeeksCount] = useState(4);
    const [minItem, setMinItem] = useState(1);
    const [maxItem, setMaxItem] = useState(35); // Align with PB

    if (!data || !data.length) {
        return "No data";
    }

    const {
        targetEntry,
        dataGroup
    } = sortEntriestIntoDataAndTargetEntry({
        data,
        lastEntriesCount,
        lastEntryDate,
    })
    const occuranceFrequencyData = occuranceFrequency(dataGroup);
    const strictConsecutiveFrequencyData = consecutiveFrequency(dataGroup, consecutiveWeeksCount);
    const gapFrequencyData = checkGapFrequency(dataGroup, consecutiveWeeksCount);
    const entiesRepeatabilityData = checkEntriesRepeatability(dataGroup, consecutiveWeeksCount);
    const gameName = GAME_NAME_MAP[window.location.pathname] || "A new one?";


    return (
        <Container>
            <Row className="justify-content-center spaced-vertically">
                <h2>{gameName}</h2>
            </Row>
            <Row>
                <Col xs={4}>
                    <DropdownButton id="last-entries-count" title="Effective Entries Count" >
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(data.length)}>{data.length}</Dropdown.Item>
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
                    <DropdownButton id="last-entry-date" title="Select last data entry" >
                        {dataDates.map(date => (<Dropdown.Item as="button" key={date} onClick={() => setLastEntryDate(date)}>{date}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>Data is based on {lastEntriesCount} entries from {lastEntryDate} and older</p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={4}>
                    <DropdownButton id="min-item" title="Select lowest suggestion item" >
                        {items.map(item => (<Dropdown.Item as="button" key={item} onClick={() => setMinItem(item)}>{item}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>Min is {minItem}</p>
                </Col>
                <Col xs={4}>
                    <DropdownButton id="max-item" title="Select highest suggestion item" >
                        {items.map(item => (<Dropdown.Item as="button" key={item} onClick={() => setMaxItem(item)}>{item}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>Max is {maxItem}</p>
                </Col>
            </Row>

            <Row>
                <Tabs
                    defaultActiveKey="data-stats-tab"
                    id="game"
                    className="mb-3"
                >
                    <Tab eventKey="data-stats-tab" title="Data stats">
                        <DataStatsTab
                            targetEntry={targetEntry}
                            dataGroup={dataGroup}
                            occuranceFrequencyData={occuranceFrequencyData}
                            entiesRepeatabilityData={entiesRepeatabilityData}
                            strictConsecutiveFrequencyData={strictConsecutiveFrequencyData}
                            gapFrequencyData={gapFrequencyData}
                            consecutiveWeeksCount={consecutiveWeeksCount}
                            minItem={minItem}
                            maxItem={maxItem}
                        />
                    </Tab>
                </Tabs>
            </Row>
        </Container>
    );
}
