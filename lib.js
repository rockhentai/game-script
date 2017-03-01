///////////////////////////////////////////////////////
// Generic utility functions for use with PlayCanvas //
///////////////////////////////////////////////////////

pc.script.create('lib', function (context) {
    // Creates a new Lib instance
    var Lib = function (entity) {
        this.entity = entity;
    };

    Lib.prototype = {
        
        //Get distance between two Vec3 positions
        distance3: function(first, second){
            var x,y,z,dist;
            
            x = second.x - first.x;
            y = second.y - first.y;
            z = second.z - first.z;
            x = x * x;
            y = y * y;
            z = z * z;
            dist = Math.sqrt(x + y + z);
            return dist;
        },
        
        //Get distance between two Vec3 positions ignoring one of the axis
        //ignoredAxis - 0=x,1=y,2=z
        distance2: function(first, second, ignoredAxis){
            var a,b,dist;
            
            switch(ignoredAxis){
                case 0:
                    a = second.y - first.y;
                    b = second.z - first.z;
                    break;
                case 1:
                    a = second.x - first.x;
                    b = second.z - first.z;
                    break;
                default:
                    a = second.x - first.x;
                    b = second.y - first.y;
                    break;
            }
               
            a = a * a;
            b = b * b;
            dist = Math.sqrt(a + b);
            return dist;
        },
        
        //Generate a random float or int between the two given numbers
        randomNum: function(min, max, isInt){
            if(!isInt)
                return Math.random() * (max - min) + min;
            else
                return Math.floor(Math.random() * (max - min + 1) + min);
        }
    };

    return Lib;
});