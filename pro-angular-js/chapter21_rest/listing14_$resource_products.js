angular.module("exampleApp", ["ngResource"])

    .constant("baseUrl", "https://api.parse.com/1/classes/Products/")

    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common["X-Parse-Application-Id"] = "1VRj8q9cUrG7qknljAgAX7LWKLDUWPqRE3S1ygeD";
        $httpProvider.defaults.headers.common["X-Parse-REST-API-Key"] = "MWkcmxZYjUlNT4I3uc3HV3yxDZGbm5w6c5YaePAl";
    })

    .controller("defaultCtrl", function ($scope, $http, $resource, baseUrl) {

        $scope.displayMode = "list";
        $scope.currentProduct = null;
    
        $scope.productsResource = $resource(
            baseUrl + ":id",
            {
                id : "@objectId"
            },
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
    
        $scope.listProducts = function () {
            $scope.products = $scope.productsResource.query();

            /**
             * Not needed for the example but necessary for situation where we want
             * to execute something once we are sure the data completely loaded.
             */
            $scope.products.$promise.then(function() {
               console.log("all products loaded from the server");
            });
        }
    
        $scope.deleteProduct = function (product) {
            product.$delete().then(function () {
                $scope.products.splice($scope.products.indexOf(product), 1);
            });

            $scope.displayMode = "list";
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
            var newProduct = new $scope.productsResource(product);

            newProduct.$save().then(
                function(response) {
                    /**
                     * Here the newProduct object has only two properties objectId and createdAt,
                     * that's why we take these values and combine it with the product object that already had
                     * the name, category and price properties.
                     */
                    $scope.products.push(angular.extend(newProduct, product));
                    $scope.displayMode = "list";
                },
                function(response) {
                    console.log(response.status);
                }
            );
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
                $scope.displayMode = "list";
            });
        }
    
        $scope.editOrCreateProduct = function (product) {
            $scope.currentProduct = product ? product : {};
            $scope.displayMode = "edit";
        }
    
        $scope.saveEdit = function (product) {
            if (angular.isDefined(product.objectId)) {
                $scope.updateProduct(product);
            } else {
                $scope.createProduct(product);
            }
        }

        /**
         * The test $scope.currentProduct.$get let us know if the method $get() is available (defined)
         * on the object before calling it on the next line.
         *
         * This let us treat the cases related to a persisted modified product and a new non persisted
         * product.
         *
         * $get() restore the state of the object from the server.
         */
        $scope.cancelEdit = function () {
            if ($scope.currentProduct && $scope.currentProduct.$get) {
                $scope.currentProduct.$get();
            }
            $scope.currentProduct = {};
            $scope.displayMode = "list";
        }
    
        $scope.listProducts();
    });