import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import { getDataDates } from '../utils/getDataDates';
import { sortEntriestIntoDataAndTargetEntry } from '../utils/sortEntriestIntoDataAndTargetEntry';
import { getNumbers } from '../utils/getNumbers';
import { DataStatsTab } from './dataStatsTab';
import { TargetEntryAnalysisTab } from './targetEntryAnalysisTab';
import { LaterEntriesAnalysisTab } from './laterEntriesAnalysisTab';
import { calculateDataStats } from '../calculators/calculateDataStats';
import { GAME_ITEMS, GAME_NAME_MAP, ITEMS_PER_TICKET } from '../constants';

export function Game({ data }) {
    const dataDates = getDataDates(data);
    const items = getNumbers();
    const gameName = GAME_NAME_MAP[window.location.pathname] || "A new one?";
    const gameItemsCount = GAME_ITEMS[gameName] || 35;  // Align with PB 
    const itemsPerTicket = ITEMS_PER_TICKET[gameName] || 6;
    const [lastEntriesCount, setLastEntriesCount] = useState(data.length);
    const [lastEntryDate, setLastEntryDate] = useState(dataDates[0]);
    // Numbers from the last 'consecutiveWeeksCount' entries are examined for consecutive frequency
    const [consecutiveWeeksCount, setConsecutiveWeeksCount] = useState(4);
    const [minItem, setMinItem] = useState(1);
    const [maxItem, setMaxItem] = useState(gameItemsCount);
    const [useSupplemental, setUseSupplemental] = useState(gameName !== "PB");
    const [entriesInStateMachineCount, setEntriesInStateMachineCount] = useState(3);
    const settings = {
        gameName,
        gameItemsCount,
        itemsPerTicket,
        lastEntriesCount,
        lastEntryDate,
        consecutiveWeeksCount,
        minItem,
        maxItem,
        useSupplemental,
        entriesInStateMachineCount
    }

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
    const dataStats = calculateDataStats({
        dataGroup,
        consecutiveWeeksCount,
        settings
    })

    // Tootltips - start
    const renderLastDataEntryTooltip = (props) => (
        <Tooltip id="last-data-entry-tooltip" {...props}>
            When selected date is not the latest actual entry date, then all entries starting with the selected
            one and older are used as database and the entries after the selected one are used for simulation.
        </Tooltip>
    );
    // Tooltips - end

    return (
        <Container>
            <Row className="justify-content-center spaced-vertically">
                <h2>{gameName}</h2>
            </Row>
            <Row>
                <Col xs={4}>
                    <DropdownButton id="last-entries-count" title="Effective Entries Count" >
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(data.length)}>{data.length}</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(500)}>500</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(200)}>200</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setLastEntriesCount(100)}>100</Dropdown.Item>
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
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderLastDataEntryTooltip}
                    >
                        <DropdownButton id="last-entry-date" title="Select last data entry" >
                            {dataDates.map(date => (<Dropdown.Item as="button" key={date} onClick={() => setLastEntryDate(date)}>{date}</Dropdown.Item>))}
                        </DropdownButton>
                    </OverlayTrigger>
                    <p>Data is based on entries from {lastEntryDate} and older</p>

                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={3}>
                    <DropdownButton id="min-item" title="Select lowest suggestion item" >
                        {items.map(item => (<Dropdown.Item as="button" key={item} onClick={() => setMinItem(item)}>{item}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>Min is {minItem}</p>
                </Col>
                <Col xs={3}>
                    <DropdownButton id="max-item" title="Select highest suggestion item" >
                        {items.map(item => (<Dropdown.Item as="button" key={item} onClick={() => setMaxItem(item)}>{item}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>Max is {maxItem}</p>
                </Col>
                <Col xs={2}>
                    <Form>
                        <Form.Check // prettier-ignore
                            checked={useSupplemental}
                            type="switch"
                            id="toggle-suplementary-use"
                            label="Supplementary?"
                            onChange={() => setUseSupplemental(!useSupplemental)}
                        />
                    </Form>
                    <p>Using: {useSupplemental ? "yep" : "nope"}</p>
                </Col>
                <Col xs={3}>
                    <DropdownButton id="entries-in-state-machine-count" title="Number of entries in state machine" >
                        <Dropdown.Item as="button" onClick={() => setEntriesInStateMachineCount(2)}>2</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setEntriesInStateMachineCount(3)}>3</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setEntriesInStateMachineCount(4)}>4</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => setEntriesInStateMachineCount(5)}>5</Dropdown.Item>
                    </DropdownButton>
                    <p>Number of entries in state machine {entriesInStateMachineCount}</p>
                </Col>
            </Row>

            <Row>
                <Tabs
                    defaultActiveKey="data-stats-tab"
                    id="game"
                    className="mb-3"
                >
                    <Tab eventKey="data-stats-tab" title="Data stats">
                        <p>
                            <strong>
                                This tab shows statistics for all game items. Statistics are based on the selections above, e.g.
                                "Effective Entries Count" and "Select last data entry"
                            </strong>
                        </p>
                        <DataStatsTab
                            dataGroup={dataGroup}
                            dataStats={dataStats}
                            settings={settings}
                        />
                    </Tab>
                    <Tab eventKey="target-entry-analysis-tab" title="Next target entry">
                        <p>
                            <strong>
                                This tab shows analysis for the entry that is a week after the date specified in "Select last data entry" selector
                            </strong>
                        </p>
                        <TargetEntryAnalysisTab
                            targetEntry={targetEntry}
                            dataGroup={dataGroup}
                            dataStats={dataStats}
                            settings={settings}
                        />
                    </Tab>
                    <Tab eventKey="later-entries-analysis-tab" title="Later entries analysis">
                        <p>
                            <strong>
                                This tab shows analysis for ALL entries that are after the date specified in "Select last data entry" selector
                            </strong>
                        </p>
                        <LaterEntriesAnalysisTab
                            data={data}
                            settings={settings}
                        />
                    </Tab>
                </Tabs>
            </Row>
        </Container>
    );
}
