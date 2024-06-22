export default class dataTypesUtilities {

    //turns a string filled with numbers and commas into a number array
    convertStringtoIntArray(stringArray: string): number[] {

        let newArray: number[] = [];

        stringArray.split(',').forEach(index => {
            if (index)
                newArray.push(Number(index));
        });

        return newArray;
    }

    //turns an array of numbers into a string so it can be put into an sqlite database
    convertIntArraytoString(intArray: number[]): string {

        let newArray = intArray[0].toString();

        for (let i = 1; i < intArray.length; i++) {
            newArray += "," + intArray[i].toString();
        }

        return newArray;
    }
}