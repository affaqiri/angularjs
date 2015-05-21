angular.module("customServices", [])

    .factory("logService", function () {

        var messageCount = 0;

        /**
         * The service singleton object.
         */
        return {
            log: function (msg) {
                console.log("(LOG + " + messageCount++ + ") " + msg);
            }
        };
    });
