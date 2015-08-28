describe("Controller Test", function () {

    // Arrange
    var mockScope = {};
    var controller;

    /**
     * 1. Load the module that contains the controller
     */
    beforeEach(angular.mock.module("exampleApp"));

    /**
     * 2. Load the controller we need to test and inject to it a new mockscope.
     */
    beforeEach(angular.mock.inject(
        function ($controller, $rootScope) {
            mockScope = $rootScope.$new();
            controller = $controller(
                "defaultCtrl",
                {
                    $scope: mockScope
                }
            );
        }
    ));

    /**
     * 3. Create your test cases on the controller data and behavior.
     */
    // Act and Assess
    it("Creates variable", function () {
        expect(mockScope.counter).toEqual(0);
    });

    it("Increments counter", function () {
        mockScope.incrementCounter();
        expect(mockScope.counter).toEqual(1);
    });

});