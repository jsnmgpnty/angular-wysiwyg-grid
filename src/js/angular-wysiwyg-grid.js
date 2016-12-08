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
		
		var stop = $interval(function () {
			if (scope.model) {
				var html = $(elem).html();
				html = html.replace(" ", "");
				if (html) {
					$(elem).gridEditor(opts);
					wysiwygGridService.setGridElement($(elem));
					$interval.cancel(stop);
					stop = undefined;
				}
			} else {
				$(elem).gridEditor(opts);
				wysiwygGridService.setGridElement($(elem));
				$interval.cancel(stop);
				stop = undefined;
			}
		}, 500);
	};
	
	return {
		restrict: "EA",
		replace: true,
		link: linkFn,
		scope: {
			editor: "@",
			options: "=",
			model: "="
		}
	};
}]);
