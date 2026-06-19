/* eslint-disable prefer-const, no-var */
export class decimal {
    minus: boolean = false;
    integer: number = 0;
    decimal: number = 0;
    precision: number = 0;

    static THOUSAND_SEPERATOR = ',';
    static FRACTION_SEPERATOR = '.';

    constructor(minus: boolean = false, integer: number = 0, decimal: number = 0, precision: number = 0) {
        this.minus = minus;
        this.integer = isNaN(integer) ? 0 : integer;
        this.decimal = isNaN(decimal) ? 0 : decimal;
        this.precision = precision;

        if (isNaN(this.precision) || this.precision < 0)
            this.precision = 0;
    }

    format(trim: boolean): string { return D.format(this, trim); }
    str(): string { return D.str(this); }
    abs(): decimal { return D.abs(this); }
    num(precision: number = -1): number { return D.num(this, precision); }
    set(precision: number): decimal { return D.set(this, precision); }
    mul(other: decimal, targetPrecision: number = -1): decimal { return D.mul(this, other, targetPrecision); }
    add(other: decimal, targetPrecision: number = -1): decimal { return D.add(this, other, targetPrecision); }
    sub(other: decimal, targetPrecision: number = -1): decimal { return D.sub(this, other, targetPrecision); }
    div(other: decimal, targetPrecision: number = -1): decimal { return D.div(this, other, targetPrecision); }
    divn(other: number) { return D.div(this, D.from(other)); }
    single(): number { return D.single(this); }
    greater(num: number): boolean { return D.greater(this, num); }
    greateEqual(num: number): boolean { return D.greateEqual(this, num); }
    less(num: number): boolean { return D.less(this, num); }
    lessEqual(num: number): boolean { return D.lessEqual(this, num); }
    equals(num: number): boolean { return D.equals(this, num); }

    dequals(other: decimal): boolean { return D.compare(this, other) == 0; }
    dless(other: decimal): boolean { return D.compare(this, other) < 0; }
    dgreater(other: decimal): boolean { return D.compare(this, other) > 0; }
    isZero(): boolean { return this.integer == 0 && this.decimal == 0; }

}

