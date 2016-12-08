$(function () {
    $.extend($.summernote.plugins, {
        'responsiveMedia': function (context) {
            var self = this;

            var ui = $.summernote.ui;
            var layoutInfo = context.layoutInfo;
            var $editable = layoutInfo.editable;

            context.memo("button.responsiveImage", function () {
                var button = ui.button({
                    contents: '<i class="fa fa-play-circle-o"/>',
                    tooltip: "Responsive Image",
                    click: function () {
                        self.$mediaModal.modal("show");
                    }
                });

                var btn = button.render();
                return btn;
            });

            this.htmlString = "";

            this.initialize = function () {
                var template = '<div class="modal fade summernote-responsive-image">' +
                                    '<div class="modal-dialog modal-lg">' +
                                        '<div class="modal-content">' +
                                            '<div class="modal-header">' +
                                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                                    '<span aria-hidden="true">&times;</span>' +
                                                '</button>' +
                                                '<h4 class="modal-title">Add Responsive Media</h4>' +
                                            "</div>" +
                                            '<div class="modal-body">' +
                                                '<h4>Mobile image</h4>' +
                                                '<form class="summernote-responsive-image-upload-mob" name="summernote-responsive-image-upload-mob" action="javascript:;" enctype="multipart/form-data" method="post" accept-charset="utf-8">' +
                                                    '<div class="row">' +
                                                        '<div class="col-xs-8">' +
                                                            '<input name="media" class="form-control summernote-responsive-image-upload-file" type="file">' +
                                                        '</div>' +
                                                        '<div class="col-xs-4">' +
                                                            '<input class="btn btn-default btn-block summernote-responsive-image-upload-btn" type="button" value="Upload" />' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</form>' +

                                                '<h4>Tablet image</h4>' +
                                                '<form class="summernote-responsive-image-upload-tab" name="summernote-responsive-image-upload-mob" action="javascript:;" enctype="multipart/form-data" method="post" accept-charset="utf-8">' +
                                                    '<div class="row">' +
                                                        '<div class="col-xs-8">' +
                                                            '<input name="media" class="form-control summernote-responsive-image-upload-file" type="file">' +
                                                        '</div>' +
                                                        '<div class="col-xs-4">' +
                                                            '<input class="btn btn-default btn-block summernote-responsive-image-upload-btn" type="button" value="Upload" />' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</form>' +

                                                '<h4>Desktop image</h4>' +
                                                '<form class="summernote-responsive-image-upload-dtop" name="summernote-responsive-image-upload-mob" action="javascript:;" enctype="multipart/form-data" method="post" accept-charset="utf-8">' +
                                                    '<div class="row">' +
                                                        '<div class="col-xs-8">' +
                                                            '<input name="media" class="form-control summernote-responsive-image-upload-file" type="file">' +
                                                        '</div>' +
                                                        '<div class="col-xs-4">' +
                                                            '<input class="btn btn-default btn-block summernote-responsive-image-upload-btn" type="button" value="Upload" />' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</form>' +

                                                '<hr />' +
                                                '<div class="btn btn-secondary btn-block summernote-responsive-image--submit">' +
                                                    'SUBMIT' +
                                                '</div>' +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>";

                $($editable).closest(".note-editing-area").after(template);

                self.$mediaModal = $($editable).closest(".note-editor").find(".summernote-responsive-image").modal({
                    show: false
                });

                self.$mediaModal.find(".summernote-responsive-image--submit").on("click", function () {
                    var node = $("<p>" + self.htmlString + "</p>")[0];
                    $editable.append(node);

                    self.$mediaModal.find(".summernote-responsive-image-upload-mob").find(".summernote-responsive-image-upload-btn").removeClass("btn-success");
                    self.$mediaModal.find(".summernote-responsive-image-upload-mob").find(".summernote-responsive-image-upload-btn").addClass("btn-secondary");
                    self.$mediaModal.find(".summernote-responsive-image-upload-tab").find(".summernote-responsive-image-upload-btn").removeClass("btn-success");
                    self.$mediaModal.find(".summernote-responsive-image-upload-tab").find(".summernote-responsive-image-upload-btn").addClass("btn-secondary");
                    self.$mediaModal.find(".summernote-responsive-image-upload-dtop").find(".summernote-responsive-image-upload-btn").removeClass("btn-success");
                    self.$mediaModal.find(".summernote-responsive-image-upload-dtop").find(".summernote-responsive-image-upload-btn").addClass("btn-secondary");

                    self.$mediaModal.find(".summernote-responsive-image-upload-mob").find(".summernote-bootstrap-media-upload").find("input[type='file']").val(null);
                    self.$mediaModal.find(".summernote-responsive-image-upload-tab").find(".summernote-bootstrap-media-upload").find("input[type='file']").val(null);
                    self.$mediaModal.find(".summernote-responsive-image-upload-dtop").find(".summernote-bootstrap-media-upload").find("input[type='file']").val(null);

                    self.htmlString = null;

                    self.$mediaModal.modal("hide");
                });

                // mobile image
                self.$mediaModal.find(".summernote-responsive-image-upload-mob").on("click", ".summernote-responsive-image-upload-btn", function () {
                    var fileItem = self.$mediaModal.find(".summernote-responsive-image-upload-mob").find("input[type='file']").val();
                    if (!fileItem) return;

                    // block dialog to prevent unwanted clicks
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

                    // prepare file item
                    var uploadUrl = window.blogApiUrl + "media/media";
                    var formData = new FormData();
                    $.each(self.$mediaModal.find(".summernote-responsive-image-upload-mob").find("input[type='file']"), function (i, file) {
                        formData.append("image", file ? (file.files && file.files.length > 0 ? file.files[0] : null) : null);
                    });

                    // post that shit!
                    $.ajax({
                        url: uploadUrl,
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function (request) {
                            request.setRequestHeader("Authorization", "Bearer " + window.authToken);
                        },
                        success: function (resp) {
                            self.htmlString += '<img src="' + resp + '" class="visible-xs" style="width:100%" />';
                            self.$mediaModal.find(".modal-dialog").unblock();
                            self.$mediaModal.find(".summernote-responsive-image-upload-mob").find(".summernote-responsive-image-upload-btn").removeClass("btn-secondary");
                            self.$mediaModal.find(".summernote-responsive-image-upload-mob").find(".summernote-responsive-image-upload-btn").addClass("btn-success");
                        },
                        error: function (xhr, status, error) {
                            toastr.error("Your file upload failed. You gotta try again! You have to!", "Failed!");
                            console.log(xhr, status, error);
                        }
                    });
                });

                // tablet image
                self.$mediaModal.find(".summernote-responsive-image-upload-tab").on("click", ".summernote-responsive-image-upload-btn", function () {
                    var fileItem = self.$mediaModal.find(".summernote-responsive-image-upload-tab").find("input[type='file']").val();
                    if (!fileItem) return;

                    // block dialog to prevent unwanted clicks
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

                    // prepare file item
                    var uploadUrl = window.blogApiUrl + "media/media";
                    var formData = new FormData();
                    $.each(self.$mediaModal.find(".summernote-responsive-image-upload-tab").find("input[type='file']"), function (i, file) {
                        formData.append("image", file ? (file.files && file.files.length > 0 ? file.files[0] : null) : null);
                    });

                    // post that shit!
                    $.ajax({
                        url: uploadUrl,
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function (request) {
                            request.setRequestHeader("Authorization", "Bearer " + window.authToken);
                        },
                        success: function (resp) {
                            self.htmlString += '<img src="' + resp + '" class="visible-sm visible-md" style="float: left; width:25%; margin: 1.4em 3em 1em 0;" />';
                            self.$mediaModal.find(".modal-dialog").unblock();
                            self.$mediaModal.find(".summernote-responsive-image-upload-tab").find(".summernote-responsive-image-upload-btn").removeClass("btn-secondary");
                            self.$mediaModal.find(".summernote-responsive-image-upload-tab").find(".summernote-responsive-image-upload-btn").addClass("btn-success");
                        },
                        error: function (xhr, status, error) {
                            toastr.error("Your file upload failed. You gotta try again! You have to!", "Failed!");
                            console.log(xhr, status, error);
                        }
                    });
                });

                // desktop image
                self.$mediaModal.find(".summernote-responsive-image-upload-dtop").on("click", ".summernote-responsive-image-upload-btn", function () {
                    var fileItem = self.$mediaModal.find(".summernote-responsive-image-upload-dtop").find("input[type='file']").val();
                    if (!fileItem) return;

                    // block dialog to prevent unwanted clicks
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

                    // prepare file item
                    var uploadUrl = window.blogApiUrl + "media/media";
                    var formData = new FormData();
                    $.each(self.$mediaModal.find(".summernote-responsive-image-upload-dtop").find("input[type='file']"), function (i, file) {
                        formData.append("image", file ? (file.files && file.files.length > 0 ? file.files[0] : null) : null);
                    });

                    // post that shit!
                    $.ajax({
                        url: uploadUrl,
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        beforeSend: function (request) {
                            request.setRequestHeader("Authorization", "Bearer " + window.authToken);
                        },
                        success: function (resp) {
                            self.htmlString += '<img src="' + resp + '" class="visible-lg" style="float: left; width:25%; margin: 1.4em 3em 1em 0;" />';
                            self.$mediaModal.find(".modal-dialog").unblock();
                            self.$mediaModal.find(".summernote-responsive-image-upload-dtop").find(".summernote-responsive-image-upload-btn").removeClass("btn-secondary");
                            self.$mediaModal.find(".summernote-responsive-image-upload-dtop").find(".summernote-responsive-image-upload-btn").addClass("btn-success");
                        },
                        error: function (xhr, status, error) {
                            toastr.error("Your file upload failed. You gotta try again! You have to!", "Failed!");
                            console.log(xhr, status, error);
                        }
                    });
                });
            };

            this.destroy = function () {
                this.$mediaModal.remove();
            };
        }
    });
});