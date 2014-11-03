AcumenTranslator for Cedar Fort, Inc. v. 1.0.0

Description:

  This listener was designed to fill a need. It is not elegant or optimal, but it works around some severe shortcomings of our infrastructure.

  Primarily, its purpose is to get data into and out of Acumen by any means necessary. This is no easy feat. Acumen is built on a 4D database that is poorly maintained and terribly feature-locked. At the moment, we have two routes of access: ascii-tsv import, and ONIX/csv export. I chose Node.js as the platform because I don't know what languages you, future web-developer of Cedar Fort, know, but I am almost certain that you know JavaScript. 

  This app relies on the ProFTPD server also mounted on this machine. It should be farly secure from tampering with delivered files, but I will freely admit that I am not yet a great expert in security. 

  AcumenTranslator will trigger on changes to the files in /srv/ftp/upload. Depending on the type of file, it will trigger a different mapper, and send different data to various places. 

  ONIX.xml will trigger an ONIX to Americommerce and an ONIX to Drupal Production Schedule conversion, and it will send the files to BooksandThings.com and to the Cedar Fort production schedule site.


Provided Modules:

  - conversion.js: Contains the mapping logic. Exposes conversion.SWtoACU.

  - acutrans.js: Contains the file system logic and parses csv into lines for conversion.js. 


Required Modules:

  - string: Provides a simple csv parser and some utility string manipulation functions.


External Dependancies:

  - ShipWorks: aggregates various websites and provides a standard order reporting format.
  - Acumen: Cedar Fort's main database. This app was designed to make Acumen more usable.
  - ProFTPD: Must be running on the machine with this app. Allows data entry to access files for Acumen import.


To run:

  As star or root:
    node acutrans.js


License:

  AcumenTranslator and all related code is ©2014 Cedar Fort, Inc. All rights reserved. Not for distribution or implementation on external systems. All included third-party modules are © their respective authors and are included as open-source.


Contact Info: 
  
  Written by Emmett Raymond for Cedar Fort, Inc. (I plan to be embarrassed by this later.)
  www.cedarfort.com, www.booksandthings.com, www.ldsloot.com 
  Cedar Fort web dev email: star@cedarfort.com  
  General company email: cedarfort@cedarfort.com.
