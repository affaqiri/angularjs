angular.module("customServices", [])

    .provider("logService", function () {

        var counter = true;
        var debug = true;

        /**
         * Returns the provider object.
         *
         * The provider object can be injected anywhere using the serviceNameProvider where
         * serviceName is the name of the service. Example logServiceProvider.
         *
         * The provider object lets configure the service behavior by providing configuration
         * methods as below 'messageCounterEnabled' and 'debugEnabled'.
         *
         * The behavior of the real service object defined in $get is then controlled by
         * these configuration methods.
         */
        return {

            messageCounterEnabled: function (setting) {
                if (angular.isDefined(setting)) {
                    counter = setting;
                    return this;
                } else {
                    return counter;
                }
            },

            debugEnabled: function(setting) {
                if (angular.isDefined(setting)) {
                    debug = setting;
                    return this;
                } else {
                    return debug;
                }
            },

            $get: function () {

                /**
                 * Returns the real service object.
                 */
                return {
                    messageCount: 0,
                    log: function (msg) {
                        if (debug) {
                            console.log("(LOG"
                                + (counter ? " + " + this.messageCount++ + ") " : ") ")
                                + msg);
                        }
                    }
                };
            }
        }
    });