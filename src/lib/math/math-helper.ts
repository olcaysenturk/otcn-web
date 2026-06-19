import { D, decimal } from "./decimal";

export class MathHelper {

    public static getUnitValue(minusPow: number): decimal {
        const str = '0.' + '0000000000000000000000000'.substr(0, minusPow - 1) + '1';
        return D.parse(str);
    }

}