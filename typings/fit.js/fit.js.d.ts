
interface FitJS {
  (
    target: Element,
    container: Element,
    options?: FitJSOptions,
    callback?: () => void
  ): FitJSTransform;

  watching: () => void[];
  defaults: FitJSOptions;

  cssTransform: () => void;
  cssPosition: () => void;
  cssMargin: () => void;

  CENTER: string;
  BOTTOM: string;
  RIGHT: string;
  LEFT: string;
  TOP: string;
}

declare var fitjs: FitJS;
declare module "fit.js" {
  export = fitjs
}

interface FitJSOptions {
  hAlign?: string;
  vAlign?: string;
  watch?: boolean;
  cover?: boolean;
  apply?: boolean;
}

interface FitJSTransform {
  tx: number;
  ty: number;
  x: number;
  y: number;
  height: number;
  width: number;
  scale: number;

  trigger?: () => void;
  off?: () => void;
  on?: (suppress?) => void;
}
