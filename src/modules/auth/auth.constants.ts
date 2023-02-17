import { CookieOptions } from 'express';

export const MIN_NAME_LENGTH = 5;
export const MAX_NAME_LENGTH = 256;

export const MIN_PASSWORD_LENGTH = 8;

export const ACCESS_TOKEN_LIFETIME_IN_MS = 30 * 60 * 1000; // 30 minutes
export const REFRESH_TOKEN_LIFETIME_IN_SEC = 2 * 30 * 24 * 60 * 60; // 60 days
export const REFRESH_TOKEN_LIFETIME_IN_MS = REFRESH_TOKEN_LIFETIME_IN_SEC * 1000; // 60 days

export const SALT_ROUNDS = 10;

export const COOKIE_OPTIONS: CookieOptions = { maxAge: REFRESH_TOKEN_LIFETIME_IN_MS, httpOnly: true, sameSite: 'strict' };
