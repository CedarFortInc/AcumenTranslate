//Required modules
var http = require('http');
var fs = require('fs');
var strman = require('string');
var conv = require('./conversion.js');
var watch = require('watch');
//Crude promise interface.
var WriteCount = 0;

//This is the listener that checks the ftp directory and triggers the appropriate conversion.
watch.createMonitor('/srv/ftp/upload/', { 'ignoreDotFiles' : true }, function (monitor){
  console.log('Starting up AcumenTranslate. Standing by. . .');
  monitor.on('created', function(file, stat){
    FileHandler(file, stat, null);
  });
  monitor.on('changed', FileHandler);
  monitor.on('removed', function(file){console.log('Hey! Where\'d ' + file + ' go?\nI was watching it like a hawk, I swear!');});
});

//Sort through files received and apply a transformation on them, depending on filename.
var FileHandler = (function(file, stat, statPrev){
    //Announce that we received a file. 
    console.log(file + ' has changed! Can\'t talk now. Very busy.');
    //Prep our seach term.
    var regexp = '(\/srv\/ftp\/upload\/shipworks)(..)(.csv)';
    //See if we have a shipworks file.
    if (strman(file).search(regexp) > -1) {
      //If we do, send it to be converted and tell the converter which storefront it came from.
      Shipworks(file.match(regexp)[2].toUpperCase(), file, function(){console.log('All done. Awaiting further data. . .');});
    //Error handling.
    } else {
      ErrorHandler('badfile', file);
    } 
});

/*
 * Pull the current orders from shipworks. Split them up by order number. 
 * Pass them through the converter. Post the individual orders to ftp.
 */
//Pull file into function
var Shipworks = function(prefix, file, callback){fs.readFile(file, function(err, ordersw) {
  //Init orders array
  var orders = [];
  //Parse ordersw. Quote delimiter is U+22C4 - Diamond Operator. See ShipWorks template for Orders to Acumen.
  orders = strman(ordersw).parseCSV(',', '\u22C4', null, '\n');
  //Log the date of the order.
  console.log(orders[1][1]);
  //Find the first order number for the sake of collection.
  var orderNo = orders[1][0];
  //Init the string that will be written to file.
  var singleOrder = '';
  //This loop collects lines with matching order numbers and writes one file per collection. See the Acumen import process for why. 
  orders.forEach(function(value, i, array) {
    //Skip the headers.
    if (i === 0) {return;}
    //Check if this line is part of the same order as previous lines. 
    if (value[0] == orderNo) {
      //If it does match, run the conversion and ;;
      singleOrder += conv.SWtoACU(value) + '\r\n';
    //If this line is a new order, clean up the previous order and write to file.
    } else {
      //Write a unique timestamp plus order number. I may change this. It's unwieldly. Source prefix + order number may be better.
      var stamp = prefix + orderNo;
      var fileName = 'to_AC_#' + stamp + '.txt';
      console.log('Writing Order #' + orderNo + ' to File: ' + fileName);
      //Warn that we are starting a new write.
      WriteCount++;
      //Write the file to the ftp server, ready for download. Server is ProFTPD hosted on this machine.
      fs.writeFile('/srv/ftp/download/' + fileName, singleOrder, function(err) {
        if (err) {console.log(err);} else {console.log('File Ready for Download');}
        //Announce that the write is finished.
        WriteCount--;
      });
      //Finally, clear the previous orders and write the deviant line to the beginning of a new order collection.
      if (value[28] !== undefined) {singleOrder = conv.SWtoACU(value) + '\r\n';
      //Set the order number of the new collection.
      orderNo = value[0];}
    }
  });
  //Wait for all writes to resolve, then announce completion.
  var finished = function() {
    if (WriteCount > 0) {setTimeout(finished, 100);} else {console.log('All done. Awaiting further data. . .');}
  };
  finished();
});};


var ErrorHandler = (function(error, badData){
  switch (error){
    //The FileHandler couldn't understand what it had.
    case 'badfile' :
      //Error if something shows up in the ftp that we weren't expecting.
      console.log('\x1b[31m\x1b[5mWARNING: \x1b[1;31mFile not recognized.\x1b[00m');
      //See if it's a rational type of file.
      if (typeof badData === 'string') {
        //Give it a timestamp and a suffix for safety.
        var filename = Date.now() + '_' + badData.split('/').pop() + '.invalid';
        //Tell the user where to find the unknown file.
        console.log('\x1b[31mSaving to \x1b[00m./failedfiles/' + filename);
        //Move the file into our junkyard folder.
        copyFile(badData, (__dirname + '/failedfiles/' + filename));
        //Insult the user and continue with what we were doing.
        console.log('I hope you\'re proud of yourself.\nExcuse me, I have some listening to do. . .');
      //We saw something. Something horrible, outside of man's reckoning. Something in the filesystem that wasn't a file or directory...
      } else {
        //Panic.
        console.log('You screwed up so bad that I can\'t even handle it.\nHave a good life, I\'m done for.');
        console.log('Error type: ' + error);
        console.log('  Variable: ' + badData);
        console.log('  .valueOf: ' + badData.valueOf());
        console.log(' .toString: ' + badData.toString());
        console.log('.stringify: ' + JSON.stringify(badData,null,4));
        //Die.
        process.exit();
      }
    break;
  }
});

var copyFile = (function(source, target, callback){
  var called = false;
  var read = fs.createReadStream(source);
  read.on('error', done);

  var write = fs.createWriteStream(target);
  write.on('error', done);
  write.on('close', function(exit) {
    done();
  });
  read.pipe(write);

  function done(error) {
    if (!called && callback != null) {
      console.log('called it');
      callback(error);
      called = true;
    }
  }
});
