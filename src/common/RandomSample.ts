// Function to get a random 'n' sample from an array from 0 to 'ntop'
export default function rangeRandomSample(nTop: number, n: number): number[] {
    // Generating an array from zero to 'ntop'
    const rangeArray: number[] = Array.from(Array(nTop).keys());
    let randItem: number;
    const sampleArray: number[] = [...Array(n)].map(() => {
        // Getting random item from range array.
        randItem = rangeArray[Math.floor(Math.random() * rangeArray.length)];

        // Deleting chosen item to not get the same value.
        rangeArray.splice(rangeArray.indexOf(randItem), 1);
        return randItem;
    })

    return sampleArray;
}