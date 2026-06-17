import { Contact } from 'src/interfaces/contact.interface.ts';

import { DropdownEqualityFn } from '../dropdown/dropdown';

export const contactEqualityFn: DropdownEqualityFn<Contact> = (item, value) =>
  item.name === value?.name && item.address === value?.address;
