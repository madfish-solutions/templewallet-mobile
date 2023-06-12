import { createAction } from '@reduxjs/toolkit';

export const addNewsletterEmailAction = createAction<string>('newsletter/ADD_EMAIL');
