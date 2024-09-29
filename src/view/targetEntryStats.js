import React from 'react';
import _ from "lodash";
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { checkAgainstTargetEntry } from "../calculators/checkAgainstTargetEntry"
import { getSuggestedNumbers } from "../calculators/getSuggestedNumbers"
import { getGenerateTickets } from '../calculators/getGenerateTickets';

const ITEMS_PER_TICKET = {
    "/": 7,
    "/sl": 6,
    "/ol": 7
}

const markSuggestedItemsWithHits = ({ suggestedItems, suggestedItemsCheckResult }) => {
    const markedSuggestedItems = []

    suggestedItems.forEach(si => {
        const hit = suggestedItemsCheckResult.find(res => res.number === si.number);

        markedSuggestedItems.push({
            "Hit": hit ? "YES" : null,
            ...si
        })
    })

    return markedSuggestedItems
}

export const TargetEntryStats = ({
    targetEntry,
    dataGroup,
    dataStats,
    settings
}) => {
    const itemsCount = ITEMS_PER_TICKET[window.location.pathname] || 6;
    const { suggestedItems } = getSuggestedNumbers({
        data: dataGroup,
        dataStats,
        settings
    })
    const suggestedItemsCheckResult = checkAgainstTargetEntry({
        suggestedItems,
        targetEntry,
        useSupplemental: settings.useSupplemental
    });
    const hits = suggestedItemsCheckResult.map(res => res.number).join(", ");
    const generatedTickets = getGenerateTickets({
        suggestedItems, targetEntry, frequencyFactorsData: dataStats.frequencyFactorsData,
        ticketsNumber: settings.ticketsNumber, itemsCount, useSupplemental: settings.useSupplemental
    });
    let eventKey = 0;
    const markedSuggestedItems = markSuggestedItemsWithHits({ suggestedItems, suggestedItemsCheckResult });
    const sertedByFreq = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Freq Value"] - si2["Freq Value"]);
    const sortedByOccurance = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Occurance Index"] - si2["Occurance Index"])

    return (
        <React.Fragment>

            <Row>
                <Accordion key="target-entry-stats" defaultActiveKey="0">
                    {
                        targetEntry && <Accordion.Item eventKey={`target-stats-${eventKey++}`}>
                            <Accordion.Header>Hits Check - {suggestedItemsCheckResult.length}-----> {hits}</Accordion.Header>
                            <Accordion.Body>
                                <TabularData data={suggestedItemsCheckResult} />
                            </Accordion.Body>
                        </Accordion.Item>
                    }
                    <Accordion.Item eventKey={`target-stats-${eventKey++}`}>
                        <Accordion.Header>All suggested Numbers - {suggestedItems.length}</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={markedSuggestedItems} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={`target-stats-${eventKey++}`}>
                        <Accordion.Header>Suggested numbers by freq</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={sertedByFreq} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={`target-stats-${eventKey++}`}>
                        <Accordion.Header>Suggested numbers by occurance</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={sortedByOccurance} />
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