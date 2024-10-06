import React, { useEffect, useState } from 'react';
import _ from "lodash";
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { checkAgainstTargetEntry } from "../calculators/checkAgainstTargetEntry"
import { getSuggestedNumbers } from "../calculators/getSuggestedNumbers"
import { generateTickets } from '../calculators/generateTickets';
import { ITEMS_PER_TICKET } from '../constants';
import { getSuggestedItemsClusteringByDraw } from '../calculators/getSuggestedItemsClusteringByDraw';
import { SuggestedItemsHistoryPlot } from './suggestedItemsHistoryPlot';
import { Form } from 'react-bootstrap';

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


const toPlottedSuggestedItems = (suggestedItems) => suggestedItems.map(si => ({ ...si, isPlotted: true })).sort((s1, s2) => s1.number - s2.number);

export const TargetEntryStats = ({
    targetEntry,
    dataGroup,
    dataStats,
    settings
}) => {
    const itemsCount = ITEMS_PER_TICKET[window.location.pathname];
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

    const [plottedSuggestedItems, setPlottedSuggestedItems] = useState(toPlottedSuggestedItems(suggestedItems));

    useEffect(() => {
        const newPlottedSuggestedItems = suggestedItems.map(si => {
            const existingPlottedSuggestedItem = plottedSuggestedItems.find(i => i.number === si.number);

             return { ...si, isPlotted: existingPlottedSuggestedItem ? existingPlottedSuggestedItem.isPlotted : true }
        }).sort((s1, s2) => s1.number - s2.number);
        
        setPlottedSuggestedItems(newPlottedSuggestedItems)
      }, [suggestedItems.length]);

      const renderItemsSelection = () => plottedSuggestedItems.map((si, index) => (
        <Form.Check key={index} type={"checkbox"} style={{width: "70px", display: "inline-block"}}>
            <Form.Check.Input
                type={"checkbox"}
                defaultChecked={true}
                onClick={() => {
                    const _plottedSuggestedItems =  _.cloneDeep(plottedSuggestedItems)
                    const item = _plottedSuggestedItems.find(i => i.number === si.number)

                    if (item) {
                        item.isPlotted = !item.isPlotted;

                        setPlottedSuggestedItems(_plottedSuggestedItems)
                    }

                }}
            />
            <Form.Check.Label>{si.number}</Form.Check.Label>
        </Form.Check>
    ));


    const generatedTickets = generateTickets({
        suggestedItems, targetEntry, frequencyFactorsData: dataStats.frequencyFactorsData,
        ticketsNumber: settings.ticketsNumber, itemsCount, useSupplemental: settings.useSupplemental
    });
    let eventKey = 0;
    const markedSuggestedItems = markSuggestedItemsWithHits({ suggestedItems, suggestedItemsCheckResult });
    const sortedByFreq = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Freq Value"] - si2["Freq Value"]);
    const sortedByOccurance = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Occurance Index"] - si2["Occurance Index"])
    const suggestedItemsClusteringByDraw = getSuggestedItemsClusteringByDraw({ suggestedItems, itemsClustersData: dataStats.itemsClustersData })

    return (
        <React.Fragment>
            <Form.Group>
                {renderItemsSelection()}
            </Form.Group>
            {SuggestedItemsHistoryPlot({ dataGroup, plottedSuggestedItems, useSupplemental: settings.useSupplemental, minItem:settings.minItem, maxItem:settings.maxItem })}
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
                        <Accordion.Header>Clusters by draws</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={suggestedItemsClusteringByDraw} />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={`target-stats-${eventKey++}`}>
                        <Accordion.Header>Suggested numbers by freq</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={sortedByFreq} />
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