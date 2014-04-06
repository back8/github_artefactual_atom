'use strict';

module.exports = function ($rootScope, $document, $location, $state, $stateParams, $sce, SETTINGS, SearchService) {
  return {
    restrict: 'E',
    templateUrl: SETTINGS.viewsPath + '/partials/search-box.html',
    replace: true,
    link: function (scope, element) {
      // Realm visibility
      scope.showRealm = false;

      // Default realm
      scope.realm = 'all';

      // References to the DOM
      var input = element.find('input[type=text]');
      var radio = element.find('input[type=radio]');

      // Autocomplete listener
      input.on('input', function (event) {
        search(event.target.value);
      });

      // Listen to keyup events like ESC, etc...
      input.on('keyup', function (event) {
        switch (event.which) {
          // Escape
          case 27:
            input.val('');
            scope.$apply(function () {
              scope.showRealm = false;
            });
            break;
          // Enter
          case 13:
            // Do nothing!
            break;
          default:
            if (!scope.showRealm) {
              scope.$apply(function () {
                scope.showRealm = true;
              });
            }
            break;
        }
      });

      // Toggle realm depending on when the user clicks
      // Tried with click, but doesn't work with the browse dropdown
      $document.on('mouseup', function (event) {
        var isTouching = element.has(event.target).length > 0;
        if (isTouching && !scope.showRealm) {
          scope.$apply(function () {
            scope.showRealm = true;
          });
        } else if (!isTouching && scope.showRealm) {
          scope.$apply(function () {
            scope.showRealm = false;
          });
        }
      });

      // When the user picks a new realm, do a search and focus input
      radio.on('click', function () {
        input.focus();
        search(input.val());
      });

      // Submit form, TODO this below is just a quick hack!
      scope.submit = function () {
        if (!scope.form.$valid) {
          return;
        }
        // Route user to the corresponding search page
        if (!$state.includes('search') || $stateParams.entity !== scope.realm) {
          var entity = scope.realm === 'all' ? 'aips' : scope.realm;
          $state.go('search.entity', { entity: entity }).then(function () {
            scope.showRealm = false;
            SearchService.setQuery(scope.query, scope.realm);
          });
        }
      };

      // Perform a search
      var search = function (query) {
        if (!angular.isDefined(query) || query.length < 3) {
          return;
        }
        var options = { realm: scope.realm };
        SearchService.autocomplete(query, options).then(function (results) {
          // Turn properties with <em> highlight to trusted html
          for (var key in results.data.aips) {
            var aip = results.data.aips[key];
            if (aip.hasOwnProperty('name')){
              aip.name = $sce.trustAsHtml(aip.name);
            }
          }
          for (key in results.data.artworks) {
            var artwork = results.data.artworks[key];
            if (artwork.hasOwnProperty('title')){
              artwork.title = $sce.trustAsHtml(artwork.title);
            }
          }
          for (key in results.data.components) {
            var comp = results.data.components[key];
            if (comp.hasOwnProperty('title')){
              comp.title = $sce.trustAsHtml(comp.title);
            }
          }
          for (key in results.data.technology_records) {
            var techRecord = results.data.technology_records[key];
            if (techRecord.hasOwnProperty('title')){
              techRecord.title = $sce.trustAsHtml(techRecord.title);
            }
          }
          for (key in results.data.files) {
            var file = results.data.files[key];
            if (file.hasOwnProperty('title')){
              file.title = $sce.trustAsHtml(file.title);
            }
          }
          scope.results = results.data;
        }, function () {
          delete scope.results;
        });
      };

      // Clean search field if the user changes the page
      $rootScope.$on('$stateChangeSuccess', function () {
        if (!$state.includes('search')) {
          scope.query = '';
        }
      });
    }
  };
};
