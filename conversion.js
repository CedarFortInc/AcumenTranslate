//Required modules
var strman = require('string');
var xmldom = require('xmldom');
var xpath = require('xpath');

var CONVERT = (function () {

  var conv = {

  //maps Shipworks orders csv to Acumen orders tsv.
  SWtoACU : function(input, i) {
    //check if there's something other than a lonely carriage return in the line.
    if (input[1] === undefined) {console.log('Blank input to Conversion.js'); return;}
    output = [];
    //Add the item quantity. Field A
    output[0]  = input[2];
    //Add the sanitized product code. Field  D
    output[3]  = validCode(input[4]);
    //Add the sanitized title. Field E
    output[4]  = tsvSafe(input[3]);
    //Take the total price and divide it into a unit price. Field H
    output[7]  = (input[6]/input[2]);
    //Add and manipulate the order number to match the store. Field J
    output[9]  = this.orderNoPre(input[28]) + tsvSafe(input[0]);
    //Add the order date. Field K
    output[10] = input[1];
    //Add the shipping cost. Field P
    output[15] = '0';
    //Add the billing name. Field X
    output[23] = input[18];
    //Add the billing address 1. Field Z
    output[25] = input[19];
    //Add the billing address 2. Field AA
    output[26] = input[20] + ' ' + input[21];
    //Add the billing address city. Field AB
    output[27] = input[22];
    //Add the billing address state. Field AC
    output[28] = input[23];
    //Add the billing address postal code. Field AD
    output[29] = input[24];
    //Add the billing address country code. Field AE
    output[30] = input[25];
    //Add the billing phone. Field AF
    output[31] = input[26];
    //Add the billing email. Field AG
    output[32] = input[27];
    //Add the shipping name. Field AT
    output[45] = input[8];
    //Add the shipping address 1. Field AV
    output[47] = input[9];
    //Add the shipping address 2. Field AW
    output[48] = input[10] + ' ' + input[11];
    //Add the shipping address city. Field AX
    output[49] = input[12];
    //Add the shipping address state. Field AY
    output[50] = input[13];
    //Add the shipping address postal code. Field AZ
    output[51] = input[14];
    //Add the shipping address country code. Field BA
    output[52] = input[15];
    //Add the shipping phone. Field BB
    output[53] = input[16];
    //Add the shipping email. Field BC
    output[54] = input[17];
    return output.join('\t');
    },
    /*
     * Suggests a prefix for, in order, CedarFort.com, Amazon.com, LDSLoot.com, and BooksAndThings.com
     * Defaults to SW(ShipWorks) for anything unknown, try not to let that happen too much.
     * Ensures that order values are unique in Acumen to prevent overwrites.
     */
    orderNoPre : function(input) {
      if (input.search(/edar/i) > -1) {return 'CF';
      } else if (input.search(/maz/i) > -1) {return 'AZ';
      } else if (input.search(/loot/i) > -1) {return 'LL';
      } else if (input.search(/things/i) > -1) {return 'BT';
      } else {return 'SW';}
    },
    
    //Maps ONIX XML files to Americommerce product import csv.
    ONIXtoAMC : function(input) {
      
    }
  };

  function tsvSafe(input) {
    //Strip out tabs, newlines and quote marks.
    var output = strman(input).collapseWhitespace().s.replace('"', '');
    return output;
  }

  //Validates and sanitizes the product codes.
  function validCode(input) {
    //Pop off any pick codes from LDSLoot.com
    var code = input.split('-', 1);
    //Strip the CFI prefix.
    code = strman(code).chompLeft('CFI').s;
    return code;
  }

  return conv;
   
});


module.exports = CONVERT();
