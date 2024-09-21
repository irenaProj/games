import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { TabularData } from "./tabularData"
import { occuranceFrequency } from '../calculators/occuranceFrequency';
import { getSortedByDate } from "../utils/getSortedByDate";
import { consecutiveFrequency } from '../calculators/consecutiveFrequency';
import { getSuggestedNumbers } from '../calculators/getSuggestedNumbers';

export function GameTab({ data }) {
    const [lastEntriesCount, setLastEntriesCount] = useState(1000);
    // Numbers from the last 'consecutiveWeeksCount' entries are examined for consecutive frequency
    const [consecutiveWeeksCount, setConsecutiveWeeksCount] = useState(5);

    if (!data || !data.length) {
        return "No data";
    }

    const usedData = data.slice(0, lastEntriesCount)
    const occuranceFrequencyData = occuranceFrequency(usedData);
    const strictConsecutiveFrequencyData = consecutiveFrequency(usedData, consecutiveWeeksCount, true);
    const nonStrictConsecutiveFrequencyData = consecutiveFrequency(usedData, consecutiveWeeksCount, false);
    const suggestedItems = getSuggestedNumbers({
        data: usedData,
        occuranceFrequencyData,
        strictConsecutiveFrequencyData,
        nonStrictConsecutiveFrequencyData,
        consecutiveWeeksCount
    })
    let eventKey = 0;

    return (
        <React.Fragment>
            <DropdownButton id="dropdown-basic-button" title="Effective Entries Count" >
                <Dropdown.Item as="button" onClick={() => setLastEntriesCount(1000)}>All</Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => setLastEntriesCount(60)}>60</Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => setLastEntriesCount(20)}>20</Dropdown.Item>
                <Dropdown.Item as="button" onClick={() => setLastEntriesCount(10)}>10</Dropdown.Item>
            </DropdownButton>
            <p>Showing stats for the last {lastEntriesCount} entries</p>

            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey={eventKey++}>
                    <Accordion.Header>Suggested Numbers</Accordion.Header>
                    <Accordion.Body>
                        <TabularData data={suggestedItems} />
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
                    <Accordion.Header>Non-strict Consecutive Frequency</Accordion.Header>
                    <Accordion.Body>
                        <TabularData data={nonStrictConsecutiveFrequencyData} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={eventKey++}>
                    <Accordion.Header>Raw data</Accordion.Header>
                    <Accordion.Body>
                        <TabularData data={
                            getSortedByDate(usedData, false)
                        } />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </React.Fragment>
    );
}
