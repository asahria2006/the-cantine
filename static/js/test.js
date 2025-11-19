const obj = {
    message: 'hello'
}

let msg = JSON.stringify(obj);

let newMsg = JSON.parse(msg);

console.log(newMsg);