var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider.when("/dashboard", {
    // templateUrl: "logihPage.html",
    controller: "myController",
  });
});
app.controller("myController", function ($scope, $http, $location, $window) {
  $scope.newCity = null;
  $scope.notLoggedIn = true;
  $scope.setSearch = function () {
    $scope.city = $scope.search;
    $scope.newCity = $scope.search; // add this line

    console.log("new city" + $scope.newCity);
  };

  $scope.currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  $scope.currentDay = new Date().toLocaleString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  setInterval(function () {
    $scope.$apply(function () {
      navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        // Use OpenStreetMap Nominatim API to get city and country
        var url =
          "https://nominatim.openstreetmap.org/reverse?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&format=json&zoom=10";
        $http.get(url).then(function (response) {
          $scope.city =
            $scope.newCity != null
              ? $scope.newCity
              : response.data.address.city;
          console.log($scope.city);
          // var city = response.data.address.city;
          // var city = "Gandhinagar";
          // $scope.city = response.data.address.city;
          // var country = response.data.address.country;
          // $scope.currentLocation = $scope.city + ", " + country;
          $scope.currentLocation = $scope.city;
          // Replace with your API key
          // var apiKey = process.env.API_TOKEN;
          var apiKey = "9b95396a4e71970a331f25e34f65fb4a";
          // var apiKey = $window._env.API_TOKEN;
          // Replace with your desired city and country code
          // var city = $scope.city;
          var countryCode = "us";
          // Construct the API URL
          var apiUrl =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            $scope.city +
            "&units=metric&appid=" +
            apiKey;
          // Make the API request
          $http.get(apiUrl).then(
            function (response) {
              // Handle successful API response
              $scope.weatherData = response.data;
              console.log($scope.weatherData);
              // Extract the desired weather information from the response data and assign it to $scope variables
              $scope.temperature = response.data.main.temp;
              $scope.tempMin = response.data.main.temp_min;
              $scope.tempMax = response.data.main.temp_max;
              $scope.feelsLike = response.data.main.feels_like;
              $scope.weatherIcon = response.data.weather[0].icon;
              $scope.weatherType = response.data.weather[0].main;
              $scope.weatherIconUrl =
                "http://openweathermap.org/img/w/" +
                $scope.weatherIcon +
                ".png";
              $scope.pressure = response.data.main.pressure;
              $scope.humidity = response.data.main.humidity;
              $scope.windSpeed = response.data.wind.speed;
              $scope.sunrise = new Date(
                response.data.sys.sunrise * 1000
              ).toLocaleTimeString();
              $scope.sunset = new Date(
                response.data.sys.sunset * 1000
              ).toLocaleTimeString();
              $scope.windDegree = response.data.wind.deg;
            },
            function (error) {
              // Handle API request error
              console.error(error);
            }
          );
        });
      });
    });
  }, 5000);

  $scope.createUser = function () {
    if ($scope.createpassword != $scope.confirmpassword) {
      alert("Password and Confirm Password should be the same ");
    } else {
      $http({
        method: "POST",
        url: "http://localhost:8080/createUser",
        data: {
          username: $scope.createusername,
          password: $scope.createpassword,
          time: $scope.currentTime + " , " + $scope.currentDay,
          location: $scope.currentLocation,
        },
      }).then(function (response) {
        if (response.data.status == "User Exists") {
          alert("User Exists!!");
        } else {
          alert("User Created Successfully.");
          $window.location.reload();
        }
      });
    }
  };
  $scope.loginCheck = function () {
    console.log($scope.loginusername + " :" + $scope.loginpassword);

    $http({
      method: "POST",
      url: "http://localhost:8080/login",
      data: {
        username: $scope.loginusername,
        password: $scope.loginpassword,
        time: $scope.currentTime + " , " + $scope.currentDay,
        location: $scope.currentLocation,
      },
    }).then(
      function successCallback(response) {
        // Success callback code
        console.log(response.data);
        if (response.data.status == "ok") {
          alert("Login Successfull");
          $scope.isLoggedin = true;
          $scope.notLoggedIn = false;
          console.log($scope.isLoggedIn);

          $location.path("/dashboard");
        } else {
          alert("Invalid Credentials");
        }
      },
      function errorCallback(response) {
        console.log(response.status);
      }
    );
  };
});
