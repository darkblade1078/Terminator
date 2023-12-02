export default class dataTypesUtilities {

    convertStringtoIntArray(stringArray: string): number[] {

        let newArray: number[] = [];

        stringArray.split(',').forEach(index => {
            if (index)
                newArray.push(Number(index));
        });

        return newArray;
    }

    convertIntArraytoString(intArray: number[]): string {

        let newArray = intArray[0].toString();

        for (let i = 1; i < intArray.length; i++) {
            newArray += "," + intArray[i].toString();
        }

        return newArray;
    }
}