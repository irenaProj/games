import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { TabularData } from "./tabularData";
import { getSortedByDate } from "../utils/getSortedByDate";
import { checkNumbersStateMachine } from "../calculators/dataCrunchers/checkNumbersStateMachine";

export const ItemsStateMachine = ({ settings, dataGroup }) => {
    const { gameItemsCount, useSupplemental } = settings;
    const [itemsStateMachineMap, setItemsStateMachineMap] = useState({});
    const _dataSortedAsc = getSortedByDate(dataGroup, true);
    const [dataSortedAsc, setDataSortedAsc] = useState(_dataSortedAsc);
    const [oldestEntryDate, setOldestEntryDate] = useState(_dataSortedAsc[0].Date);
    const [newestEntryDate, setNewestEntryDate] = useState(_dataSortedAsc[_dataSortedAsc.length - 1].Date);
    const [entriesInStateMachineCount, setEntriesInStateMachineCount] = useState(3);

    const onOldestEntryDateUpdate = ({ target: { value } }) => setOldestEntryDate(value);
    const onNewestEntryDateUpdate = ({ target: { value } }) => setNewestEntryDate(value);
    const onEntriesInStateMachineCountUpdate = ({ target: { value } }) => setEntriesInStateMachineCount(parseInt(value));

    useEffect(() => {
        const dataSortedAscNew = getSortedByDate(dataGroup, true);
        setDataSortedAsc(dataSortedAscNew);
        setOldestEntryDate(dataSortedAscNew[0].Date);
        setNewestEntryDate(dataSortedAscNew[dataSortedAscNew.length - 1].Date);
    }, [dataGroup]);

    const handleSubmit = (event) => {
        // Do not refresh page
        event.preventDefault();

        console.log(`oldestEntryDate=${oldestEntryDate}; newestEntryDate=${newestEntryDate}; entries=${entriesInStateMachineCount}`)
        
        setItemsStateMachineMap(checkNumbersStateMachine({    
            oldestEntryDate,
            newestEntryDate,
            entriesInStateMachineCount,
            dataGroup,
            useSupplemental: useSupplemental,
            gameItemsCount: gameItemsCount
        }));
    }

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm="4">
                                <Form.Group className="xs-4" controlId="oldestEntryDate">
                                    <Form.Label>Oldest entry</Form.Label>
                                    <Form.Select aria-label="Oldest entry" value={oldestEntryDate} onChange={onOldestEntryDateUpdate}>
                                        {dataSortedAsc.map((entry, index) => (<option key={index} value={entry.Date}>{entry.Date}</option>))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Oldest entry to check states: {oldestEntryDate}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm="4">
                                <Form.Group className="xs-4" controlId="newestEntryDate">
                                    <Form.Label>Newest entry</Form.Label>
                                    <Form.Select aria-label="Newest entry" value={newestEntryDate} onChange={onNewestEntryDateUpdate}>
                                        {dataSortedAsc.map((entry, index) => (<option key={index} value={entry.Date}>{entry.Date}</option>))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Newest entry to check states: {newestEntryDate}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm="4">
                                <Form.Group className="xs-4" controlId="entriesInStateMachineCount">
                                    <Form.Label>Number of entries in state machine</Form.Label>
                                    <Form.Select aria-label="Newest entry" value={entriesInStateMachineCount} onChange={onEntriesInStateMachineCountUpdate}>
                                        <option key={2} value="2">2</option>
                                        <option key={3} value="3">3</option>
                                        <option key={4} value="4">4</option>
                                        <option key={5} value="5">5</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Number of entries in state machine {entriesInStateMachineCount}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <TabularData data={itemsStateMachineMap} />
            </Row>
        </React.Fragment>
    );
}
