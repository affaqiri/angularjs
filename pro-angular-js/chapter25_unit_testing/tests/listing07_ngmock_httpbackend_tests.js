describe("Controller Test", function () {

    // Arrange
    var mockScope, controller, backend;

    /**
     * 1. Load the module that contains the controller
     */
    beforeEach(angular.mock.module("exampleApp"));

    /**
     * Step 1 for using the mock $httpBackend:
     * Define the requests that you expect to get and the responses for them.
     */
    beforeEach(angular.mock.inject(function ($httpBackend) {

        backend = $httpBackend;

        backend.expect("GET", "productData.json")
            .respond(
                [
                    { "name": "Apples", "category": "Fruit", "price": 1.20 },
                    { "name": "Bananas", "category": "Fruit", "price": 2.42 },
                    { "name": "Pears", "category": "Fruit", "price": 2.02 }
                ]
            );
    }));

    /**
     * 2. Instantiate the controller with a mocked scope
     */
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $http) {

        /**
         * Create a new mocked scope.
         */
        mockScope = $rootScope.$new();

        /**
         * Create a mocked controller using the $controller service
         */
        controller = $controller("defaultCtrl", {
            $scope: mockScope,
            $http: $http
        });

        /**
         * Step 2 for using the mock $httpBackend.
         * Sending the prepared responses. No prepared response will be sent until we
         * call this method.
         */
        backend.flush();
    }));

    // Act and Assess
    it("Creates variable", function () {
        expect(mockScope.counter).toEqual(0);
    });

    it("Increments counter", function () {
        mockScope.incrementCounter();
        expect(mockScope.counter).toEqual(1);
    });

    /**
     * Step 3 for using the mock $httpBackend.
     * Check that all of the expected requests were made.
     */
    it("Makes an Ajax Request", function () {
        backend.verifyNoOutstandingExpectation();
    });

    /**
     * Step 4 for using the mock $httpBackend.
     * Evaluate the results.
     */
    it("Processes the data", function () {
        expect(mockScope.products).toBeDefined();
        expect(mockScope.products.length).toEqual(3);
    });

    it("Processes the data order", function () {
        expect(mockScope.products[0].name).toEqual("Apples");
        expect(mockScope.products[1].name).toEqual("Bananas");
        expect(mockScope.products[2].name).toEqual("Pears");
    });

});