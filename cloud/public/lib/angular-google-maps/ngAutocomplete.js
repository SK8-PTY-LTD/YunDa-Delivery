'use strict';

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Usage:
 *
 * <input type="text"  ng-autocomplete ng-model="autocomplete" options="options" details="details/>
 *
 * + ng-model - autocomplete textbox value
 *
 * + details - more detailed autocomplete result, includes address parts, latlng, etc. (Optional)
 *
 * + options - configuration for the autocomplete (Optional)
 *
 *       + types: type,        String, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *       + bounds: bounds,     Google maps LatLngBounds Object, biases results to bounds, but may return results outside these bounds
 *       + country: country    String, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *       + watchEnter:         Boolean, true; on Enter select top autocomplete result. false(default); enter ends autocomplete
 *
 * example:
 *
 *    options = {
 *        types: '(cities)',
 *        country: 'ca'
 *    }
**/

angular.module( "ngAutocomplete", [])
  .directive('ngAutocomplete', function() {
      return {

        scope: {
          details: '=',
          ngAutocomplete: '=',
          options: '='
        },

        link: function(scope, element, attrs, model) {

          //options for autocomplete
          var opts

          //convert options provided to opts
          var initOpts = function() {
            opts = {}
            if (scope.options) {
              if (scope.options.types) {
                opts.types = []
                opts.types.push(scope.options.types)
              }
              if (scope.options.bounds) {
                opts.bounds = scope.options.bounds
              }
              if (scope.options.country) {
                opts.componentRestrictions = {
                  country: scope.options.country
                }
              }
            }
          }
          initOpts()

          //create new autocomplete
          //reinitializes on every change of the options provided
          var newAutocomplete = function() {
            scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
              scope.$apply(function() {
//              if (scope.details) {
                scope.details = scope.gPlace.getPlace();
//              }
                scope.ngAutocomplete = element.val();
              });
            })
          }
          newAutocomplete()

          //watch options provided to directive
          scope.watchOptions = function () {
            return scope.options
          };
          scope.$watch(scope.watchOptions, function () {
            initOpts()
            newAutocomplete()
            element[0].value = '';
            scope.ngAutocomplete = element.val();
          }, true);
        }
      };
  });