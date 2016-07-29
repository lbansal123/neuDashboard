neuDash.controller('loginCtrl',function($scope, $kinvey, $filter, $q){
	$scope.tabId = 1;

	$scope.isOpen = function(index) {
		$scope.tabId = index;
	}

	$scope.isSet = function(index) {
		return $scope.tabId === index;
	}

	$scope.hcpLoginArr = [{'hcpLoginEmail': '', 'hcpLoginPass': ''}];
	$scope.loginHcp = function() {
		console.log($scope.hcpLoginArr.hcpLoginEmail, $scope.hcpLoginArr.hcpLoginPass);
		var promise = $kinvey.User.login($scope.hcpLoginArr.hcpLoginEmail, $scope.hcpLoginArr.hcpLoginPass);
		promise.then(function(user) {
		  console.log(user);
		}).catch(function(error) {
		  console.log(error);
		});
	}

	$scope.args = {email: ''};
	$scope.forgotPass = function() {
		var promise = $kinvey.User.resetPassword($scope.args.email);
		promise.then(function(response) {
			console.log(response)
		}, function(err) {
		  console.log(err)
		});
	}
});

