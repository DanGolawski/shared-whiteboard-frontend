import React from 'react';
import Board from '../board/Board'
import ColorPicker from '../color-picker/ColorPicker'
import './style.css'

class Container extends React.Component {

   containerRef;

   constructor(props) {
      super(props);
      this.boardRef = React.createRef();
   }

   addNewPage() {
      this.boardRef.current.addNewPage();
   }

   changeColor(colorIndex) {
      this.boardRef.current.changeColor(colorIndex);
   }

   render() {
      return (
         <div className="container">
            <div className="whiteboard-container">
               <Board ref={this.boardRef}></Board>
            </div>
            <ColorPicker addNewPage={() => this.addNewPage()} changeColor={(colorNumber) => this.changeColor(colorNumber)}></ColorPicker>
         </div>
      )
   }
}

export default Container;