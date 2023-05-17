/* eslint-disable import/no-duplicates */
import { formatDistanceToNowStrict } from 'date-fns';
import { enGB } from 'date-fns/locale';

type FormatOptions = typeof formatDistanceToNowStrict extends (...args: infer T) => unknown ? T[1] : never;

export const formatTimespan = (timespanMs: number, formatOptionsOverrides?: FormatOptions) => {
  const now = Date.now();

  return formatDistanceToNowStrict(now + timespanMs, {
    locale: enGB,
    ...formatOptionsOverrides
  });
};

export const SECONDS_IN_DAY = 24 * 60 * 60;

export function toSecondsTimestamp(timestampMs: number): number;
export function toSecondsTimestamp(date: Date | string): number;
export function toSecondsTimestamp(date: Date | string | number) {
  return Math.floor(new Date(date).getTime() / 1000);
}

export const isTheSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const isToday = (date: Date) => {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isYesterday = (date: Date) => {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  return isTheSameDay(date, yesterday);
};

export const formatDateOutput = (date: number | string) =>
  new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
