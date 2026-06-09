

const viewsSort = (arr) => {
   
    let sortedArray = [...arr];
    let n = sortedArray.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            /
            const viewsCurrent = sortedArray[j].views || 0;
            const viewsNext = sortedArray[j + 1].views || 0;

            
            if (viewsCurrent < viewsNext) {
                
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

module.exports = { viewsSort };