// utils/gradients.ts
import awash from "../assets/awash.svg";
import telebirr from "../assets/telebirr.svg";
import boa from "../assets/boa.svg";
import cbe from "../assets/cbe.svg";
import dashen from "../assets/dashen.svg";


const gradientColors: Record<number, [string, string]> = {
    1: ['#1b0b2e', '#3a0f5c'], // Dark Purple
    2: ['#d97706', '#1a3a5c'], // Orange dominant with Blue accent
    3: ['#d9b90b', '#5c4b0b'], // Dark Yellow
    4: ['#1a2d5c', '#01050cff'], // Dark Blue
    6: ['#0a7b44', '#215c39ff']
};

const defaultColors: [string, string] = ['#1b0b2e', '#3a0f5c']; // default Dark Purple
const gradientDegree = 135;

export function getGradient(id: number): string {
    const colors = gradientColors[id] ?? defaultColors;
    return `linear-gradient(${gradientDegree}deg, ${colors[0]}, ${colors[1]})`;
}

export function getLogo(id: number): string {
    switch (id) {
        case 1:
            return cbe;
        case 2:
            return awash;
        case 3:
            return boa;
        case 4:
            return dashen;
        case 6:
            return telebirr;
        default:
            return cbe;
    }
}
