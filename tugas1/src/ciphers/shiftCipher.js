    export function shiftEncrypt(text, shift) {
    return text
        .split("")
        .map((char) => {
        if (/[a-z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
        } else if (/[A-Z]/.test(char)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        }
        return char;
        })
        .join("");
    }

    export function shiftDecrypt(text, shift) {
    return shiftEncrypt(text, -shift);
    }