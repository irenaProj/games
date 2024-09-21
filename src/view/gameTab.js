
import Accordion from 'react-bootstrap/Accordion';
import {TabularData} from "./tabularData"
import { occuranceFrequency } from '../calculators/occuranceFrequency';


export function GameTab({data}) {
    return (
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Occurance Frequency</Accordion.Header>
          <Accordion.Body>
            <TabularData data={occuranceFrequency(data)}/>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Raw data</Accordion.Header>
          <Accordion.Body>
            <TabularData data={data}/>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
  