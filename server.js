// Default Code 
const MongoClient = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to mongo
MongoClient.connect('mongodb://127.0.0.1',
                        { useNewUrlParser: true }, function(err, db){
    if (err) throw err;
    //Create a db "chatdb"
    var dbo = db.db("chatdb");
    console.log("DB 'chatdb' connected!");
    dbo.createCollection("chats", function(err, res) {
        if (err) throw err;
        console.log("Collection 'chats' created!");
    });
    // Connect to Socket.io
    client.on('connection', function(socket){
        let chat = dbo.collection('chats'); 
        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if (err) throw err;
            // Emit the messages
            socket.emit('output', res);
        });
        // Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;
            // Check for name and message
            if(name != '' && message != ''){
                // Insert message
                chat.insertOne({name: name, message: message}, function(){
                    client.emit('output', [data]);
                });
            }
        });
    });
});