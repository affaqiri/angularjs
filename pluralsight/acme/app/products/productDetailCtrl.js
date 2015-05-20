(function () {
    "use strict";

    angular
        .module("productManagement")
        .controller("ProductDetailCtrl", ["product", "productService", ProductDetailCtrl]);

    /**
     * The product param is resolved by the ui-route and passed to the controller when
     * the associated state is activated.
     */
    function ProductDetailCtrl(product, productService) {
        var vm = this;

        vm.product = product;

        vm.title = "Product Detail: " + vm.product.productName;

        vm.marginPercent = productService.calculateMarginPercent(vm.product.price, vm.product.cost);

        if (vm.product.tags) {
            vm.product.tagList = vm.product.tags.toString(); //converts the array of tags to string of tags
        }
    }

}());