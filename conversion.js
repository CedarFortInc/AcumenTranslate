//Required modules
var strman = require('string');
var xmldom = require('xmldom');
var xpath = require('xpath');

var CONVERT = (function () {

  var conv = {

  //maps Shipworks orders csv to Acumen orders tsv.
  SWtoACU : function(input, i) {
    //check if there's something other than a lonely carriage return in the line.
    if (input[1] == undefined) {console.log('Blank input to Conversion.js'); return;};
    //Add the item quantity. Field A
    var output = input[2];
    //Add the sanitized product code. Field  D
    output += '\t\t\t' + validCode(input[4]);
    //Add the sanitized title. Field E
    output += '\t' + tsvSafe(input[3]);
    //Take the total price and divide it into a unit price. Field H
    output += '\t\t\t' + (input[6]/input[2]);
    //Add and manipulate the order number to match the store. Field J
    output += '\t\t' + this.orderNoPre(input[28]) + tsvSafe(input[0]);
    //Add the order date. Field K
    output += '\t' + input[1];
    //Add the shipping cost. Field P
    output += '\t\t\t\t\t0';
    //Add the billing name. Field X
    output += '\t\t\t\t\t\t\t\t' + input[18];
    //Add the billing address 1. Field Z
    output += '\t\t' + input[19];
    //Add the billing address 2. Field AA
    output += '\t' + input[20] + ' ' + input[21];
    //Add the billing address city. Field AB
    output += '\t' + input[22];
    //Add the billing address state. Field AC
    output += '\t' + input[23];
    //Add the billing address postal code. Field AD
    output += '\t' + input[24];
    //Add the billing address country code. Field AE
    output += '\t' + input[25];
    //Add the billing phone. Field AF
    output += '\t' + input[26];
    //Add the billing email. Field AG
    output += '\t' + input[27];
    //Add the shipping name. Field AT
    output += '\t\t\t\t\t\t\t\t\t\t\t\t\t' + input[8];
    //Add the shipping address 1. Field AV
    output += '\t\t' + input[9];
    //Add the shipping address 2. Field AW
    output += '\t' + input[10] + ' ' + input[11];
    //Add the shipping address city. Field AX
    output += '\t' + input[12];
    //Add the shipping address state. Field AY
    output += '\t' + input[13];
    //Add the shipping address postal code. Field AZ
    output += '\t' + input[14];
    //Add the shipping address country code. Field BA
    output += '\t' + input[15];
    //Add the shipping phone. Field BB
    output += '\t' + input[16];
    //Add the shipping email. Field BC
    output += '\t' + input[17];
    return output;
    },
    /*
     * Suggests a prefix for, in order, CedarFort.com, Amazon.com, LDSLoot.com, and BooksAndThings.com
     * Defaults to SW(ShipWorks) for anything unknown, try not to let that happen too much.
     * Ensures that order values are unique in Acumen to prevent overwrites.
     */
    orderNoPre : function(input) {
      if (input.search(/edar/i) > -1) {return 'CF'
      } else if (input.search(/maz/i) > -1) {return 'AZ'
      } else if (input.search(/loot/i) > -1) {return 'LL'
      } else if (input.search(/things/i) > -1) {return 'BT'
      } else {return 'SW'};
    },
    
    //Maps ONIX XML files to Americommerce product import csv.
    ONIXtoAMC : function(input) {
      
    }
  };

  function tsvSafe(input) {
    //Strip out tabs, newlines and quote marks.
    var output = strman(input).collapseWhitespace().s.replace('"', '');
    return output;
  };

  //Validates and sanitizes the product codes.
  function validCode(input) {
    //Pop off any pick codes from LDSLoot.com
    var code = input.split('-', 1);
    //Strip the CFI prefix.
    code = strman(code).chompLeft('CFI').s;
    return code;
  };

  return conv;
   
});


module.exports = CONVERT();
