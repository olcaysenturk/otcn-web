import { toast } from "sonner";

/**
 * Decodes Unicode escape sequences in a string
 * Converts strings like "L\u00FCtfen" to "Lütfen"
 */
function decodeUnicodeEscapes(str: string): string {
    try {
        return str.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    } catch (e) {
        return str;
    }
}

/**
 * Standardizes backend error handling for all forms.
 * Parses data or upstreamBody to find the most relevant error message.
 * @param data The JSON response data from the backend
 * @param t Translation function
 * @param defaultTitle Optional default title if none is found in data.error
 * @param defaultDesc Optional default description if none is found in data.upstreamBody/message
 */
export function handleBackendError(
    data: any,
    t: (key: string) => string,
    defaultTitle?: string,
    defaultDesc?: string
) {
    const title = data?.error || defaultTitle || t("auth.loginPage.errorTitle");
    let description = defaultDesc || t("auth.loginPage.errorDescription");

    if (data?.upstreamBody) {
        try {
            const parsedBody =
                typeof data.upstreamBody === "string"
                    ? JSON.parse(data.upstreamBody)
                    : data.upstreamBody;

            if (parsedBody?.message) {
                description = decodeUnicodeEscapes(parsedBody.message);
            } else if (parsedBody?.errors && Array.isArray(parsedBody.errors) && parsedBody.errors.length > 0) {
                if (parsedBody.errors[0]?.message) {
                    description = decodeUnicodeEscapes(parsedBody.errors[0].message);
                }
            } else if (parsedBody?.title) {
                description = decodeUnicodeEscapes(parsedBody.title);
            } else if (typeof data.upstreamBody === "string") {
                description = decodeUnicodeEscapes(data.upstreamBody);
            }
        } catch (e) {
            if (typeof data.upstreamBody === "string") {
                description = decodeUnicodeEscapes(data.upstreamBody);
            }
        }
    } else if (data?.message) {
        description = decodeUnicodeEscapes(data.message);
    }

    toast.error(title, {
        description: description
    });
}
