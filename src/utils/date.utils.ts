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

export const MS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
export const APPROXIMATE_DAYS_IN_YEAR = 365;

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

export function toIntegerSeconds(ms: number): number;
export function toIntegerSeconds(date: Date): number;
export function toIntegerSeconds(data: number | Date) {
  const ms = data instanceof Date ? data.getTime() : data;

  return Math.floor(ms / MS_IN_SECOND);
}

/**
 * Returns a difference of two dates in seconds
 * @param from a start date as Date object or seconds count
 * @param to an end date as Date object or seconds count
 */
export function calculateTimeDiffInSeconds(from: number | Date, to: number | Date) {
  const fromSeconds = from instanceof Date ? toIntegerSeconds(from.getTime()) : from;
  const toSeconds = to instanceof Date ? toIntegerSeconds(to.getTime()) : to;

  return toSeconds - fromSeconds;
}
