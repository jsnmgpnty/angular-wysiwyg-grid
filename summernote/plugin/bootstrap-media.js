$(function () {
    $.extend($.summernote.plugins, {
        'bootstrapMedia': function (context) {
            var self = this;

            var ui = $.summernote.ui;
            var layoutInfo = context.layoutInfo;
            var $editable = layoutInfo.editable;

            context.memo("button.bootstrapMedia", function () {
                var button = ui.button({
                    contents: '<i class="fa fa-photo"/>',
                    tooltip: "Media Group",
                    click: function () {
                        self.refreshMedia();
                    }
                });

                var btn = button.render();
                return btn;
            });

            this.initialize = function () {
                var template = '<div class="modal fade summernote-bootstrap-media">' +
                                    '<div class="modal-dialog modal-lg">' +
                                        '<div class="modal-content">' +
                                            '<div class="modal-header">' +
                                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                                                '<h4 class="modal-title">Add Images</h4>' +
                                            "</div>" +
                                            '<div class="modal-body">' +
                                                '<div class="row media-items--list"></div>' +
                                            "</div>" +
                                            '<div class="modal-footer">' +
                                                '<form class="summernote-bootstrap-media-upload" name="summernote-bootstrap-media-upload" action="javascript:;" enctype="multipart/form-data" method="post" accept-charset="utf-8">' +
                                                    '<div class="row">' +
                                                        '<div class="col-xs-12 col-md-8">' +
                                                            '<input name="media" class="form-control summernote-bootstrap-media-upload-file" type="file">' +
                                                        '</div>' +
                                                        '<div class="col-xs-6 col-md-2">' +
                                                            '<input class="btn btn-default btn-block summernote-bootstrap-media-upload-btn" type="button" value="Upload" />' +
                                                        '</div>' +
                                                        '<div class="col-xs-6 col-md-2">' +
                                                            '<button type="button" class="btn btn-unhappy btn-block" data-dismiss="modal">Close</button>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</form>' +
                                                
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>";

                $($editable).closest(".note-editing-area").after(template);

                self.$mediaModal = $($editable).closest(".note-editor").find(".summernote-bootstrap-media").modal({
                    show: false
                });

                self.$mediaModal.find(".media-items--list").on("click", ".media-item", function () {
                    var imageUrl = $(this).data("url");
                    var node = $('<img src="' + imageUrl + '" alt="' + imageUrl + '" />')[0];
                    $editable.append(node);

                    self.$mediaModal.modal("hide");
                });

                self.$mediaModal.find(".summernote-bootstrap-media-upload-btn").on("click", function () {
                    var fileItem = self.$mediaModal.find(".summernote-bootstrap-media-upload").find("input[type='file']").val();
                    if (!fileItem) return;

                    self.$mediaModal.find(".modal-dialog").block({
                        message: '<div class="loader"><i class="fa fa-spinner fa-spin fa-3x"></i></div>',
                        css: {
                            width: "100%",
                            left: "50%",
                            border: "none",
                            padding: "30px",
                            backgroundColor: "#fff",
                            color: "#fff"
                        }
                    });

                    var uploadUrl = window.blogApiUrl + "media/media";

                    var formData = new FormData();
                    $.each(self.$mediaModal.find(".summernote-bootstrap-media-upload").find("input[type='file']"), function (i, file) {
                        formData.append("image", file ? (file.files && file.files.length > 0 ? file.files[0] : null) : null);
                    });

                    $.ajax({
                        url: uploadUrl,
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function (request) {
                            request.setRequestHeader("Authorization", "Bearer " + window.authToken);
                        },
                        success: function () {
                            self.$mediaModal.find(".summernote-bootstrap-media-upload").find("input[type='file']").val(null);
                            self.refreshMedia();
                        },
                        error: function (xhr, status ,error) {
                            toastr.error("Your file upload failed. You gotta try again! You have to!", "Failed!");
                            console.log(xhr, status, error);
                        }
                    });
                });
            };

            this.refreshMedia = function () {
                var url = window.blogApiUrl + "media/all";
                self.$mediaModal.find(".media-items--list > div").remove();
                self.$mediaModal.find(".modal-dialog").block({
                    message: '<div class="loader"><i class="fa fa-spinner fa-spin fa-3x"></i></div>',
                    css: {
                        width: "100%",
                        left: "50%",
                        border: "none",
                        padding: "30px",
                        backgroundColor: "#fff",
                        color: "#fff"
                    }
                });

                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "json",
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", "Bearer " + window.authToken);
                    },
                    success: function (response) {
                        for (var i = 0; i < response.length; i++) {
                            var itemTemplate =
                                '<div class="col-xs-12 col-sm-6 col-md-4">' +
                                    '<div class="media-item card card-default" data-url="' + response[i].url + '">' +
                                        '<div class="media-item--thumbnail" style="background-image: url(\'' + response[i].url + '\');"></div>' +
                                        '<div class="media-item--description">' +
                                            "<span>" + response[i].fileName + "</span>" +
                                        '</div>' +
                                    '</div>' +
                                "</div>";

                            self.$mediaModal.find(".media-items--list").append(itemTemplate);
                        }
                        self.$mediaModal.modal("show");
                        self.$mediaModal.find(".modal-dialog").unblock();
                    },
                    error: function (error) {
                        toastr.error(error.Message || error.message || error);
                        self.$mediaModal.find(".modal-dialog").unblock();
                    }
                });
            };

            this.destroy = function () {
                this.$mediaModal.remove();
            };
        }
    });
});