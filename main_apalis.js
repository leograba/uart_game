var SerialPort = require('serialport');
//Using the UART3 from the Apalis i.MX6 module
var port = new SerialPort('/dev/ttymxc3', {
	baudRate: 57600,
	parser: SerialPort.parsers.byteLength(1)
});
/*var input = process.stdin;
input.setRawMode(true);
input.resume();
input.setEncoding('UTF-8');
input.on('data', function(key){
	if(key === '\u0003') process.exit(0);
	sendCommand(key);
});*/

/*function sendCommand(key){
	port.write(key, function writeHello(err) {
		if (err) {
			console.log('Error on write: ', err.message);
		}
	});
}*/

var currentChar = 'A';
var currentPosition = 10;

//Hello message
console.log('Serial demo communication v0.1 (Apalis i.MX6)');

port.on('open', function() {
	port.write('0', function writeHello(err) {//first try to connect
		if (err) {
			console.log('Error on write: ', err.message);
		}
		console.log('First connection try...');
	});
});

//If fail to connect in the first try, do it again periodically
var tryHelloHandler = setInterval(function tryHelloUntilAnswered(){
	port.write('0', function writeHello(err) {//write hello message
		if (err) {
			console.log('Error on write: ', err.message);
		}
		console.log('Retry to connect...');
	});
}, 15000);


port.on('data', function(data){
	dataHandler(data);
});

// open errors will be emitted as an error event
port.on('error', function(err) {
   console.log('Error: ', err.message);
});

function dataHandler(data, callback){
	//if(data == '0') console.log('zero!');
	//console.log(typeof data);
	switch(data.toString()){
	case '0'://connection estabilished
		console.log('Connection estabilished!');
		clearInterval(tryHelloHandler);
		//print first lines
		process.stdout.write('--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		break;
	case ' '://print clear screen
        	process.stdout.moveCursor(0,-6)
        	process.stdout.cursorTo(0);
                process.stdout.write('--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		process.stdout.write('\n--------------------');
		break;
	default://move commands
		printLine(data, currentPosition, currentChar);
	}
}

function printLine(command, lastPosition, lastChar){
	var line = '';
	for(var i = 0; i < 20; i++){
		if(command == 's' && lastPosition == i){
			line += 'V';
			currentChar = 'V';
		}
		else if(command == 'w' && lastPosition == i){
			line += 'A';
			currentChar = 'A';
		}
		else if(command == 'a' && (lastPosition - 1) == i){
			line += lastChar;
			if(currentPosition > 1)
				currentPosition--;
		}
		else if(command == 'd' && (lastPosition + 1) == i){
			line += lastChar;
			if(currentPosition < 19)
				currentPosition++;
		}
		else line += '-';
	}
	process.stdout.moveCursor(0,-6)
	process.stdout.cursorTo(0);
	process.stdout.write('--------------------');
	process.stdout.write('\n--------------------');
	process.stdout.write('\n--------------------');
	process.stdout.write('\n--------------------');
	process.stdout.write('\n--------------------');
	process.stdout.write('\n' + line);
	process.stdout.write('\n--------------------');
}

