/** Also checks if string is non-empty */
export const isString = (str: unknown): str is string => typeof str === 'string' && str.length !== 0;
