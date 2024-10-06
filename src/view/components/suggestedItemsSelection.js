import { Form } from "react-bootstrap";
import _ from "lodash";

export const SuggestedItemsSelection = ({ selectedSuggestedItems, setSelectedSuggestedItems }) => {
    const renderItemsSelection = () => selectedSuggestedItems.map((si, index) => (
        <Form.Check key={index} type={"checkbox"} style={{ width: "70px", display: "inline-block" }}>
            <Form.Check.Input
                type={"checkbox"}
                defaultChecked={true}
                onClick={() => {
                    const _selectedSuggestedItems = _.cloneDeep(selectedSuggestedItems)
                    const item = _selectedSuggestedItems.find(i => i.number === si.number)

                    if (item) {
                        item.isPlotted = !item.isPlotted;

                        setSelectedSuggestedItems(_selectedSuggestedItems)
                    }

                }}
            />
            <Form.Check.Label>{si.number}</Form.Check.Label>
        </Form.Check>
    ));

    return (
        <Form.Group>
            {renderItemsSelection()}
        </Form.Group>
    )
}