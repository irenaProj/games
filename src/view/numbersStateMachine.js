import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { TabularData } from "./tabularData";
import { getSortedByDate } from "../utils/getSortedByDate";
import { checkNumbersStateMachine } from "../calculators/dataCrunchers/checkNumbersStateMachine";

export const NumbersStateMachine = ({ dataGroup, settings }) => {
    const dataSortedAsc = getSortedByDate(dataGroup, true);
    const [oldestEntry, setOldestEntry] = useState(dataSortedAsc[0].Date);
    const [newestEntry, setNewestEntry] = useState(dataSortedAsc[dataSortedAsc.length - 1].Date);
    const [entriesInStateMachine, setEntriesInStateMachine] = useState(2);
    const [statesMachineStatsPerNumberMap, setStatesMachineStatsPerNumberMap] = useState({});

    const onOldestEntryUpdate = ({ target: { value } }) => setOldestEntry(value);
    const onNewestEntryUpdate = ({ target: { value } }) => setNewestEntry(value);

    const onEntriesInStateMachineUpdate = ({ target: { value } }) => setEntriesInStateMachine(parseInt(value));

    const handleSubmit = (event) => {
        // Do not refresh page
        event.preventDefault();

        setStatesMachineStatsPerNumberMap(checkNumbersStateMachine({    
            oldestEntry,
            newestEntry,
            entriesInStateMachine,
            dataGroup,
            useSupplemental: settings.useSupplemental,
            gameItemsCount: settings.gameItemsCount
        }));
    }

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm="4">
                                <Form.Group className="xs-3" controlId="oldestEntry">
                                    <Form.Label>Oldest entry</Form.Label>
                                    <Form.Select onChange={onOldestEntryUpdate} value={oldestEntry}>
                                        {dataSortedAsc.map((entry, index) => (<option key={index} value={entry.Date}>{entry.Date}</option>))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Oldest entry to check states: {oldestEntry}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm="4">
                                <Form.Group className="xs-3" controlId="newestEntry">
                                    <Form.Label>Newest entry</Form.Label>
                                    <Form.Select onChange={onNewestEntryUpdate} value={newestEntry}>
                                        {dataSortedAsc.map((entry, index) => (<option key={index} value={entry.Date}>{entry.Date}</option>))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Oldest entry to check states: {newestEntry}
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col sm="4">
                                <Form.Group className="xs-3" controlId="entriesInStateMachine">
                                    <Form.Label>Entries in state machine</Form.Label>
                                    <Form.Select onChange={onEntriesInStateMachineUpdate}>
                                        <option key={2} value="2">2</option>
                                        <option key={3} value="3">3</option>
                                        <option key={4} value="4">4</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Number of entries in state machine {entriesInStateMachine}
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
                <TabularData data={statesMachineStatsPerNumberMap} />
            </Row>
        </React.Fragment>
    );
}
