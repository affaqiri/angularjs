(function () {
    "use strict";

    angular
        .module("common.services")
        .factory("productService", productService);

    /**
     * A service can provide multiple functions.
     * We put all those functions inside the service factory function as below.
     */
    function productService() {

        function calculateMarginPercent(price, cost) {
            var margin = 0;

            if (price && cost) {
                margin = (100 * (price - cost)) / price;
            }

            margin = Math.round(margin);

            return margin;
        }

        function calculateMarginAmount(price, cost) {
            var margin = 0;

            if (price && cost) {
                margin = price - cost;
            }

            return margin;
        }

        function calculatePriceFromPercent(cost, percent) {
            var price = cost;

            if (cost && percent) {
                price = cost + (cost * percent / 100);
                price = (Math.round(price * 100)) / 100;
            }

            return price;
        }

        function calculatePriceFromAmount(cost, amount) {
            var price = cost;

            if (cost && amount) {
                price = cost + amount;
                price = (Math.round(price * 100)) / 100;
            }

            return price;
        }

        /**
         * Returns the service object which is the service API provided by this service.
         * The name of the key does not need to match the name of the function.
         */
        return {
            calculateMarginPercent: calculateMarginPercent,
            calculateMarginAmount: calculateMarginAmount,
            calculatePriceFromMarkupPercent: calculatePriceFromPercent,
            calculatePriceFromMarkupAmount: calculatePriceFromAmount
        }

    }

})();