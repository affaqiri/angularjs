(function () {
    "use strict";

    /**
     * The productResourceMock service just mocks the real web service.
     * Once the services are available on the backend, we just need to remove this dependency and
     * our application will work fine cause nothing is hard coded in the productResource service
     * of the common.services modules.
     */
    var app = angular.module("productManagement",
                             ["common.services", "ui.mask", "ui.bootstrap",
                              "ui.router", "angularCharts",
                              "productResourceMock"]);

    app.config(function ($provide) {
        $provide.decorator("$exceptionHandler", ["$delegate", function ($delegate) {
            return function (exception, cause) {
                exception.message = "Please contact the Help Desk! \n Message: " +
                exception.message;
                $delegate(exception, cause);
                alert(exception.message);
            };
        }]);
    });

    /**
     * $urlRouterProvider services watches the angular built-in $location service for changes to the URL.
     * When $location changes, it finds a matching state through all the configured states and activates
     * the matching one or the otherwise() default route.
     *
     * To activate a state, you can:
     * 1. set the url to the defined state : /productManagement/index.html#/products
     * 2. call $state.go() in the code : $state.go('productList') where productList is a state name.
     * 3. click a link with the ui-sref directive <a ui-sref='productList'>...
     */
    app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

            /**
             * Default state for URLS not matching any configured routes.
             */
            $urlRouterProvider.otherwise("/");

            $stateProvider

                // Home page (default state)
                .state("home", {
                    url: "/",
                    templateUrl: "app/welcomeView.html"
                })

                // Products List View
                .state("productList", {
                    url: "/products",
                    templateUrl: "app/products/productListView.html",
                    controller: "ProductListCtrl as vm"
                })

                // Product Edit View
                .state("productEdit", {
                    abstract: true, //abstract state is only activated when one of the nested or child state is activated. can not be activated directly.
                    url: "/products/edit/:productId",
                    templateUrl: "app/products/productEditView.html",
                    controller: "ProductEditCtrl as vm",
                    resolve: {
                        productResource: "productResource",
                        product: function(productResource, $stateParams) {
                            var productId = $stateParams.productId;

                            return productResource.get({productId: productId}).$promise;
                        }
                    }
                })

                /**
                 * When a nested state does not define its own controller, it inherits the parent controller.
                 */
                // Product Edit View (Information sub state view)
                .state("productEdit.info", {
                    url: "/info",
                    templateUrl: "app/products/productEditInfoView.html"
                })

                // Product Edit View (Price sub state view)
                .state("productEdit.price", {
                    url: "/price",
                    templateUrl: "app/products/productEditPriceView.html"
                })

                // Product Edit View (Tags sub state view)
                .state("productEdit.tags", {
                    url: "/tags",
                    templateUrl: "app/products/productEditTagsView.html"
                })

                // Product Detail View
                .state("productDetail", {
                    url: "/products/:productId",
                    templateUrl: "app/products/productDetailView.html",
                    controller: "ProductDetailCtrl as vm",

                    // The controller and the view associated with this state are not created till all the dependencies
                    // declared in the resolve section are not fulfilled.
                    // So you should use the resolve to load the data for the view you are about to show and matching
                    // the state
                    resolve: {
                        // Dependencies to be resolved for this state defined as (key, value) pairs.
                        // Key name can be anything.

                        productResource: "productResource",

                        // The $stateParams param is part of the ui-route so no need to declare a dependency for it
                        // in the resolve section as we did for the productResource
                        product: function(productResource, $stateParams) {
                            var productId = $stateParams.productId;

                            return productResource.get({productId: productId}).$promise;
                        }
                    }
                })

                // Price Visualisation Chart
                .state("priceAnalytics", {
                    url: "/priceAnalytics",
                    templateUrl: "app/prices/priceAnalyticsView.html",
                    controller: "PriceAnalyticsCtrl",
                    resolve: {
                        productResource: "productResource",

                        products: function(productResource) {
                            return productResource.query(
                                /**
                                 * Example of treating the success and failure cases of promises
                                 */
                                //success case
                                function (response) {
                                    //no code needed for success
                                },
                                //failure case
                                function (response) {
                                    if (response.status == 404) {
                                        alert("Error accessing resource: " +
                                                response.config.method + " " + response.config.url);
                                    } else {
                                        alert(response.statusTest);
                                    }
                                },
                                //status notification case (rarely used)
                                function (response) {

                                }
                            ).$promise;
                        }
                    }
                })
        }]
    );

}());