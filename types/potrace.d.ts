declare module 'potrace' {
  export interface PotraceOptions {
    threshold?: number;
    color?: string;
    background?: string;
    turdSize?: number;
    optTolerance?: number;
    turnPolicy?: string;
    alphamax?: number;
  }

  export const Potrace: {
    TURNPOLICY_MINORITY: string;
    TURNPOLICY_MAJORITY: string;
    TURNPOLICY_LEFT: string;
    TURNPOLICY_RIGHT: string;
  };

  export function trace(
    buffer: Buffer,
    options: PotraceOptions,
    callback: (err: Error | null, svg: string) => void
  ): void;
}