
export class Utilidad {
    formatValue(value: number): number {
        return parseFloat((value / 100).toFixed(2));
    }
}