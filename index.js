const fs = require('fs');
const server = require('http').createServer();
const io = require('socket.io')(server);

let num=fs.readFileSync('config.txt','utf-8');
console.log(num);
io.on('connection', client => {
    client.emit('num',num);
    for(let i=0;i<num;i++){
        fs.readFile(i+'.txt','utf-8', (err, data) => {
            if (err) throw err;
            client.emit('broadcast',{"file":i,"content":data});
            console.log("first"+data);
        });
    }
    
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});
server.listen(8000);
for(let i=0;i<num;i++){
    fs.watchFile(i+'.txt', (curr, prev) => {
        fs.readFile(i+'.txt','utf-8', (err, data) => {
            if (err) throw err;
            io.emit('broadcast',{"file":i,"content":data});
            console.log(data);
          });
    });    
}


