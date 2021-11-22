export const findElement = (selector: string) => browser.$(`~${selector}`);

export const findElements = (selector: string) => browser.$$(`~${selector}`);
