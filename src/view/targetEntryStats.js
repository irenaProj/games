import React, { useEffect, useState } from 'react';
import _ from "lodash";
import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { checkAgainstTargetEntry } from "../calculators/checkAgainstTargetEntry"
import { getSuggestedNumbers } from "../calculators/getSuggestedNumbers"
import { ITEMS_PER_TICKET } from '../constants';
import { getSuggestedItemsClusteringByDraw } from '../calculators/getSuggestedItemsClusteringByDraw';
import { SuggestedItemsHistoryPlot } from './suggestedItemsHistoryPlot';
import { SuggestedItemsSelection } from './components/suggestedItemsSelection';
import { Tickets } from './tickets';

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


const toSelectedSuggestedItems = (suggestedItems) => suggestedItems.map(si => ({ ...si, isPlotted: true })).sort((s1, s2) => s1.number - s2.number);

export const TargetEntryStats = ({
    targetEntry,
    dataGroup,
    dataStats,
    settings
}) => {
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

    const [selectedSuggestedItems, setSelectedSuggestedItems] = useState(toSelectedSuggestedItems(suggestedItems));

    useEffect(() => {
        const newSelectedSuggestedItems = suggestedItems.map(si => {
            const existingPlottedSuggestedItem = selectedSuggestedItems.find(i => i.number === si.number);

            return { ...si, isPlotted: existingPlottedSuggestedItem ? existingPlottedSuggestedItem.isPlotted : true }
        }).sort((s1, s2) => s1.number - s2.number);

        setSelectedSuggestedItems(newSelectedSuggestedItems)
    }, [suggestedItems.length]);


    const markedSuggestedItems = markSuggestedItemsWithHits({ suggestedItems, suggestedItemsCheckResult });
    const sortedByFreq = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Freq Value"] - si2["Freq Value"]);
    const sortedByOccurance = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Occurance Index"] - si2["Occurance Index"])
    const suggestedItemsClusteringByDraw = getSuggestedItemsClusteringByDraw({ suggestedItems, itemsClustersData: dataStats.itemsClustersData })
    let eventKey = 0;

    return (
        <React.Fragment>
            <SuggestedItemsSelection selectedSuggestedItems={selectedSuggestedItems} setSelectedSuggestedItems={setSelectedSuggestedItems} />
            {SuggestedItemsHistoryPlot({ dataGroup, selectedSuggestedItems, useSupplemental: settings.useSupplemental, minItem: settings.minItem, maxItem: settings.maxItem })}
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
                            <Tickets selectedSuggestedItems={selectedSuggestedItems}
                                targetEntry={targetEntry} dataStats={dataStats} settings={settings} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </React.Fragment>
    )
}