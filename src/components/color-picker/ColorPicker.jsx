import React from 'react';

import './style.css';
import { COLORS } from '../../enums-constants/colors';

class ColorPicker extends React.Component {

   constructor(props) {
      super(props);
   }

   changeColor(colorNumber) {
      this.props.changeColor(colorNumber);
   }

   addNewPage() {
      this.props.addNewPage();
   }

   render() {
      return (
         <div className="palette">
            {COLORS.map((color, colorIndex) => <div className={`palette-element`} style={{backgroundColor: color}} onClick={() => this.changeColor(colorIndex)}></div>)}
            <div className='palette-element text-button' onClick={() => this.addNewPage()}></div>
         </div>
      )
   }
}

export default ColorPicker;