export const getSuggestedItemsClusteringByDraw = ({ suggestedItems, itemsClustersData }) => {
    const suggestedHits = suggestedItems.map(si => si.number).sort((s1, s2) => s1 - s2)

    const suggestedItemsClusteringByDraw = suggestedHits.map(siRow => {
        const hit = siRow;
        const itemClustersData = itemsClustersData.find(row => row.Number === hit)
        const columns = {
            Number: hit,
        }

        suggestedHits.forEach(siColumn => {
            columns[siColumn] = siColumn !== siRow ? itemClustersData[siColumn] : 0
        })

        return columns
    })

    return suggestedItemsClusteringByDraw;
}