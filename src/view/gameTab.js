import Accordion from 'react-bootstrap/Accordion';
import {TabularData} from "./tabularData"
import {occuranceFrequency} from '../calculators/occuranceFrequency';
import {getSortedByDate} from "../utils/getSortedByDate";
import {consecutiveFrequency} from '../calculators/consecutiveFrequency';


export function GameTab({data}) {
    if (!data || !data.length) {
        return "No data";
    }

    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Occurance Frequency</Accordion.Header>
                <Accordion.Body>
                    <TabularData data={
                        occuranceFrequency(data)
                    }/>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Consecutive Frequency</Accordion.Header>
                <Accordion.Body>
                    <TabularData data={
                        consecutiveFrequency(data)
                    }/>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Raw data</Accordion.Header>
                <Accordion.Body>
                    <TabularData data={
                        getSortedByDate(data, true)
                    }/>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
