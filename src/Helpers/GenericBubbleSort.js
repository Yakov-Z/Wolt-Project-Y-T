const genericBubbleSort = (arr, subject, sortDescending = true) => {
    let sortedArray = [...arr];
    let n = sortedArray.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            
            const valCurrent = sortedArray[j][subject] || 0;
            const valNext = sortedArray[j + 1][subject] || 0;

            let needSwap = false;

            
            if (sortDescending) {
                
                if (valCurrent < valNext) {
                    needSwap = true;
                }
            } else {
                
                if (valCurrent > valNext) {
                    needSwap = true;
                }
            }

            if (needSwap) {
                let temp = sortedArray[j];
                sortedArray[j] = sortedArray[j + 1];
                sortedArray[j + 1] = temp;
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }

    return sortedArray;
};

module.exports = { genericBubbleSort };