export class D {
    /** Allowed chars for input */
    static readonly ALLOWED_KEYS: string[] = [',', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    static readonly ALLOWED_CODES: number[] = [9, 16, 17, 35, 36, 37, 38, 39, 40, 45];

    static sumas: decimal;

    /**
     * değeri 0 olan bir decimal üretir.
     */
    static zero(precision: number = 0): decimal {
        return new decimal(false, 0, 0, precision);
    }

    /**
     * decimal değeri formatlar. çıktı 12,234,567.543 şeklindedir.
     */
    static format(value: decimal, trim: boolean): string {
        let ii = isNaN(value.integer) ? 0 : value.integer;
        let istr = ii.toString();
    
        let minusSigned = istr.startsWith('-');
        let start = istr.length;
        for (let i = istr.length - 1; i > (minusSigned ? 1 : 0); i--) {
            let add = (start - i) % 3 == 0;
            if (add)
                istr = istr.substr(0, i) + decimal.THOUSAND_SEPERATOR + istr.substr(i);
        }
    
        let decs = '';
        if ((trim && value.decimal > 0) || (!trim && value.precision > 0)) {
            let dstr = Math.abs(value.decimal).toString();
            if (dstr.length < value.precision)
                dstr = '0'.repeat(value.precision - dstr.length) + dstr;
            else if (dstr.length > value.precision)
                dstr = dstr.substr(0, value.precision);
    
            if (trim) {
                while (dstr.endsWith('0'))
                    dstr = dstr.substr(0, dstr.length - 1);
            }
    
            decs = decimal.FRACTION_SEPERATOR + dstr;
        }
    
        if (decs.length == 0 && istr == '0')
            return '0';
    
        return (value.minus && !minusSigned ? '-' : '') + istr + decs;
    }

    /** decimal değeri string'e çevirir. formatlama yapmaz. çıktı 123.4567 şeklinde olacaktır. */
    static str(value: decimal): string {
        let istr = value.integer.toString();

        let decs = '';
        if (value.decimal > 0) {
            let dstr = value.decimal.toString();
            if (dstr.length < value.precision)
                dstr = '0'.repeat(value.precision - dstr.length) + dstr;
            else if (dstr.length > value.precision)
                dstr = dstr.substr(0, value.precision);

            while (dstr.endsWith('0'))
                dstr = dstr.substr(0, dstr.length - 1);

            decs = decimal.FRACTION_SEPERATOR + dstr;
        }

        return (value.minus ? '-' : '') + istr + decs;
    }

    /**
     * integer veya float değeri decimal'e dönüştürür.
     * targetPrecision değeri girilmezse dönen decimal değeri, girilen parametreyle (value) aynı olur.
     */
    static from(value: number, targetPrecision: number = -1): decimal {
        if (isNaN(value))
            value = 0;

        let vstr = value.toString().replace('-', '');
        let sp: string[];

        if (vstr.indexOf('e') > 0) {
            vstr = this.stringFromFloat(value);
        }

        sp = vstr.split('.');

        let precision = 0;
        let decimals = 0;

        if (sp.length > 1) {
            precision = sp[1].length;
            decimals = parseInt(sp[1]);
            if (isNaN(decimals))
                decimals = 0;

            if (targetPrecision >= 0) {
                if (targetPrecision > precision)
                    decimals *= Math.pow(10, targetPrecision - precision);
                else
                    decimals = parseInt(sp[1].substr(0, targetPrecision));
            }
        }

        let p = targetPrecision < 0 ? precision : targetPrecision;
        return new decimal(value < 0, parseInt(sp[0]), decimals, p);
    }

    /**
     * string değeri decimal'e çevirir.
     * precision belirtilmez ise string'deki precision alınır.
     */
    static parse(value: string, precision: number = -1): decimal {

        if (!value) {
            return D.zero(0);
        }

        let minus = value.startsWith('-');
        let v = value.replace('-', '');

        while (v.indexOf(decimal.THOUSAND_SEPERATOR) >= 0)
            v = v.replace(decimal.THOUSAND_SEPERATOR, '');

        let parse = v.split(decimal.FRACTION_SEPERATOR);

        //no decimals
        if (parse.length == 1)
            return new decimal(minus, parseInt(parse[0]), 0, 0);

        //decimals
        else {
            let ds = parse[1];

            if (precision >= 0) {
                if (ds.length < precision)
                    ds += '0'.repeat(precision - ds.length);
                else if (ds.length > precision)
                    ds = ds.substr(0, precision);
            }

            //auto precision fix for numbers like 1.0989781293021873127921348230342
            if (precision < 0) {
                if (ds.length > 10)
                    ds = ds.substr(0, 10);
            }

            let di = parseInt(ds);
            let int = parseInt(parse[0]);

            return new decimal(minus, int, di, precision >= 0 ? precision : ds.length);
        }
    }

    /**
     * decimal'i ondalıksız int değere dönüştürür. precision'lar da onluk basamaklara çevrilir.
     * örneğin 12.345 sayısı 4 precision ile 123450 sayısına dönüştürülür.
     */
    static num(value: decimal, precision: number = - 1): number {
        if (precision < 0)
            precision = value.precision;

        let pow = Math.pow(10, precision);
        let dec = value.decimal;

        if (value.precision < precision)
            dec *= Math.pow(10, precision - value.precision);
        else if (value.precision > precision) {
            let dpow = Math.pow(10, precision - value.precision);
            dec = Math.floor(dec * dpow);
        }

        let r = (value.integer * pow) + dec;
        if (value.minus && r > 0)
            r *= -1;

        return r;
    }

    /**
     * decimal'in mutlak değerini döndürür.
     */
    static abs(value: decimal): decimal {
        return new decimal(false, value.integer, value.decimal, value.precision);
    }

    /**
     * girilen sayıyı decimal'e dönüştürür.
     * buradaki girilen sayı, num ile dönüştürülmüş, ondalıkları da tamsayı basamaklarında bulunan sayıdır.
     * örneğin 123.0456 sayısı 1230456 şeklinde girilir ve precision da 4 belirtilir.
     */
    private static fromNum(value: number, precision: number): decimal {
        let minus = value < 0;
        let str = Math.abs(value).toString();

        //nn.dddddddd
        if (str.length > precision) {
            let integers = str.substr(0, str.length - precision);
            let decimals = str.substr(str.length - precision);

            let ii = parseInt(integers)
            let di = Math.abs(parseInt(decimals));

            return new decimal(minus, ii, di, precision);
        }

        //0.dddddddd
        else
            return new decimal(minus, 0, value, precision);
    }

    private static stringFromFloat(float: number): string {
        let vs = float.toString();
        let vsi = vs.indexOf('e');
        if (vsi > 0) {
            let prev = vs.substr(0, vsi);
            let sign = vs.charAt(vsi + 1);
            let vcount = Math.abs(parseInt(vs.substr(vsi + 1)));
            let pi = prev.indexOf('.');
            if (pi > 0) {
                let pdecimals = prev.length - pi - 1;
                prev = prev.replace('.', '');

                if (sign == '+')
                    vcount -= pdecimals;
                else
                    vcount += pdecimals;
            }

            if (sign == '+') {
                let next = '0'.repeat(vcount);
                vs = prev + next;
            }
            else {
                let before = '0'.repeat(vcount - prev.length);
                vs = '0.' + before + prev;
            }
        }

        return vs;
    }

    /**
     * decimal'in precision değerinin değiştirerek yeni bir decimal üretir.
     */
    static set(value: decimal, precision: number): decimal {

        if (precision == -1 || value.precision == precision)
            return value;

        if (isNaN(value.integer))
            value.integer = 0;

        if (isNaN(value.decimal))
            value.decimal = 0;

        let integers = value.integer;
        let decimals = value.decimal;

        if (precision == 0)
            decimals = 0;
        else if (value.precision > precision) {
            let ds = decimals.toString();
            let zero_list = '';
            if (value.precision > ds.length) {
                zero_list = '0'.repeat(value.precision - ds.length);
            }

            let dec = (zero_list + ds).substring(0, precision);
            if (dec.length == 0) {
                dec = '0';
            }
            decimals = parseInt(dec);
        }
        else {
            let ds = decimals.toString();
            if (value.precision < precision)
                ds += '0'.repeat(precision - value.precision);

            decimals = parseInt(ds);
        }

        return new decimal(value.minus, integers, decimals, precision);
    }

    /**
     * iki decimal'i çarpar. precision girilirse, sonuç girilen precision'a göre olur
     */
    static mul(first: decimal, second: decimal, precision: number = 10): decimal {
        let valp = first.precision > second.precision ? first.precision : second.precision;
        let n1 = this.num(first, valp);
        let n2 = this.num(second, valp);

        let value = n1 * n2;

        let vs = this.stringFromFloat(value);
        var vsd = valp * 2;
        if (vsd > 20) {
            let diff = vsd - 20;
            vs = vs.substr(0, vs.length - diff);
            vsd = 20;
        }
        let ff = this.fromLargeNum(vs, vsd);
        ff = this.set(ff, precision);

        return ff;
    }

    private static fromLargeNum(value: string, precision: number): decimal {
        if (precision >= value.length) {
            return new decimal(value.startsWith('-'), 0, Math.abs(parseInt(value)), precision);
        }
        else {
            let integers = value.substr(0, value.length - precision);
            let decimals = value.substr(integers.length);
            return new decimal(value.startsWith('-'), Math.abs(parseInt(integers)), parseInt(decimals), precision);
        }
    }

    /**
     * ilk parametreyi ikinci parametreye böler. precision girilirse, sonuç girilen precision'a göre olur
     */
    static div(first: decimal, second: decimal, precision: number = -1): decimal {

        let p = first.precision > second.precision ? first.precision : second.precision;

        let n1 = this.num(first, p);
        let n2 = this.num(second, p);

        let value = n1 / n2;

        if (isNaN(value))
            return this.zero();

        let vs = this.stringFromFloat(value);
        let str = vs.replace('.', decimal.FRACTION_SEPERATOR);

        let ff = this.parse(str);
        if (precision >= 0)
            ff = this.set(ff, precision);

        return ff;
    }

    /**
     * iki decimal'i toplar. precision girilirse, sonuç girilen precision'a göre olur
     */
    static add(first: decimal, second: decimal, precision: number = -1): decimal {

        let p = first.precision > second.precision ? first.precision : second.precision;

        let n1 = this.num(first, p);
        let n2 = this.num(second, p);

        let value = n1 + n2;

        let ff = this.fromNum(value, p);
        if (precision >= 0)
            ff = this.set(ff, precision);

        return ff;
    }

    /**
     * ilk parametreden ikinci parametreyi çıkarır. precision girilirse, sonuç girilen precision'a göre olur
     */
    static sub(first: decimal, second: decimal, precision: number = -1): decimal {
        let p = first.precision > second.precision ? first.precision : second.precision;

        let n1 = this.num(first, p);
        let n2 = this.num(second, p);
        let value = n1 - n2;
        let ff = this.fromNum(value, p);

        if (precision >= 0)
            ff = this.set(ff, precision);

        return ff;
    }

    /**
     * decimal'i en yakın float'a dönüştürür.
     */
    static single(value: decimal): number {
        let decimals = 0.0;
        if (value.precision > 0)
            decimals = value.decimal / Math.pow(10, value.precision);

        let result = value.integer + decimals;
        if (value.minus && result > 0)
            result *= -1;

        return result;
    }

    /**
     * decimal, belirtilen numaradan büyükse true döner.
     */
    static greater(value: decimal, num: number): boolean {
        return this.single(value) > num;
    }

    /**
  * decimal, belirtilen numaradan büyük eşitse true döner.
  */
    static greateEqual(value: decimal, num: number): boolean {
        return this.single(value) >= num;
    }

    /**
     * decimal, belirtilen numaradan küçükse true döner.
     */
    static less(value: decimal, num: number): boolean {
        return this.single(value) < num;
    }

    /**
   * decimal, belirtilen numaradan küçük eşitse true döner.
   */
    static lessEqual(value: decimal, num: number): boolean {
        return this.single(value) <= num;
    }
    /**
     * decimal, belirtilen numaraya eşitse true döner.
     */
    static equals(value: decimal, num: number): boolean {
        let epsilon = 0;

        if (value.precision > 0)
            epsilon = 1.0 / Math.pow(10, value.precision);

        return Math.abs(this.single(value) - num) <= epsilon;
    }

    /**
     * decimal, belirtilen numaradan büyükse true döner.
     */
    static compare(first: decimal, other: decimal): number {

        if (first.minus && !other.minus) {
            return -1;
        }

        if (!first.minus && other.minus) {
            return 1;
        }

        let minus = first.minus && other.minus;

        if (first.integer > other.integer) {
            return minus ? -1 : 1;
        }

        if (first.integer < other.integer) {
            return minus ? 1 : -1;
        }

        if (first.precision == other.precision) {
            if (first.decimal > other.decimal)
                return minus ? -1 : 1;

            if (first.decimal == other.decimal)
                return 0;

            return minus ? 1 : -1;
        }
        else {
            let n1d = first.decimal;
            let n2d = other.decimal;

            if (first.precision > other.precision)
                n2d *= Math.pow(10, first.precision - other.precision)
            else if (other.precision > first.precision)
                n1d *= Math.pow(10, other.precision - first.precision)

            if (n1d > n2d)
                return minus ? -1 : 1;

            if (n1d < n2d)
                return minus ? 1 : -1;

            return 0;
        }

    }

    static min(first: decimal, other: decimal): number {
        if (first.dgreater(other))
            return other.single();

        return first.single();
    }

    static max(first: decimal, other: decimal): number {
        if (other.dgreater(first))
            return other.single();

        return first.single();
    }

    static isNumeric(value: string): boolean {
        for (let i = 0; i < value.length; i++) {
            let ch = value.charAt(i);
            let index = this.ALLOWED_KEYS.findIndex(x => x == ch);
            if (index < 0)
                return false;
        }

        return true;
    }
}
