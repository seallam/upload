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
				
				var root = $(selector);
				
				var _selector = selectorPattern.exec(selector)[0];
				config = config || {
					multiple : false,
					name : 'imgs',
					accept : 'image/jpeg, image/png, image/gif, application/pdf',
					desc : '仅支持JPG，GIF，PNG及PDF文件，且需小于2M'
				};
				config.id = _selector;
				config.selector = selector;
				if (root) {
					
					var previewBtn = $('<a></a>').addClass('example-image-link hide').attr('href', "").data('lightbox', 'example-set').data('title', '').attr('id', _selector + '_btn');
					var previewImg = $('<img>').attr('id', selector + '_preview').width('200').attr('name', _selector + '_pic');
					previewBtn.append(previewImg);
					root.append(previewBtn);
					
					var uploadBtn = $('<div></div>').addClass('btn btn-default btn-xs btn-expense-file-upload');
					var uploadInput = $('<input type="hidden" value="">').attr('id', _selector+'_hidden').attr('name', _selector);
					var uploadFileInput = $('<input type="file">').attr('multiple', config.multiple).attr('id', _selector).attr('name', config.name).attr('accept', 'image/jpeg, image/png, image/gif, application/pdf').data('status', '0').addClass('upload-btn');
					uploadFileInput.on('change', function(e) {
						vc3Upload.fn.uploadFiles(e, config, this);
					});
					var uploadSpan = $('<span></span>').text('上传');
					uploadBtn.append(uploadInput);
					uploadBtn.append(uploadFileInput);
					uploadBtn.append(uploadSpan);
					root.append(uploadBtn);
					
					var deleteBtn = $('<div></div>').addClass('btn btn-danger btn-xs del-btn hide');
					root.append(deleteBtn);
					
					var desc = $('<p></p>').attr('id', 'description').addClass('gray').css('vertical-align', 'top').css('font-size', '12px').text(config.desc);
					root.append(desc);
					
					var errorSpan = $('<span></span>').attr('id', _selector+'-msg').addClass('help-block');
					root.append(errorSpan);
				}
				return root;
			},

			uploadFiles : function(e, config, obj) {
				var _input = $(obj).clone();
				
				var type = $(obj).attr('id');
				var files = e.target.files;
				
				vc3Upload.fn.removeErrorTips(config, type);
				
				if (files.length == 0) {
					$(obj).parent().parent().parent().addClass('has-error');
					$('#' + type + '-msg').text('你取消了文件上传,请重新选择文件');
					$('#' + type + '_preview').attr('src', '');
					$('#' + type + '_preview').css('display', 'none');
					$(obj).next().text('重新上传');
					$(obj).parent().parent().find('.example-image-link').css('display', 'none');
				} else {
					try {
						// Get a reference to the fileList
						var files = !!obj.files ? obj.files : [];
						
						// If no files were selected, or no FileReader support, return
						if (!files.length || !window.FileReader)
							return;
						
						for (var i = 0; i < files.length; i++) {
							var size = files[i].size;
							if (size > 2097152) {// 当上传文件大小超出限制时
								// $(this).next().find('.upload_response').show();
								$(obj).parent().parent().parent().addClass('has-error');
								$('#' + type + '-msg').text('文件大小超出限制');
								
								$('#' + type + '_preview').attr('src', '');
								$('#' + type + '_preview').css('display', 'none');
								$(obj).next().text('重新上传');
								$(obj).val('');
								return;
							}
						}
						// console.log(files.item(0).getAsDataURL());
						// Only proceed if the selected file is an image
						if (/^image/.test(files[0].type) || files[0].type === 'application/pdf') {// 判断上传文件类型,是图片类型或者是pdf格式
							
							// Create a new instance of the FileReader
							var reader = new FileReader();
							
							// Read the local file as a DataURL
							reader.readAsDataURL(files[0]);
							
							// When loaded, set image data as background of div
							reader.onloadend = function() {
								if ((config.callback && typeof(config.callback) === "function")) {
									config.callback();
								}
//								$.ajaxFileUpload({
//									url : webContext + 'admin/certify/ajaxUpload.do', // 用于文件上传的服务器端请求地址
//									type : 'post',
//									secureuri : false, // 一般设置为false
//									data : {
//										type : type
//									},
//									fileElementId : type, // 文件上传空间的id属性 <input type="file" id="file" name="file" />
//									dataType : 'json', // 返回值类型 一般设置为json
//									complete : function() {// ajax complete
//										$('#'+type).remove();//由于html本身机制问题,完成上传后需要将input移除,重新添加一个
//										$('#'+type+'_hidden').after(_input); // 重新在表单插入input
//										_input.attr('status', '1');// 通过status 进行表单验证,1为已经完成上传,0为未上传过
//										_input.on('change', uploadFile);// 为新添加的节点添加监听事件
//										removeErrorTips(type);// 执行移除验证提示方法
//									},
//									success : function(data, status) {// 服务器成功响应处理函数
//										if (data.result === 'success') {
//											var customerId = $('input[name=customerId]').val();
//											var file = skinBasePath + /*data.path + 'certifyTemp/'*/data.tempPath + customerId + '/' + type + '/' + data.fileName;
//											$('#' + type + '_hidden').val(data.fileName);
//											if (/^image/.test(files[0].type)) {
//												$('#'+type+"_pdf").hide();
//												$('#' + type + '_preview').css('display', 'block');
//												$('#' + type + '_preview').attr('src', file);
//												$('#' + type + '_btn').show();
//												$('#' + type + '_btn').attr('href', file);
//											} else {
//												$('#' + type + '_btn').hide();
//												$('#' + type + '_preview').css('display', 'none');
//												var success = new PDFObject({ url: file }).embed(type+"_pdf");
//												$('#'+type+"_pdf").show();
//											}
//											$('#' + type + '_preview').parent().parent().find('.upload_text').text('重新上传');
//											$('#' + type + '_preview').parent().parent().find('.del-btn').show();
//										} else {// 后台上传出错
//											errorOccur(type);
//										}
//									},
//									error : function(data, status, e) {// 服务器响应失败处理函数
//										errorOccur(type);
////										console.log(data);
////										console.log(e);
//									}
//								});
								
							}
						}
					} catch (e) {
						vc3Upload.fn.onErrorOccur(config);
					}
				}
			},
			
			ajaxUpload : function() {
				
			},
			
			onErrorOccur : function(config) {
				$(config.selecotr).parent().parent().parent().addClass('has-error');
				$(config.selecotr + '-msg').text('上传文件出现错误,请重新上传');
				$(config.selector).next().text('重新上传');
			},
			
			removeErrorTips : function(config) {
				if ($(config.selector).parent().parent().parent().hasClass('has-error')) {
					$(config.selector).parent().parent().parent().removeClass('has-error');
				}
				$(config.selector + '-msg').text('');
//				$(config.selector + '-msg').css('display', 'none');
				$(config.selector + '-msg').addClass('hide');
				$(config.selector + '-msg').next().text('');
//				$(config.selector + '-msg').next().css('display', 'none');
				$(config.selector + '-msg').next().addClass('hide');
			}
		}
		vc3Upload.fn.init.prototype = vc3Upload.fn;

		return vc3Upload;
	});

	// 暴露到全局
	window.vc3Upload = vc3Upload();
})(window);