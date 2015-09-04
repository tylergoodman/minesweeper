/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';

class DigitalDisplay extends React.Component<DigitalDisplay.Props, {}> {

  static PropTypes: {[index: string]: React.Requireable<any>} = {
    digits: React.PropTypes.number,
    number: React.PropTypes.number,
  }

  static defaultProps: DigitalDisplay.Props = {
    digits: 3,
    number: 0,
  }

  constructor(props) {
    super(props);
  }

  render(): JSX.Element {
    const num = this.props.number.toString(10);
    const digits = [];
    for (let i = 0; i < num.length; i++) {
      digits.push(<span className={`ms-digit ms-digit-${num.charAt(i)}`}></span>);
    }

    return (
      <div className='ms-digital_display'>
        {digits}
      </div>
    );
  }

}

module DigitalDisplay {
  export interface Props {
    digits: number;
    number: number;
  }
}

export default DigitalDisplay;
