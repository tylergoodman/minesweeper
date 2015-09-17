/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';


interface Props {
  digits: number;
  number: number;
}

export default class DigitalDisplay extends React.Component<Props, {}> {

  static PropTypes: {[index: string]: React.Requireable<any>} = {
    digits: React.PropTypes.number,
    number: React.PropTypes.number,
  }

  static defaultProps: Props = {
    digits: 3,
    number: 0,
  }

  constructor(props) {
    super(props);
  }

  render(): JSX.Element {
    let num = this.props.number.toString(10);
    if (num.length > this.props.digits) {
      num = '9'.repeat(this.props.digits);
    }
    else if (num.length < this.props.digits) {
      num = '0'.repeat(this.props.digits - num.length) + num;
    }

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
