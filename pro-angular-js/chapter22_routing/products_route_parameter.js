angular.module("exampleApp", ["ngResource", "increment", "ngRoute"])

    .constant("baseUrl", "https://api.parse.com/1/classes/Products/")

    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common["X-Parse-Application-Id"] = "1VRj8q9cUrG7qknljAgAX7LWKLDUWPqRE3S1ygeD";
        $httpProvider.defaults.headers.common["X-Parse-REST-API-Key"] = "MWkcmxZYjUlNT4I3uc3HV3yxDZGbm5w6c5YaePAl";
    })

    /**
     * Service accessible to all controllers that creates the $resource access object.
     */
    .factory("productsResource", function($resource, baseUrl) {
        return $resource(
            baseUrl + ":id",
            {id : "@objectId"},
            {
                query: {
                    method: "GET",
                    isArray: true,
                    transformResponse: function(data, headers) {
                        return JSON.parse(data).results;
                    }
                },
                update: {
                    method: "PUT"
                }
            }
        );
    })

    .config(function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when(
            "/edit/:id",
            {
                templateUrl: "editor_view.html",
                controller: "editCtrl"
            }
        );

        $routeProvider.when(
            "/edit/:id/:data*",
            {
                templateUrl: "editor_view.html",
                controller: "editCtrl"
            }
        );

        $routeProvider.when(
            "/create",
            {
                templateUrl: "editor_view.html",
                controller: "editCtrl"
            }
        );

        $routeProvider.otherwise(
            {
                templateUrl: "table_view_route_parameter.html",
                controller:"tableCtrl",
                resolve: {
                    /**
                     * 'data' will be a dependency to be resolved before creating the controller
                     * tableCtrl so the associated function will be called and the resultat of the
                     * function will create the 'data' object that will be passed as parameter to
                     * the tableCtrl.
                     *
                     * Consequence: the view and the assoicated controller won't be created until
                     * the productResource.query() call is executed successfully and the data has
                     * been retrieved from the server.
                     */
                    data: function(productsResource) {
                        return productsResource.query();
                    }
                }

            }
        );
    })

    .controller("defaultCtrl", function ($scope, $location, $routeParams,
                                         productsResource, baseUrl) {

        $scope.data = {};

        $scope.currentProduct = null;

        $scope.deleteProduct = function (product) {
            product.$delete().then(function () {
                $scope.data.products.splice($scope.data.products.indexOf(product), 1);
            });
        }

        /**
         * Parse.com does not send back the created object. Instead it sends only the objectId of
         * the newly created object.
         * We could have used $get(id) to request for the newly created object and add it to our list
         * of local objects.
         * Here we take another approach, we use the angular.extend method to combine the properties and methods
         * of the newProduct object with the product object and add the combined object to the list of objects.
         * The combined object contains all the properties of the object plus the objectId of the newProduct
         * object returned by the server.
         */
        $scope.createProduct = function (product) {
            var newProduct = new productsResource(product);

            newProduct.$save().then(
                function(response) {
                    /**
                     * Here the newProduct object has only two properties objectId and createdAt,
                     * that's why we take these values and combine it with the product object that already had
                     * the name, category and price properties.
                     */
                    $scope.data.products.push(angular.extend(newProduct, product));
                    $location.path("/list");
                },
                function(response) {
                    console.log(response.status);
                }
            );
        }
    })

    /**
     * Controller for showing the retrieved data passed as argument.
     * The data is retrieved by the service used in the resolve of this controller in the route
     * configuration section.
     */
    .controller("tableCtrl", function($scope, $location, $route, data) {

        $scope.data.products = data;

        $scope.refreshProducts = function() {
            $route.reload();
        }
    })

    /**
     * Controller specific for the editor view
     */
    .controller("editCtrl", function($scope, $routeParams, $location) {

        $scope.currentProduct = null;

        /**
         * Here we dont even need to check for the $routeChangeSuccess event of the $route
         * service cause we know that if this controller is created it is because one of the routing
         * rules associated with this controller has been called so implicity a routechangeSuccess
         * has happened.
         */
        if ($location.path().indexOf("/edit/") == 0) {
            var id = $routeParams["id"];
            for (var i = 0; i < $scope.data.products.length; i++) {
                if ($scope.data.products[i].objectId == id) {
                    $scope.currentProduct = $scope.data.products[i];
                    break;
                }
            }
        }

        /**
         * AngularJS $update method expects the server to send back the updated object.
         * AngularJS then uses the returned object to update the local instance of that object.
         * In our example, parse.com does not send back the updated object but only sends
         * a notification informing that the product was updated on the server.
         * So in order to avoid angularjs update the local instance of the object with the notification object
         * returned by the server (parse.com), we create a copy of the object to be updated on the server
         * before passing it to $update method and like that angular js does not alter the local instance with
         * some wrong data while updating it with the object returned by the server.
         */
        $scope.updateProduct = function (product) {
            angular.copy(product).$update().then(function() {
                $location.path("/list");
            });
        }

        $scope.saveEdit = function (product) {
            if (angular.isDefined(product.objectId)) {
                $scope.updateProduct(product);
            } else {
                $scope.createProduct(product);
            }
            $scope.currentProduct = {};
        }

        $scope.cancelEdit = function () {
            $scope.currentProduct = {};
            $location.path("/list");
        }

    });