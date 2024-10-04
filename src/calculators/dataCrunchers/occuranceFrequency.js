import { isItem } from "../../utils/isItem";
import {getNumbers} from "../../utils/getNumbers"

export const occuranceFrequency = (data, useSupplemental) => {
  const items = getNumbers()

  const list = [];

  items.map(item => {
    let freq = 0
    
    data.forEach(entry => {
      const entryContent = []
      
      Object.keys(entry).forEach(key => {
        if (isItem(key, useSupplemental)) {
          entryContent.push(entry[key])
        }
      })

      entryContent.forEach(entryItem => {
        if (entryItem === item) {
          freq += 1;
        }
      })
    })

    list.push({
      number: item,
      freq
    });
  })

  // const sortedList = list.sort((l1, l2) => l2.freq - l1.freq)

  // const result = {}

  // sortedList.forEach(sortedListEntry => {
  //   result[sortedListEntry.number] = sortedListEntry.freq
  // })

  return list.sort((l1, l2) => l2.freq - l1.freq)
}
