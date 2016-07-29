neuDash.controller('registerCtrl',function($scope, $kinvey, $filter, $q, $http){
	$scope.HcpRegisterArr = [{'HcpFname': '', 'HcpLname': '', 'HcpBirthYear': '', 'HcpValidateSlnNumber': '', 'HcpValidateSlnState': '', 'HcpValidateDeaNumber': '', 'HcpEmail': '', 'hcpPass': '', 'hcpPractPriv': '', 'hcpPractInstitution': '', 'hcpPractHospital': '', 'practiceName': '', 'practiceAddress': ''}];

	var doctorsListCollection = $kinvey.DataStore.getInstance('Doctor-list', $kinvey.DataStoreType.Network);
	$scope.HcpStep1 = function() {

		var promise = $kinvey.User.signup({
			username: $scope.HcpRegisterArr.HcpEmail,
			password: $scope.HcpRegisterArr.hcpPass,
			email: $scope.HcpRegisterArr.HcpEmail,
		  	HcpFname: $scope.HcpRegisterArr.HcpFname,
  			HcpLname: $scope.HcpRegisterArr.HcpLname,
  			HcpBirthYear: $scope.HcpRegisterArr.HcpBirthYear,
  			HcpValidateSlnNumber: $scope.HcpRegisterArr.HcpValidateSlnNumber,
  			HcpValidateSlnState: $scope.HcpRegisterArr.HcpValidateSlnState,
  			HcpValidateDeaNumber: $scope.HcpRegisterArr.HcpValidateDeaNumber,
  			hcpPass: $scope.HcpRegisterArr.hcpPass,
  			hcpPractPriv: $scope.HcpRegisterArr.hcpPractPriv,
  			hcpPractInstitution: $scope.HcpRegisterArr.hcpPractInstitution,
			hcpPractHospital: $scope.HcpRegisterArr.hcpPractHospital,  			
			practiceName: $scope.HcpRegisterArr.practiceName,
			practiceAddress: $scope.HcpRegisterArr.practiceAddress
		});
		promise.then(function(user) {
		 	console.log(user.data);
		}).catch(function(error) {
		  	console.log(error);
		});

	}
	$scope.logoutHcp = function() {
		var promise = new $kinvey.Promise(function(resolve) {
		  resolve($kinvey.User.getActiveUser());
		});
		promise.then(function(user) {
		  if (user) {
		    return user.logout();
		  }
		}).then(function() {
		  console.log("hello");
		}).catch(function(error) {
		  // ...
		});
	}
	
	$scope.getStarted = function() {
		var promise = $q(function(resolve) {
		  resolve($kinvey.User.getActiveUser());
		});
		promise.then(function(user) {
		  if (user) {
		    return user.me();
		  }
		  return user;
		}).then(function(user) {
		  console.log(user.isEmailVerified());

		  if(user && user.isEmailVerified()) {
		  	var userData = user.data;
		  	var query = new $kinvey.Query();
		  	console.log(doctorsListCollection);
		  	query.equalTo('practiceAddress', $scope.HcpRegisterArr.practiceAddress);
		  	doctorsListCollection.find(query).subscribe(function(assocaitedHcpArr) {
		  	  // Called when data is available
		  	  console.log(assocaitedHcpArr);
		  	  
		  	  var promise = doctorsListCollection.save({
		  	  	//_id: doctor_Id,
		  	  	assocaitedHcp: assocaitedHcpArr,
		  	  	email: $scope.HcpRegisterArr.HcpEmail,
		  	  	kvId: userData._id,
		  	  	practiceAddress: $scope.HcpRegisterArr.practiceAddress
		  	  }).then(function(entity) {
		  	  	console.log(entity);
	            var doctor_Id = entity._id;
	            userData.info = doctor_Id;
	            user.update(userData);
	            }, function(error) {
	              // ...
	            }, function() {
	              // Called after all the data callbacks are completed
	            });
	            
  	        });
		  }
		}).catch(function(error) {
			console.log(error);
		});
	}


	/* Address lookup */

	$scope.addressLookup = function(newAddress){
			$scope.addressLookupPopup = true;
			$http.get('https://api.smartystreets.com/street-address?auth-id=bc5514ee-4a90-df2e-b4f3-a32f46d79ae7&auth-token=ist5KAaoxqDXn7MbXtU5&street='+newAddress)
				.success(function (data, status, headers, config) {
					console.log(data);
					if (data.length != 0) {
						$scope.Details = data[0].delivery_line_1+ ", "+ data[0].components.city_name+", "+data[0].components.state_abbreviation+ " " +data[0].components.zipcode;
						$scope.updatedData = data;
	                } else {
	            		$scope.Details = 'No Match Found';
	                }
	            });
		}
		$scope.dataSuggestion = true;
		$scope.autoSuggestion = function(){
			var address = $scope.HcpRegisterArr.practiceAddress;
			$http.get('https://autocomplete-api.smartystreets.com/suggest?auth-id=bc5514ee-4a90-df2e-b4f3-a32f46d79ae7&auth-token=ist5KAaoxqDXn7MbXtU5&prefix='+address+'&suggestions=10')
				.success(function (data, status, headers, config) {
					if ($scope.HcpRegisterArr.practiceAddress) {
						if (data.suggestions) {
							$scope.dataSuggestion = true;
				            $scope.Suggestions = data.suggestions;
							$scope.suggestionInsert = function(index){
								$scope.HcpRegisterArr.practiceAddress = $scope.Suggestions[index].text;
								$scope.addressLookup($scope.HcpRegisterArr.practiceAddress);
							}
						}else{
							$scope.dataSuggestion = false;
						}
					} else {
						$scope.dataSuggestion = true;
						 $scope.Suggestions = [];
					}
					console.log($scope.Suggestions);
				});
		}
		$scope.newAddressData = function(){
			var address = $scope.newAddress;
			if (address) {
				$scope.addressLookup(address);
			} else {
				console.log('This field is required');
			}
		}
		$scope.updateAddress = function(){
			console.log($scope.updatedData);
			var data = $scope.updatedData;
			$scope.storedAddress  = true;
			$scope.practiceStreet = data[0].delivery_line_1;
			$scope.practiceCityState = data[0].components.city_name+" "+data[0].components.state_abbreviation;
			$scope.zipCode = data[0].components.zipcode;
		}

	// datePicker
	$scope.today = function() {
	  $scope.HcpRegisterArr.HcpBirthYear = new Date();
	};
	$scope.inlineOptions = {
	  customClass: getDayClass,
	  minDate: new Date(),
	  showWeeks: true
	};

	$scope.dateOptions = {
	  dateDisabled: disabled,
	  formatYear: 'yy',
	  maxDate: new Date(2020, 5, 22),
	  minDate: new Date(),
	  startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
	  var date = data.date,
	    mode = data.mode;
	  return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	}

	/*$scope.toggleMin = function() {
	  $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
	  $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	};

	$scope.toggleMin();*/

	$scope.open1 = function() {
	  $scope.popup1.opened = true;
	};

	$scope.setDate = function(year, month, day) {
	  $scope.HcpRegisterArr.HcpBirthYear = new Date(year, month, day);
	};

	/*$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.altInputFormats = ['M!/d!/yyyy'];*/

	$scope.popup1 = {
	  opened: false
	};

	function getDayClass(data) {
	  var date = data.date,
	      mode = data.mode;

	  if (mode === 'day') {
	    var dayToCheck = new Date(date).setHours(0,0,0,0);

	    for (var i = 0; i < $scope.events.length; i++) {
	      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	      if (dayToCheck === currentDay) {
	        return $scope.events[i].status;
	      }
	    }
	  }
	  return '';
	}

	$scope.tab = 1;
	$scope.openMe = function(index) {
		$scope.tab = index;
	}

	$scope.tabValue = function(tabId) {
		return $scope.tab === tabId;
	}



	
});