/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';

interface Props {
  face?: Faces;
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

  static propTypes: {[index: string]: React.Requireable<any>} = {
    face: React.PropTypes.number,
  }

  static defaultProps: Props = {
    face: Faces.default,
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  render(): JSX.Element {
    return (<span className={`ms-dude ms-dude-${Faces[this.props.face]}`}></span>);
  }
}
