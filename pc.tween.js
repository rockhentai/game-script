pc.tween = {
    
    easeOutQuad:function(t) {
        return 1 - ((1 - t) * (1 - t));
    },
    
    easeInOutQuad:function(t) {
        if( (t *= 2) < 1 ) {
            return 0.5 * t * t;
        } else {
            return 1 - 0.5 * ((2 - t) * (2 - t));
        }
    },
    
    easeOutCubic:function(t) {
        return --t * t * t + 1;
    },
    
    elasticOut:function(t,amplitude,period) {
        if(t === 0 || t === 1) {
            return t;
        }
        
        var s = period / (Math.PI*2) * Math.asin(1 / amplitude);
        return (amplitude * Math.pow(2,-10 * t) * Math.sin((t - s) * (Math.PI*2) / period) + 1);
    }
    
};