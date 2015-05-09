angular.module("exampleApp", [])

    .constant("baseUrl", "https://api.parse.com/1/classes/Products/")

    .config(function($httpProvider) {

        $httpProvider.defaults.headers.common["X-Parse-Application-Id"] = "1VRj8q9cUrG7qknljAgAX7LWKLDUWPqRE3S1ygeD";
        $httpProvider.defaults.headers.common["X-Parse-REST-API-Key"] = "MWkcmxZYjUlNT4I3uc3HV3yxDZGbm5w6c5YaePAl";

        $httpProvider.interceptors.push(function() {
            return {
                response : function(response) {
                    if (response.headers("content-type").indexOf("application/json") != -1) {
                        if (response.hasOwnProperty("data") &&
                            response.data.hasOwnProperty("results")) {
                            response.data = response.data.results;
                        }
                    }
                    return response;
                }
            }
        })
    })

    .controller("defaultCtrl", function ($scope, $http, baseUrl) {

        $scope.displayMode = "list";
        $scope.currentProduct = null;

        $scope.listProducts = function () {
            $http.get(baseUrl).success(function (data) {
                $scope.products = data;
            });
        }

        $scope.deleteProduct = function (product) {
            $http({
                method: "DELETE",
                url: baseUrl + product.objectId
            }).success(function () {
                $scope.products.splice($scope.products.indexOf(product), 1);
            });
        }

        $scope.createProduct = function (product) {
            $http.post(baseUrl, product)
                .success(function(response) {
                    product.objectId = response.objectId;
                    $scope.products.push(product);
                    $scope.displayMode = "list";
                })
                .error(function(response) {
                    /**
                     * For debugging purpose.
                     */
                    console.log(response.status);
                })
        }

        $scope.updateProduct = function (product) {
            $http({
                url: baseUrl + product.objectId,
                method: "PUT",
                data: product
            }).success(function (modifiedProduct) {
                for (var i = 0; i < $scope.products.length; i++) {
                    if ($scope.products[i].objectId == product.objectId) {
                        $scope.products[i] = product;
                        break;
                    }
                }
                /* the modified object returned does not contain the objectId field so i can not search
                and update the list of products if i base my test on that field.
                for (var i = 0; i < $scope.products.length; i++) {
                    if ($scope.products[i].objectId == modifiedProduct.objectId) {
                        $scope.products[i] = modifiedProduct;
                        break;
                    }
                }*/
                $scope.displayMode = "list";
            });
        }

        $scope.editOrCreateProduct = function (product) {
            $scope.currentProduct =
                product ? angular.copy(product) : {};
            $scope.displayMode = "edit";
        }

        $scope.saveEdit = function (product) {
            if (angular.isDefined(product.objectId)) {
                $scope.updateProduct(product);
            } else {
                $scope.createProduct(product);
            }
        }

        $scope.cancelEdit = function () {
            $scope.currentProduct = {};
            $scope.displayMode = "list";
        }

        $scope.listProducts();
    });

