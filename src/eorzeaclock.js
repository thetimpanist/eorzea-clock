(function(){

    var root = this;

    /**
    * Options:
    * hour12: boolean
    */
    var eorzea_time = function( options ){
        var options = typeof options == 'object' ? options : {};
        var ratioRealToGame = 144 / 7;
        var hour12 = options.hour12 || false;

        /**
        * Converts time in the format hh:mm to minutes
        * - eorzea times never need to be accurate to the second
        *
        * @param string
        *
        * @return integer
        */
        var convertTimeToMinutes = function( time ){
            parts = time.split( ':' ).map( Number );
            return parts[0] * 60 + parts[1];
        }

        var pub = {
            INCREMENT_INTERVAL: 2917,
            getMilliseconds: function( date ){
                date = date || new Date();
                return parseInt( date.getTime() * ratioRealToGame );
            },
            getHour: function( date ){
                var mod = hour12 ? 12 : 24;
                var hour = parseInt( pub.getMilliseconds( date ) / 3600000 ) % mod;
                return hour12 && !hour ? 12 : hour;
                    
            },
            getMinute: function( date ){
                return parseInt( pub.getMilliseconds( date ) / 60000 ) % 60;
            },
            getSecond: function(){
                return parseInt( pub.getMilliseconds( date ) / 1000 ) % 60;
            },
            getMeridiem: function( date ){
                if( hour12 )
                    return parseInt( pub.getMilliseconds( date ) / 3600000 )  % 24 >= 12 ? 'PM' : 'AM';
                return '';
            },
            getTimeString: function( date ){
                var minute = pub.getMinute( date );
                if( minute < 10 )
                    minute = '0' + minute;
                return pub.getHour( date ) + ':' + minute + ' ' + pub.getMeridiem( date );
            },
            
            /** 
            * Get the next real time that an eorzea time will occur
            * - due to rounding issues, this function may produce dates with a margin
            *  of error of ±1 second
            *
            * @param string
            * @param date ( optional )
            *
            * @return Date
            */
            getNext: function( eorzea_time, date ){
                date = date || new Date();
                var target = convertTimeToMinutes( eorzea_time );
                var now = convertTimeToMinutes( pub.getTimeString( date ) );
                if( target < now )
                    target += hour12 ? 720 : 1440;
                var delta = target - now;

                return new Date( date.getTime() + ( delta * 60 * 1000 ) / ratioRealToGame );
            }
        }
        return pub;
    }

    if( typeof module !== 'undefined' && typeof module.exports !== 'undefined' )
        module.exports = eorzea_time;
    else
        root.eorzea_time = eorzea_time;
})();
