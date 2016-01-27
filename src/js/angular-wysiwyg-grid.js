var app = angular.module("ngWysiwygGrid", []);

app.factory("wysiwygGridService", [function () {
	var gridElement = null;
	
	return {
		setGridElement: function (elem) {
			gridElement = elem;
		},
		
		getGridValue: function () {
			return gridElement.gridEditor('getHtml');
		}
	};
}]);

app.directive("wysiwygGrid", ["$interval", "wysiwygGridService", function ($interval, wysiwygGridService) {
	var linkFn = function (scope, elem, attrs) {
		if (!scope.editor) {
			console.log("ERROR: no wysiwyg editor found");
			return;
		}
		        
        var opts = {
            content_types: [scope.editor]
        };
        
        if (scope.options) {
        	opts[scope.editor] = {
	        	config: scope.options
	        };	
        }

		$(elem).gridEditor(opts);
		wysiwygGridService.setGridElement($(elem));
		
		// $interval(function () {
  //       	var hasFocus = !! ($(elem).find(':focus').length > 0);
  //       	if (!hasFocus)
		// 		ngModel.$setViewValue($(elem).gridEditor('getHtml'));
		// }, 5000);
	};
	
	return {
		restrict: "EA",
		replace: true,
		link: linkFn,
		scope: {
			editor: "@",
			options: "="
		}
	};
}]);
