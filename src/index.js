var eorzea_time = require( './eorzeaclock.js' )();

setInterval( 
        function(){ console.log( eorzea_time.getTimeString() ) }, 
        eorzea_time.INCREMENT_INTERVAL 
);
