import crypto from 'crypto';

export function generateRandomCode(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}
