(function() {
    var wheelIndicator = {
        last5values: [ 0, 0, 0, 0, 0 ],
        memoryAcceleration: [ 0, 0 , 0 ],
        isAcceleration: false,
        isStopped: true,
        direction: '',
        delta: '',
        timer: '',
        onWheel: ('onwheel' in document) ? 'wheel' : 
                 ('onmousewheel' in document) ? 'mousewheel' :
                 'MozMousePixelScroll',

        addEvent: function(elem, type, handler){
            if(window.addEventListener) {
                elem.addEventListener(type, handler, false);
            }
            if(window.attachEvent) {
                elem.attachEvent('on' + type, handler);
            }
        },

        getDeltaY: function(event) {
            if(event.wheelDelta) {
                wheelIndicator.getDeltaY = function(event) {
                    return event.wheelDelta / -120;
                }
            } else {
                wheelIndicator.getDeltaY = function(event) {
                    return event.deltaY;
                }
            }
            return wheelIndicator.getDeltaY(event);
        },

        processDelta: function(deltaY)  {
            var self = this,
                stepAcceleration = 0, i;

            self.direction = deltaY > 0 ? direction = 'down' : direction = 'up';
            self.delta = Math.abs(deltaY);

            clearTimeout(self.timer);

            self.timer = setTimeout(function() {
                self.last5values = [ 0, 0, 0, 0, 0 ];
                self.memoryAcceleration = [ 0, 0 , 0 ];
                self.isStopped = true;
                self.isAcceleration = false;
            }, 200);

            if(self.isStopped) {
                self.triggerEvent();
                self.isStopped = false;
                self.isAcceleration = true;
                stepAcceleration = 1;

                self.memoryAcceleration.shift();
                self.memoryAcceleration.push(stepAcceleration);
            } else {
                self.last5values.shift();
                self.last5values.push(self.delta);

                for(i = 5; i--; i == 1) {
                    if(self.last5values[i - 1] < self.last5values[i]) {
                        stepAcceleration++;
                    }
                }

                self.memoryAcceleration.shift();
                self.memoryAcceleration.push(stepAcceleration);

                if( (self.memoryAcceleration[2] < self.memoryAcceleration[1]) &&
                    (self.memoryAcceleration[1] < self.memoryAcceleration[0])) {
                    //Произошло затухание
                    self.isAcceleration = false;
                }

                if( (self.memoryAcceleration[2] > self.memoryAcceleration[1]) &&
                    (self.memoryAcceleration[1] > self.memoryAcceleration[0])) {
                    //Произошло ускорение
                    if(!self.isAcceleration) {
                        self.isAcceleration = true;
                        self.triggerEvent();
                    }
                }
            }
        },

        triggerEvent: function() {

            try {
                new CustomEvent("IE has CustomEvent, but doesn't support constructor");
            } catch (e) {

                window.CustomEvent = function(event, params) {
                    var evt;
                    params = params || {
                        bubbles: false,
                        cancelable: false,
                        detail: undefined
                    };
                    
                    evt = document.createEvent("CustomEvent");
                    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    return evt;
                };

                CustomEvent.prototype = Object.create(window.Event.prototype);
            };

            var scrollUp    = new CustomEvent('scrollUp'),
                scrollDown  = new CustomEvent('scrollDown');

            triggerEvent = function() {
                this.direction === 'up' ? window.dispatchEvent(scrollUp) : window.dispatchEvent(scrollDown);
            };
            triggerEvent();
        }
    };

    wheelIndicator.addEvent(document, wheelIndicator.onWheel, function(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false); // by libris
        wheelIndicator.processDelta(wheelIndicator.getDeltaY(event));
    });
}());