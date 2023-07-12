import React from 'react';
import './style.css'
import io from 'socket.io-client';
import { COLORS } from '../../enums-constants/colors';

class Board extends React.Component {

   timeout;
   socket;
   canvas;
   ctx;
   draw = false;
   mouse;
   last_mouse;
   windowHeight;
   sessionId;

   constructor(props) {
      super(props);

      this.mouse = {x: 0, y: 0};
      this.last_mouse = {x: 0, y: 0};
      this.pencilColorIndex = 1;

   }

   componentDidMount() {
      this.connectWithServer();
      this.configureCanvas();
      this.setPencil();
      this.listenServer();
   }

   connectWithServer(sessionId) {
      this.sessionId = +this.getSessionIdFromUrl();
      this.socket = io.connect('http://127.0.0.1:5000'); 
   }

   configureCanvas() {
      this.canvas = document.querySelector('#board');
      this.ctx = this.canvas.getContext('2d');

      let canvas_style = getComputedStyle(this.canvas);
      this.canvas.width = parseInt(canvas_style.getPropertyValue('width'));
      this.canvas.height = parseInt(canvas_style.getPropertyValue('height'));
      this.windowHeight = this.canvas.height;

      this.canvas.addEventListener('mousedown', () => this.draw = true);
      this.canvas.addEventListener('mouseup', () => this.draw = false);
      this.canvas.addEventListener('mousemove', (event) => this.setMousePosition(event));
   }

   setMousePosition(e) {
      this.last_mouse.x = this.mouse.x;
      this.last_mouse.y = this.mouse.y;
      this.mouse.x = e.pageX + this.canvas.offsetLeft;
      this.mouse.y = e.pageY - this.canvas.offsetTop;
      if (this.draw) {
         this.drawOnCanvas(this.pencilColorIndex);
         this.socket.emit('canvas-data', [this.sessionId, this.last_mouse.x, this.last_mouse.y, this.mouse.x, this.mouse.y, this.pencilColorIndex]);
      }
   }

   setPencil() {
      this.ctx.lineWidth = 4;
      this.ctx.lineJoin = 'round';
      this.ctx.lineCap = 'round';
   }

   setPencilColor(colorIdx) {
      this.ctx.strokeStyle = COLORS[colorIdx];
   }

   drawOnCanvas(color) {
      this.setPencilColor(color)      
      this.ctx.beginPath();
      this.ctx.moveTo(this.last_mouse.x, this.last_mouse.y);
      this.ctx.lineTo(this.mouse.x, this.mouse.y);
      this.ctx.closePath();
      this.ctx.stroke();
   }

   listenServer() {
      this.socket.on(this.sessionId, data => {
         if (data && data.length === 6) {
            this.performMirroring(data);
         } else {
            this.addNewPage(false);
         }
      });
   }

   addNewPage(requestedByMe = true) {
      const temp_canvas = document.createElement('canvas');
      const temp_ctx = temp_canvas.getContext('2d');
      temp_canvas.width = this.canvas.width;
      temp_canvas.height = this.canvas.height;
      temp_ctx.fillStyle = '#ffffff';
      temp_ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      temp_ctx.drawImage(this.canvas, 0, 0);
      this.canvas.height = temp_canvas.height + this.windowHeight;
      this.ctx.drawImage(temp_canvas, 0, 0);
      this.setPencil();
      if (requestedByMe) {
         this.socket.emit('canvas-data', []);
      }
   }

   performMirroring(data) {
      this.mouse = {x: data[3], y: data[4]};
      this.last_mouse = {x: data[1], y: data[2]};
      this.drawOnCanvas(data[5]);
   }

   changeColor(colorIndex) {
      this.pencilColorIndex = colorIndex;
   }

   getSessionIdFromUrl() {
      const id = window.location.href.split('/').slice(-1)[0];
      if (!id) {
         alert('Brak ID sesji');
         return;
      }
      return id;
   }

   render() {
      return (
         <canvas className="board" id="board"></canvas>
      )
   }
}

export default Board;