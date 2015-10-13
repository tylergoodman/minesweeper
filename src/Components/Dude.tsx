/// <reference path='../../typings/tsd.d.ts'/>

import * as React from 'react';

interface Props extends React.Props<Dude> {
  face?: Faces;
  onClick?: any;
}

enum Faces {
  'default',
  'default_pressed',
  'pressed',
  'dead',
  'win',
}

export default class Dude extends React.Component<Props, {}> {

  static Faces = Faces;

  static defaultProps: Props = {
    face: Faces.default,
    onClick: () => null,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (<span className={`ms-dude ms-dude-${Faces[this.props.face]}`} onClick={this.props.onClick}></span>);
  }
}
