/// <reference path='../typings/tsd.d.ts'/>

import 'pixi.js';
import Tile from './tile';

class Minesweeper {
  private _running: boolean = false;

  private _containerElement: HTMLElement;
  private _context: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  private _stage: PIXI.Container;

  constructor(containerElement: HTMLElement) {
    this._containerElement = containerElement;

    this._context = PIXI.autoDetectRenderer(this._containerElement.clientWidth, this._containerElement.clientHeight);
    this._containerElement.appendChild(this._context.view);

    this._stage = new PIXI.Container();

    window.addEventListener('resize', this._resize.bind(this));
  }

  start(): void {
    console.log('started the game !');
    this._addTile();
    window.requestAnimationFrame(this._animate.bind(this));
    this._running = true;
  }

  stop(): void {
    console.log('stopped the game !');
    this._running = false;
  }

  private _addTile(x: number = 0, y: number = 0): void {
    const tile = new Tile();
    this._stage.addChild(tile);
  }

  private _resize(): void {
    this._context.view.width = this._containerElement.clientWidth;
    this._context.view.height = this._containerElement.clientHeight;
  }

  private _animate(): void {
    if (this._running) {
      console.log('animation frame');
      this._context.render(this._stage);
      window.requestAnimationFrame(this._animate.bind(this));
    }
  }
}

export = Minesweeper;
