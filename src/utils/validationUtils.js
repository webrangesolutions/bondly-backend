export default function validateRequiredFields(fields) {
    const missingFields = [];

    for (const [key, value] of Object.entries(fields)) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            missingFields.push(key);
        }
    }

    if (missingFields.length > 0) {
        return {
            valid: false,
            message: `Missing required fields: ${missingFields.join(', ')}`,
            status: 400 // Bad Request
        };
    }

    return { valid: true };
}
