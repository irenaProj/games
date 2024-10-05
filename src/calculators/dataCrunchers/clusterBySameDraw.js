import { getItemsInEntries } from "../../utils/getItemsInEntries";
import { getNumbers } from "../../utils/getNumbers";
import { getSortedByDate } from "../../utils/getSortedByDate";

export const clusterBySameDraw = (data, useSupplemental) => {
    const dataSortedAsc = getSortedByDate(data, true);
    const itemsClustersData = getNumbers().map(row => {
        const columns = getNumbers();
        const rowData = {
            Number: row
        };

        columns.forEach(column => {
            rowData[column] = 0;
        })

        return rowData;
    });

    dataSortedAsc.forEach((entry) => {
        const entryItems = getItemsInEntries([entry], useSupplemental);

        entryItems.forEach(itemRow => {
            entryItems.forEach(itemColumn => {
                if (itemRow !== itemColumn) {
                    itemsClustersData[itemRow - 1][itemColumn] += 1
                }
            })
        })
    })

    return itemsClustersData;
}