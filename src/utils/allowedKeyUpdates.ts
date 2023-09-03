export const isValidUserKeys = (keys) => {
    if (keys.length === 0) {
        return false;
    }
    const notAllowedUpdates = [
        "passwordResetToken",
        "status",
        "isAccountVerified",
        "emailVerificationToken"
    ];
    let isValid = true;
    keys.forEach((key) =>{
        if(notAllowedUpdates.includes(key))
        return isValid = false;
    });
    return isValid;
}