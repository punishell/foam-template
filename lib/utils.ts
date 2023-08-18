import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function decodeBase64URL(value: string) {
  try {
    // atob is present in all browsers and nodejs >= 16
    // but if it is not it will throw a ReferenceError in which case we can try to use Buffer
    // replace are here to convert the Base64-URL into Base64 which is what atob supports
    // replace with //g regex acts like replaceAll
    // Decoding base64 to UTF8 see https://stackoverflow.com/a/30106551/17622044
    return decodeURIComponent(
      atob(value.replace(/[-]/g, '+').replace(/[_]/g, '/'))
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch (e) {
    if (e instanceof ReferenceError) {
      // running on nodejs < 16
      // Buffer supports Base64-URL transparently
      return Buffer.from(value, 'base64').toString('utf-8');
    } else {
      throw e;
    }
  }
}

// Taken from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export function decodeJWTPayload(token: string) {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('JWT is not valid: not a JWT structure');
  }

  const base64Url = parts[1];
  return JSON.parse(decodeBase64URL(base64Url));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  const names = name.split(' ');
  const firstName = names[0];
  const lastName = names[names.length - 1];

  return firstName.charAt(0) + lastName.charAt(0);
}

export function sentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export const emptyAchievement = [
  { id: "review", title: "Review", total: 60, textColor: "#A05E03", bgColor: "#FFEFD7" },
  { id: "referral", title: "Referral", total: 20, textColor: "#0065D0", bgColor: "#C9F0FF" },
  { id: "five-star", title: "5 Star Job", total: 10, textColor: "#198155", bgColor: "#ECFCE5" },
  { id: "squad", title: "Squad", total: 10, textColor: "#D3180C", bgColor: "#FFE5E5" },
];

export const getAchievementData = (type:string)=> {
  return emptyAchievement.find(emp => emp.id == type);
}

export const colorFromScore = (score: number) => {
  if (score >= 0 && score <= 20) return { circleColor: "linear-gradient(149deg, #FA042F 0%, #FF6A84 100%)", bgColor: "#FFF8F8" };
  if (score >= 21 && score <= 35) return { circleColor: "linear-gradient(171deg, #FFF70A 0%, #EEE600 100%)", bgColor: "#FFFFF0" };
  if (score >= 36 && score <= 50) return { circleColor: "linear-gradient(166deg, #FFB402 0%, #E19E00 100%)", bgColor: "#FFFFF0" };
  if (score >= 51 && score <= 79) return { circleColor: "linear-gradient(162deg, #08A7FC 0%, #71CDFF 100%)", bgColor: "#F2FBFF" };
  return { circleColor: "linear-gradient(145deg, #05BD2F 0%, #0FF143 100%)", bgColor: "#ECFCE5" };
}

export const limitString = (str: string, limit: number = 10) => str.length > limit ? str.slice(0, limit) + "..." : str;