// Get Elements By Id Function
var element = function(id){
    return document.getElementById(id);
}

// Take New User Function
var user = document.getElementById("newUser");
user.addEventListener("click", function(){
    var newUser = String(prompt("Please enter your 'username':")); 
    if(!newUser || newUser == ""){
      localStorage["username"] = "undefinedUser";  
    }else{
      localStorage["username"] = newUser;
    } 
    //document.getElementById("user").innerHTML = localStorage["username"];  
}, false);

// Get Username, Messages And So On 
if(!localStorage.getItem('username')){
    localStorage.setItem('username', prompt("Please enter your 'username':")); 
    //document.getElementById("user").innerHTML = localStorage["username"];   
}
var messages = element('messages');
var textarea = element('textarea');
var sendBtn = element('send');
// Connect to socket.io
var socket = io.connect('http://127.0.0.1:4000');
// Check for connection
if(socket !== undefined){
    console.log('Connected to socket...');
    // Handle Output
    socket.on('output', function(data){
        if(data.length){
            for(var x = 0;x < data.length;x++){
                // Username
                var name =  document.createElement('div');
                name.setAttribute('class', 'username');
                name.textContent = data[x].name;
                // Message                                            
                var message = document.createElement('div');
                message.setAttribute('class', 'message');
                message.textContent = data[x].message;
                // Result Message               
                messages.appendChild(message);
                messages.insertBefore(message, messages.firstChild);
                // And Username
                messages.appendChild(name);
                messages.insertBefore(name, messages.firstChild);
            }
        }
    });
    // Handle Input1
    textarea.addEventListener('keydown', function(event){
        if(event.which === 13 && event.shiftKey == false){
            // Emit to server input
            socket.emit('input', {
                name:localStorage["username"],
                message:textarea.value
            });
            textarea.value = '';
            event.preventDefault();
        }
    })
    // Handle Input2
    /*sendBtn.addEventListener('click', function(){
        socket.emit('input', {
            name:localStorage["username"],
            message:textarea.value
        });
        textarea.value = '';
        event.preventDefault();
    });*/
    // Clear Message
    socket.on('cleared', function(){
        messages.textContent = '';
    });
}