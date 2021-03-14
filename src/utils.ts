export function snakeCaseToCamelCase(str: string): string {
    const split = str.split('_');
    let x = 0;
    let output: string = '';
    for (const token of split) {
        if (x === 0) {
            output = token.toLowerCase();
        } else {
            output += token.substr(0, 1).toUpperCase() + token.substr(1).toLowerCase();
        }
        x++;
    }
    return output;
}
