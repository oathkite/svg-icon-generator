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

  export class Potrace {
    static TURNPOLICY_MINORITY: string;
    static TURNPOLICY_MAJORITY: string;
    static TURNPOLICY_LEFT: string;
    static TURNPOLICY_RIGHT: string;
    
    constructor();
    setParameters(options: Partial<PotraceOptions>): void;
    loadImage(buffer: Buffer, callback: (err: Error | null) => void): void;
    getSVG(): string;
  }

  export function trace(
    buffer: Buffer,
    options: PotraceOptions,
    callback: (err: Error | null, svg: string) => void
  ): void;
}