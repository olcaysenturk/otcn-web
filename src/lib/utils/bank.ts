import type { Bank } from "@/types/bank";

/**
 * IBAN'dan banka ID'sini çıkartır.
 * IBAN formatı: TRXX YYYY... (XX = banka kodu)
 * 
 * @param iban - IBAN string (ör: "TR320006255349968763132832")
 * @param banks - Tüm bankalar listesi (/v3/banks'den gelen)
 * @returns Banka ID'si veya null (desteklenmeyen banka için)
 */
export function extractBankIdFromIBAN(iban: string, banks: Bank[]): number | null {
    if (!iban.startsWith('TR') || iban.length !== 26) {
        return null;
    }
    const bankCode = iban.substring(4, 9); // TR'den sonraki 4 karakter
    const bank = banks.find(b => b.code === bankCode);

    return bank ? bank.id : null;
}

/**
 * IBAN formatı kontrolü yapar.
 * 
 * @param iban - Kontrol edilecek IBAN
 * @returns ValidationResult objesi
 */
export function validateIBAN(iban: string): {
    isValid: boolean;
    error?: string;
} {
    if (!iban) {
        return { isValid: false, error: "IBAN boş olamaz" };
    }

    if (!iban.startsWith('TR')) {
        return { isValid: false, error: "IBAN 'TR' ile başlamalıdır" };
    }

    if (iban.length !== 26) {
        return { isValid: false, error: "IBAN 26 karakter olmalıdır" };
    }

    // Rakam kontrolü (TR'den sonrası sadece rakam olmalı)
    const ibanWithoutTR = iban.substring(2);
    if (!/^\d{24}$/.test(ibanWithoutTR)) {
        return { isValid: false, error: "IBAN formatı hatalı" };
    }

    return { isValid: true };
}

/**
 * IBAN'ı formatlar (4'lü gruplar halinde boşluklarla)
 * 
 * @param iban - Ham IBAN string
 * @returns Formatlanmış IBAN (büyük harflerle)
 */
export function formatIBAN(iban: string): string {
    let cleaned = iban.replace(/\s/g, '').toUpperCase();

    // Eğer boşsa, boş döndür
    if (!cleaned) return '';
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
}

/**
 * IBAN'dan boşlukları temizler (API'ye göndermek için)
 * 
 * @param iban - Formatlanmış IBAN
 * @returns Temizlenmiş IBAN
 */
export function cleanIBAN(iban: string): string {
    return iban.replace(/\s/g, '');
}