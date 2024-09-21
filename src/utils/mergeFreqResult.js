export const mergeFreqResult = (freqList, consecutiveFreqList) => {
    Object.keys(consecutiveFreqList).forEach(key => {
        if (consecutiveFreqList[key] > 0) {
            if (!freqList[parseInt(key) + 1]) {
                freqList[parseInt(key) + 1] = 0;
            }

            freqList[parseInt(key) + 1] += consecutiveFreqList[key];
        }
    });

    return freqList;
}