/// <reference path='../typings/tsd.d.ts'/>

import './main.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Perf from 'react-addons-perf';
import Minesweeper from './Components/Minesweeper';

window.Perf = Perf;

export = function MinesweeperFactory(element: Element, x?: number, y?: number, m?: number) {
  ReactDOM.render((<Minesweeper initialWidth={x} initialHeight={y} initialMines={m} />), element);
}
