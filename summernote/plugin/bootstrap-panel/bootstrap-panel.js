$(function () {
  $.extend($.summernote.plugins, {
    'bootstrapPanel': function (context) {
      var self = this;

      var ui = $.summernote.ui;

      context.memo('button.bootstrapPanel', function () {
        var button = ui.buttonGroup([
          ui.button({
            className: 'dropdown-toggle',
            contents: '<span class="fa fa-building"></span> <span class="caret"></span>',
            tooltip: "Bootstrap Panels",
            data: {
              toggle: 'dropdown'
            }
          }),
          ui.dropdown({
            className: 'dropdown-style',
            contents: 
              "<ul>" +
                "<li data-type='panel-default'>Default</li>" +
                "<li data-type='panel-primary'>Primary</li>" + 
                "<li data-type='panel-success'>Success</li>" + 
                "<li data-type='panel-danger'>Danger</li>" + 
                "<li data-type='panel-warning'>Warning</li>" + 
                "<li data-type='panel-info'>Info</li>" + 
              "</ul>",
            callback: function ($dropdown) {
              $dropdown.find('li').each(function () {
                $(this).click(function() {
                  var attr = $(this).data("type");
                  var node = $('<div class="panel ' + attr + '"><div class="panel-heading">Title</div><div class="panel-body">Body</div></div>')[0]
                  context.invoke("editor.insertNode", node);
                });
              });
            }
          })
        ]);

        var bootstrapPanelButton = button.render();
        return bootstrapPanelButton;
      });
    }
  });
});