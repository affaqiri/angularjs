angular.module("exampleApp", [])
    .controller("defaultCtrl", function ($scope, $http, $interval, $timeout, $log) {

        $scope.counter = 0;
        $scope.intervalCounter = 0;
        $scope.timerCounter=0;

        $scope.incrementCounter = function() {
            $scope.counter++;
        };

        $http.get("productData.json").success(function (data) {
            $scope.products = data;
            $log.log("There are " + data.length + " items.");
        });

        /**
         * Call the anonymous function 10 times with a 5ms interval.
         */
        $interval(function() {
            $scope.intervalCounter++;
        }, 5000, 10);

        /**
         * Call the anonymous function 1 time after 5 ms of timeout.
         */
        $timeout(function() {
            $scope.timerCounter++;
        }, 5000);

    })
    .filter("labelCase", function () {
        return function (value, reverse) {
            if (angular.isString(value)) {
                var intermediate =  reverse ? value.toUpperCase() : value.toLowerCase();
                return (reverse ? intermediate[0].toLowerCase() :
                        intermediate[0].toUpperCase()) + intermediate.substr(1);
            } else {
                return value;
            }
        };
    })
    .factory("counterService", function() {
        var counter = 0;

        return {
            incrementCounter: function() {
                counter++;
            },
            getCounter: function() {
                return counter;
            }
        }
    })
;