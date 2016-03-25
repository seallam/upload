(function(window, undefined) {
	"use strict";
	var document = window.document;
	var $ = window.$;
	var vc3Upload = (function() {
		var vc3Upload = function(selector, config) {
			return new vc3Upload.fn.init(selector, config);
		}

		vc3Upload.fn = vc3Upload.prototype = {
			constructor : vc3Upload,

			init : function(selector, config) {
				var selectorPattern = /[^#]*$/;
				config = config || {
					multiple : false,
					name : 'imgs',
					accept : 'image/jpeg, image/png, image/gif, application/pdf',
					desc : '仅支持JPG，GIF，PNG及PDF文件，且需小于2M'
				};
				var _selector = selectorPattern.exec(selector)[0];
				var root = $(selector);
				
				var previewBtn = $('<a></a>').addClass('example-image-link hide').attr('href', "").data('lightbox', 'example-set').data('title', '').attr('id', _selector + '_btn');
				var previewImg = $('<img>').attr('id', selector + '_preview').width('200').attr('name', _selector + '_pic');
				previewBtn.append(previewImg);
				root.append(previewBtn);
				
				var uploadBtn = $('<div></div>').addClass('btn btn-default btn-xs btn-expense-file-upload');
				var uploadInput = $('<input type="hidden" value="">').attr('id', _selector+'_hidden').attr('name', _selector);
				var uploadFile = $('<input type="file">').attr('multiple', config.multiple).attr('id', _selector).attr('name', config.name).attr('accept', 'image/jpeg, image/png, image/gif, application/pdf').data('status', '0').addClass('upload-btn');
				var uploadSpan = $('<span></span>').text('上传');
				uploadBtn.append(uploadInput);
				uploadBtn.append(uploadFile);
				uploadBtn.append(uploadSpan);
				root.append(uploadBtn);
				
				var deleteBtn = $('<div></div>').addClass('btn btn-danger btn-xs del-btn hide');
				root.append(deleteBtn);
				
				var desc = $('<p></p>').attr('id', 'description').addClass('gray').css('vertical-align', 'top').css('font-size', '12px').text(config.desc);
				root.append(desc);
				
				var errorSpan = $('<span></span>').attr('id', _selector+'-msg').addClass('help-block');
				root.append(errorSpan);
			}

		}
		vc3Upload.fn.init.prototype = vc3Upload.fn;

		return vc3Upload;
	});

	// 暴露到全局
	window.vc3Upload = vc3Upload();
})(window);