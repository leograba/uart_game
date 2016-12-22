var input = process.stdin;
var SerialPort = require('serialport');
//Using the UART_C from the Colibri i.MX6 module
var port = new SerialPort('/dev/ttymxc2', {
	baudRate: 57600,
	parser: SerialPort.parsers.byteLength(1)
});

//Hello message
console.log('Serial demo communication v0.1 (Colibri i.MX6)');
console.log('Please wait for master device to connect...');

function sendCommand(key){
	port.write(key, function writeHello(err) {
		if (err) console.log('Error on write: ', err.message);
	});
}

function enableStdin(){
	input.setRawMode(true);
	input.resume();
	input.setEncoding('UTF-8');
	input.on('data', function(key){
		//quit on ctrl+c
		if(key === '\u0003') process.exit(0);
		sendCommand(key);
	});
}

port.on('data', function(data){
	if(data.toString() == '0'){
		console.log('Connection estabilished');
		port.write('0', function (err){
			if (err) console.log('Error on write: ', err.message);
			//Enable read from stdin
			enableStdin();
			/*input.setRawMode(true);
			input.resume();
			input.setEncoding('UTF-8');
			input.on('data', function(key){
				//quit on ctrl+c
				if(key === '\u0003') process.exit(0);
				sendCommand(key);
			});*/
		});
	}
});


// open errors will be emitted as an error event
port.on('error', function(err) {
	console.log('Error: ', err.message);
});

