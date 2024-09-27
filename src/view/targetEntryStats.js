import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { checkAgainstTargetEntry } from "../calculators/checkAgainstTargetEntry"
import { getSuggestedNumbers } from "../calculators/getSuggestedNumbers"

export const targetEntryStats = ({
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


    const suggestedItems = getSuggestedNumbers({
        data: dataGroup,
        occuranceFrequencyData,
        entiesRepeatabilityData,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        consecutiveWeeksCount,
        minItem,
        maxItem
    })
    const suggestedItemsCheckResult = checkAgainstTargetEntry({
        suggestedItems,
        targetEntry
    });
    let eventKey = 0;

    return (
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

            </Accordion>
        </Row>
    )
}