import express from "express";
import fs from "fs";
import CsvReadableStream from "csv-reader";


import dgram from 'dgram'





// Right it acc

export const OpenOperationWindow= (request, response) => {


const socket = dgram.createSocket('udp4');


// the data to send
const data = Buffer.from('1111');

// the port and IP address to send to
const port = 5000;
const host = '127.0.0.1';

// send the data
socket.send(data, port, host, (err) => {
  if (err) throw err;
  console.log('UDP message sent');
  // close the socket after sending
  socket.close();
  response.json({ data:"open" });
});


   
  
};


export const CloseOperationWindow= (request, response) => {


    const socket = dgram.createSocket('udp4');


    // the data to send
    const data = Buffer.from('0000');
    
    // the port and IP address to send to
    const port = 5000;
    const host = '127.0.0.1';
    
    // send the data
    socket.send(data, port, host, (err) => {
      if (err) throw err;
      console.log('UDP message sent');
      // close the socket after sending
      socket.close();
      response.json({ data:"close" });
    });
    
    
       
  
};