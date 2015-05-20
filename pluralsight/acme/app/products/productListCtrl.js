(function () {
    "use strict";

    angular
        .module("productManagement")
        .controller("ProductListCtrl", ["productResource", ProductListCtrl]);

    function ProductListCtrl(productResource) {

        var vm = this;

        vm.showImage = false;

        /**
         * query() method of the $resource service.
         */
        productResource.query(function(data) {
            vm.products = data;
        });

        vm.toggleImage = function() {
            vm.showImage = !vm.showImage;
        }
    }

}());