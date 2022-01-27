  
// editFunc MUST return a new element and not mutate the old element
export function UpdateListElement(list: any[], index: number, editFunc: any) {
    return [
        ...list.slice(0,index),
        editFunc(list[index]),
        ...list.slice(index+1),
    ]
}

export function FindWithAttr(array: any[], attr: string | number, value: any) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
