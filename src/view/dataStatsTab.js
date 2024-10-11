import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { getSortedByDate } from "../utils/getSortedByDate";
import { ItemsStateMachine } from './itemsStateMachine';

export const DataStatsTab = ({
    dataGroup,
    dataStats: {
        occuranceFrequencyData,
        entiesRepeatabilityData,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        frequencyFactorsData,
        entryItemsFirstDigitsData,
        itemsClustersData,
        coupleAndTrippleSequentialNumbersData
    },
    settings
}) => {
    let eventKey = 0;

    return (
        <Container>
            <Row>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Items states</Accordion.Header>
                        <Accordion.Body>
                            <ItemsStateMachine settings={settings} dataGroup={dataGroup} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Frequency Factor</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={frequencyFactorsData} />
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
                        <Accordion.Header>Clusters analysis</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={itemsClustersData} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>First digits analysis</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={entryItemsFirstDigitsData} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={eventKey++}>
                        <Accordion.Header>Couples and tripples sequential numbers</Accordion.Header>
                        <Accordion.Body>
                            {coupleAndTrippleSequentialNumbersData.trippleSequentialNumbers.length} tripples: {coupleAndTrippleSequentialNumbersData.trippleSequentialNumbers.map((tripple, index) => (<p key={index}>{JSON.stringify(tripple)}</p>))}
                            {coupleAndTrippleSequentialNumbersData.coupleSequentialNumbers.length} couples: {coupleAndTrippleSequentialNumbersData.coupleSequentialNumbers.map((couple, index) => (<p key={index}>{JSON.stringify(couple)}</p>))}
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