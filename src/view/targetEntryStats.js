import React, { useEffect, useState } from 'react';
import _ from "lodash";
import Accordion from 'react-bootstrap/Accordion';
import { Form } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import { TabularData } from "./tabularData"
import { checkAgainstTargetEntry } from "../calculators/checkAgainstTargetEntry"
import { getSuggestedNumbers } from "../calculators/getSuggestedNumbers"
import { getSuggestedItemsClusteringByDraw } from '../calculators/getSuggestedItemsClusteringByDraw';
import { SuggestedItemsHistoryPlot } from './components/suggestedItemsHistoryPlot';
import { SuggestedItemsSelection } from './components/suggestedItemsSelection';
import { Tickets } from './tickets';
import { getSuggestedItemsWithStateMachines } from '../calculators/getSuggestedItemsStateMachines';
import { getNumbers } from '../utils/getNumbers';

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


const toSelectedSuggestedItems = (suggestedItems) => suggestedItems.map(si => ({ ...si, isPlotted: true, isInPool: true })).sort((s1, s2) => s1.number - s2.number);

export const TargetEntryStats = ({
    targetEntry,
    dataGroup,
    dataStats,
    settings
}) => {
    const { entriesInPlots, useSupplemental } = settings;
    const { suggestedItems } = getSuggestedNumbers({
        data: dataGroup,
        dataStats,
        settings
    })
    const suggestedItemsCheckResult = checkAgainstTargetEntry({
        suggestedItems,
        targetEntry,
        useSupplemental: useSupplemental
    });
    const hits = suggestedItemsCheckResult.map(res => res.number).join(", ");

    const [selectedSuggestedItems, setSelectedSuggestedItems] = useState(toSelectedSuggestedItems(suggestedItems));
    const [useAllItems, setUseAllItems] = useState(false);

    useEffect(() => {
        const newSelectedSuggestedItems = suggestedItems.map(si => {
            const existingPlottedSuggestedItem = selectedSuggestedItems.find(i => i.number === si.number);

            return { ...si, isPlotted: existingPlottedSuggestedItem ? existingPlottedSuggestedItem.isPlotted : true, isInPool: true }
        }).sort((s1, s2) => s1.number - s2.number);

        setSelectedSuggestedItems(newSelectedSuggestedItems);
        setUseAllItems(false)
    }, [suggestedItems.length]);


    const markedSuggestedItems = markSuggestedItemsWithHits({ suggestedItems, suggestedItemsCheckResult });
    const sortedByFreq = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Freq Value"] - si2["Freq Value"]);
    const sortedByOccurance = _.cloneDeep(markedSuggestedItems).sort((si1, si2) => si1["Occurance Index"] - si2["Occurance Index"])
    const suggestedItemsClusteringByDraw = getSuggestedItemsClusteringByDraw({ suggestedItems, itemsClustersData: dataStats.itemsClustersData })
    const suggestedItemsWithStateMachines = getSuggestedItemsWithStateMachines({ markedSuggestedItems, dataStats, settings });
    let eventKey = 0;

    return (
        <React.Fragment>
            <Form.Group>
                <Form.Check type={"checkbox"} style={{ width: "150px", display: "inline-block" }}>
                    <Form.Check.Input
                        type={"checkbox"}
                        defaultChecked={useAllItems}
                        onClick={() => {
                            const newUseAllItems = !useAllItems
                            setUseAllItems(newUseAllItems);

                            if (newUseAllItems) {
                                const _selectedSuggestedItems = _.cloneDeep(selectedSuggestedItems);
                                const allItems = getNumbers(settings.maxItem);

                                allItems.forEach(item => {
                                    const existingItem = _selectedSuggestedItems.find(si => si.number === item);

                                    if (!existingItem) {
                                        _selectedSuggestedItems.push({
                                            number: item,
                                            isPlotted: true, isInPool: false
                                        })
                                    }
                                })

                                _selectedSuggestedItems.sort((si1, si2) => si1.number - si2.number);
                                setSelectedSuggestedItems(_selectedSuggestedItems);
                            } else {
                                const _selectedSuggestedItems = [];

                                selectedSuggestedItems.forEach(si => {
                                    if (si.isInPool) {
                                        _selectedSuggestedItems.push({...si})
                                    }
                                })

                                setSelectedSuggestedItems(_selectedSuggestedItems);
                            }
                        }}
                    />
                    <Form.Check.Label>Use all items</Form.Check.Label>
                </Form.Check>
            </Form.Group>
            <SuggestedItemsSelection selectedSuggestedItems={selectedSuggestedItems} setSelectedSuggestedItems={setSelectedSuggestedItems} />
            {SuggestedItemsHistoryPlot({ dataGroup, selectedSuggestedItems, useSupplemental, entriesInPlots })}
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
                        <Accordion.Header>State machines</Accordion.Header>
                        <Accordion.Body>
                            <TabularData data={suggestedItemsWithStateMachines} />
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
                                targetEntry={targetEntry} dataStats={dataStats}
                                useAllItems={useAllItems}
                                settings={settings}
                                dataGroup={dataGroup} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Row>
        </React.Fragment>
    )
}