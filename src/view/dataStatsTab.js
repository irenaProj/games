import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { getSortedByDate } from "../utils/getSortedByDate";
import { targetEntryStats } from './targetEntryStats';

export const DataStatsTab = ({
    targetEntry,
    dataGroup,
    occuranceFrequencyData,
    entiesRepeatabilityData,
    strictConsecutiveFrequencyData,
    gapFrequencyData,
    consecutiveWeeksCount,
    minItem,
    maxItem
}) => {
    let eventKey = 0;
    
    return (
        <Container>
            <Row className="justify-content-center spaced-vertically">
                Target entry is: {targetEntry ? JSON.stringify(targetEntry) : "Next entry"}
            </Row>

            <Row>
                {targetEntryStats({
                    targetEntry,
                    dataGroup,
                    occuranceFrequencyData,
                    entiesRepeatabilityData,
                    strictConsecutiveFrequencyData,
                    gapFrequencyData,
                    consecutiveWeeksCount,
                    minItem,
                    maxItem
                })}
            </Row>
            <Row className="justify-content-center spaced-vertically">
                Data stats
            </Row>

            <Row>
                <Accordion defaultActiveKey="0">
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
    )
}