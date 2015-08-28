describe("Controller Test", function () {

    // Arrange
    var mockScope, controller, backend, mockInterval, mockTimeout, mockLog;

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
    beforeEach(angular.mock.inject(function ($controller, $rootScope, $http, $interval, $timeout, $log) {

        /**
         * Create a new mocked scope.
         */
        mockScope = $rootScope.$new();
        mockInterval = $interval;
        mockTimeout = $timeout;
        mockLog = $log;

        /**
         * Create a mocked controller using the $controller service
         */
        controller = $controller("defaultCtrl", {
            $scope: mockScope,
            $http: $http,
            $interval: mockInterval,
            $timeout: mockTimeout,
            $log: mockLog
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

    /**
     * The idea behind the interval and timer tests are to manipulate the execution timeout.
     *
     * In our controller, we need to wait 5ms so the anonymous functions registered with
     * $interval and $timeout to be called.
     *
     * The mock object let us manipulate the timer and advance it for execution.
     *
     * By advancing the execution, the controller functions are being called rapidly and we can see
     * the results immediately by the expect assertions.
     */
    it("Limits interval to 10 updates", function() {
        for(var i=0; i<11; i++) {
            mockInterval.flush(5000);
        }
        expect(mockScope.intervalCounter).toEqual(10);
    });

    it("Increments timer counter", function() {
        mockTimeout.flush(5000);
        expect(mockScope.timerCounter).toEqual(1);
    });

    it("Writes log messages", function() {
        mockTimeout.flush(5000);
        expect(mockLog.log.logs.length).toEqual(1);
    });

});