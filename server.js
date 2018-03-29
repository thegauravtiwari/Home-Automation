const express=require('express');
const app=express();
const server=require('http').Server(app);
const socketIo=require('socket.io');
const path=require('path');
const io=socketIo(server);

const five=require('johnny-five');
const board=five.Board();

app.use(express.static(path.join(__dirname,'public_static')));


var living_room_led, photoresistor;

board.on('ready',()=>{
    living_room_led=new five.Led(13);
    living_room_led.off();

    photoresistor=new five.Sensor({
        pin: "A2",
        freq: 250
    });

    photoresistor.on('data',()=>{
        if(this.scaleTo([0,100])<40)
        {
            living_room_led.on();
            io.emit('photoresistor-status',{
                status:'on'
            });
        }else
        {
            living_room_led.off();
            io.emit('photoresistor-status',{
                status:'off'
            });
        }
    })


});

io.on('connection',(socket)=>{

    socket.on('living_room_light',(data)=>{  //living room light on button press from front-end
    living_room_led.toggle();
    });


});

server.listen(3000,()=>{
    console.log(`Server on at http://localhost:3000/`);
});