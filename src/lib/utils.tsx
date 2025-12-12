// utils/gradients.ts

const gradients: Record<number, string> = {
    1: 'linear-gradient(135deg, #1b0b2e, #3a0f5c)', // Dark Purple
    2: 'linear-gradient(135deg, #d97706, #1a3a5c)', // Orange dominant with Blue accent
    3: 'linear-gradient(135deg, #5c4b0b, #d9b90b)', // Dark Yellow
    4: 'linear-gradient(135deg, #0b1e3b, #1a2d5c)', // Dark Blue
    6: 'linear-gradient(135deg, #0fa45f, #28c06b)'  // Slime Green
};

export function getGradient(id: number): string {
    return gradients[id] ?? 'linear-gradient(135deg, #1b0b2e, #3a0f5c)'; // default Dark Purple
}