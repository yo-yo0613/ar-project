declare module 'mind-ar/dist/mindar-image-three.prod.js' {
  export class MindARThree {
    constructor(options: any);
    renderer: import('three').WebGLRenderer;
    scene: import('three').Scene;
    camera: import('three').PerspectiveCamera;
    start(): Promise<void>;
    stop(): void;
    update(): void;
    addAnchor(imageIndex: number): { group: import('three').Group };
  }
}
