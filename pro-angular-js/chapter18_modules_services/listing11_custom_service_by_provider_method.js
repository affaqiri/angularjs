angular.module("customServices", [])

    .provider("logService", function() { //the factory function
        /**
         * Returns a provider object
         */
        return {
            $get: function () {

                /**
                 * Returns the service object.
                 */
                return {
                    messageCount: 0,
                    log: function (msg) {
                        console.log("(LOG + " + this.messageCount++ + ") " + msg);
                    }
                };
            }
        }
    });
