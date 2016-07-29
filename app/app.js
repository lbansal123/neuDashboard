'use strict';

// Declare app level module which depends on views, and components
var neuDash = angular.module('myApp', ['ui.router', 'kinvey', 'ui.bootstrap']);

neuDash.config(['$kinveyProvider', function($kinveyProvider) {
    $kinveyProvider.init({
    apiHostname: 'https://kvy-us2-baas.kinvey.com',
    appKey: 'kid_-1IhZZ_azZ',
    appSecret: 'ca695a04caf9491faea66ca7e2b8ea36'
  });
}]);
neuDash.run(['$kinvey', function($kinvey) {
    var promise = $kinvey.ping();
    promise.then(function(response) {
        console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
    }, function(error) {
        console.log('Kinvey Ping Failed. Response: ' + error.description);
    });
}]);

neuDash.config(function($stateProvider,$urlRouterProvider){
	$stateProvider.state('register', {
		url: '/register',
		//abstract: true,
		templateUrl: 'templates/registerModule/register.html',
		controller: 'registerCtrl'
	})
	.state('register.tab1', {
		url: '/page1',
		templateUrl: 'templates/registerModule/page1.html'
	})
	.state('register.tab2', {
		url: '/page2',
		templateUrl: 'templates/registerModule/page2.html'
	}).state('register.verifyEmail', {
		url: '/page3',
		templateUrl: 'templates/registerModule/page3.html'
	}).state('login', {
		url: '/login',
		//abstract: true,
		templateUrl: 'templates/loginModule/login.html',
		controller: 'loginCtrl'
	}).state('login.page1', {
		url: '/page1',
		templateUrl: 'templates/loginModule/page1.html'
	});

	$urlRouterProvider.when("/register", "/register/page1");
	//$urlRouterProvider.when("/login", "/login/page1");
});
