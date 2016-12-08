$(function () {
    $.extend($.summernote.plugins, {
        'fontWeight': function (context) {
            var self = this;

            var ui = $.summernote.ui;
            var layoutInfo = context.layoutInfo;
            var $editable = layoutInfo.editable;

            if (typeof context.options.fontWeight === "undefined") {
                context.options.fontWeight = {};
            }

            if (typeof context.options.fontWeight.types === "undefined") {
                context.options.fontWeight.types = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
            }

            context.memo("button.fontWeight", function () {
                var buttonGroup = ui.buttonGroup([
                    ui.button({
                        className: "dropdown-toggle",
                        contents: '<span style="margin-right:8px">Weight</span><span class="caret"></span>',
                        tooltip: "Font Weight",
                        data: {
                            toggle: "dropdown"
                        }
                    }),
                    ui.dropdown({
                        className: "dropdown-style scrollable-menu",
                        items: context.options.fontWeight.types,
                        template: function (item) {
                            if (typeof item === "string") {
                                item = {tag: "div", title: item, value: item};
                            }

                            var tag = item.tag;
                            var title = item.title;
                            var style = item.style ? ' style="' + item.style + '" ' : "";
                            var cssclass = item.value ? ' class="' + item.value + '" ' : "";
                   
                            return "<" + tag + " " + style + cssclass + ">" + title + "</" + tag + ">";
                        },
                        click: function (event, namespace, value) {
                            event.preventDefault();
                            value = value || $(event.target).closest("[data-value]").data("value");

                            var $node = $(context.invoke("restoreTarget"));

                            if ($node.length === 0){
                                $node = $(document.getSelection().focusNode.parentElement, ".note-editable");
                            }
                            
                            if (typeof context.options.fontWeight !== "undefined" && typeof context.options.fontWeight.debug !== "undefined" && context.options.fontWeight.debug) {
                                console.debug(context.invoke("restoreTarget"), $node, "toggling class: " + value, window.getSelection());
                            }

                            $node.css({ "font-weight": value });
                        }
                    })
                ]);

                return buttonGroup.render();
            });
        }
    });
});