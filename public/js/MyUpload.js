(function($) {       
	$.fn.MyUpload = function() {
	     var _this=$(this);
	     t_arr = [] ;
	     //console.log(_this);
	     _this.data("total",0);
	     _this.data("loaded",0);
	     _this.bind("dragenter",function(e){
	    	 e.stopPropagation();
	    	 e.preventDefault();
	     });
	     _this.bind("dragover",function(e){
	    	 e.originalEvent.dataTransfer.dropEffect="copy";
	    	 e.stopPropagation();
	    	 e.preventDefault();
	     });

	     var Utilty={
	    		 
	    	 _uploadBlocks:function uploadBlocks(files,len){
	    	 		 var blocks_len=100;
	    	 		 var arr = [];
	    	 		 for(var i=0;i<blocks_len && i<len;i++){
	    	 			 if(!files[i]){
	    	 				 continue;
	    	 			 }else{
	    	 				 console.log(files[i]);
	    	 			 }
	    	 			 arr[i]=(function(file){
	    	 				 return function(){
	    	 					Utilty._upload(file);
	    	 				 }
	    	 			 })(files[i]);
	    	 		 }
	    	 		var dfd=$.Deferred();
	    	 		dfd.done(arr);
	    	 		dfd.resolve();
	    	 		 
	    	 },
	    	 _uploadFiles:function uploadFiles(files,len){
	    	 		 var form=new FormData();
	    	 		 var file=files.shift();
	    	 		 form.append("grand",file,file.name);
					 form.append("relativePath",file.relativePath);
					 //form.append("folderName","test");
					 var xhr = new XMLHttpRequest();
					 xhr.open("post", "Upload", true);
					 xhr.onload = function() {
						 var progress=parseInt((len-files.length)/len*100, 10);
						 //console.log(len-files.length);
						 t_arr.push(Date.now());
						 $('.progress .bar').css(
		            			'width',
		           				 progress + '%'
		        		 );
						 if(files.length==0){
							 console.log("上传完成");
							 console.log(new Date());
							 return
						 }
						 //console.log(file.name);
						 xhr.open("post", "Upload", true);
						 file=files.shift();
						 form=new FormData();
		    	 		 form.append("grand",file,file.name);
						 form.append("relativePath",file.relativePath);
						 //form.append("folderName","test");
						 xhr.send(form);						 
					 };
					 xhr.send(form);
	    	 },
	    	 _upload:function upload(file){
			    	 var form = new FormData();
			    	 //console.log(file.size);
			    	 var dfd=$.Deferred();
					 form.append("grand",file,file.name);
					 form.append("relativePath",file.relativePath);
					 //form.append("folderName","test");
					 // XMLHttpRequest 对象
					 var xhr = new XMLHttpRequest();
					 xhr.open("post", "Upload", true);
					 xhr.onload = function() {
						 //console.log("上传完成!");
						 //$(".modal.oper").modal("hide");
						 //$(".btn.fresh").trigger("click");
						 t_arr.push(Date.now());
						 var total=_this.data("total");
						 var loaded=_this.data("loaded");
						 loaded+=file.size;
						 _this.data("loaded",loaded);
						 var progress = parseInt(loaded / total * 100, 10);
		       			 $('.progress .bar').css(
		            			'width',
		           				 progress + '%'
		        		 );
						 dfd.resolve();
					 };
					 xhr.onerror=function(){
						 //console.log("err");
						 //console.log(file.name);
					 }
					 var obj=xhr.upload;					 
					 $(obj).bind("progress",function(e){
						 e=e.originalEvent;
						 var total=_this.data("total");
						 var loaded=_this.data("loaded");
						 var position=e.position+loaded;
						 //_this.data("loaded",position);
						 var progress = parseInt(position / total * 100, 10);
		       			 $('.progress .bar').css(
		            			'width',
		           				 progress + '%'
		        		 );
					 });
					console.log(_this.data("total"));
					xhr.send(form);
					return dfd.promise();
			     },
	    	 _handleFileTreeEntry: function (entry, path) {
		            var that = this,
		                dfd = $.Deferred(),
		                errorHandler = function (e) {
		                    if (e && !e.entry) {
		                        e.entry = entry;
		                    }
		                    // Since $.when returns immediately if one
		                    // Deferred is rejected, we use resolve instead.
		                    // This allows valid files and invalid items
		                    // to be returned together in one set:
		                    dfd.resolve([e]);
		                },
		                dirReader;
		            path = path || '';
		            if (entry.isFile) {
		                if (entry._file) {
		                    // Workaround for Chrome bug #149735
		                    entry._file.relativePath = path;
		                    var size=_this.data("total");
		                    size=~~size;
		                    size+=~~entry._file.size;
		                    _this.data("total",size);
		                    dfd.resolve(entry._file);
		                } else {
		                    entry.file(function (file) {
		                        file.relativePath = path;
		                        var size=~~_this.data("total");
		                    	size+=file.size;
		                    	_this.data("total",size);
		                    	//console.log(file);
		                        dfd.resolve(file);
		                    }, errorHandler);
		                }
		            } else if (entry.isDirectory) {
		            	//console.log(entry);
	            		dirReader = entry.createReader();
		                dirReader.readEntries(function (entries) {
		                    that._handleFileTreeEntries(
		                        entries,
		                        path + entry.name + '/'
		                    ).done(function (files) {
		                    	//console.log(files);
		                        dfd.resolve(files);
		                    }).fail(errorHandler);
		                }, errorHandler);		            		
		                
		            } else {
		                // Return an empy list for file system items
		                // other than files or directories:

		            	dfd.resolve([]);
		            }
		            return dfd.promise();
		        },
		
		        _handleFileTreeEntries: function (entries, path) {
		            var that = this;
		            return $.when.apply(
		                $,
		                $.map(entries, function (entry) {
		                	//console.log(entry);
		                    return that._handleFileTreeEntry(entry, path);
		                })
		            ).pipe(function () {
		            	//console.log(arguments);
		                return Array.prototype.concat.apply(
		                    [],
		                    arguments
		                );
		            });
		        },
		        _getDroppedFiles: function (dataTransfer) {
		            dataTransfer = dataTransfer || {};
		            var items = dataTransfer.items;
		            if (items && items.length && (items[0].webkitGetAsEntry ||
		                    items[0].getAsEntry)) {
		                return this._handleFileTreeEntries(
		                    $.map(items, function (item) {
		                        var entry;
		                        //console.log(item);
		                        if (item.webkitGetAsEntry) {
		                            entry = item.webkitGetAsEntry();
		                            if (entry) {
		                                // Workaround for Chrome bug #149735:
		                                entry._file = item.getAsFile();
		                            }
		                            return entry;
		                        }
		                        return item.getAsEntry();
		                    })
		                );
		            }
		            return $.Deferred().resolve(
		                $.makeArray(dataTransfer.files)
		            ).promise();
		        },
	     };
	     _this.bind("drop",function(e){
	    	 e.stopPropagation();
	    	 e.preventDefault();
	    	 e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var that = this,
                dataTransfer = e.dataTransfer,
                data = {};
            //console.log(dataTransfer.files);
            //console.log("开始计算文件数量");
            if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                e.preventDefault();
                Utilty._getDroppedFiles(dataTransfer).always(function (files) {
                    data.files = files;
                    _this.data("files",files);
                    //等所有上传工作完成之后再弹出上传成功的消息
                    /*
                    $.when.apply(
		                $,
		                $.map(files,function(file){
		                	 Utilty._upload(file);
		                })).done(function(){
		                	//alert("上传成功");
		                	console.log(ppp);
		                });
		            */
                    //console.log(new Date());
                    //console.log(Date.now());
                    //Utilty._uploadFiles(files,files.length);
                    
                    //Utilty._uploadBlocks(files,files.length);//一个一个上传的方法
                });
            }
	     });
		function getFileBlocks(file,callback) {
			$.ajax({
                url: "../GetBlocks",
 				type: "GET",
 				data: {
 					"fpath": file,
 					'size': 300
 				},
 				success: callback
			});				
		}
		_this.parent().next().find(".upload").bind("click", function(){
			var files =  _this.data("files") || file;
			$(this).addClass("disabled");
            var rsync=$(".navbar").data("test");
            var start_time = Date.now();
            console.log(start_time);
			$.when.apply(
	            $,
	            $.map(files,function(file){
	            	//Utilty._upload(file);
	            	//console.log(file.relativePath+file.name);
	            	if(file.relativePath.indexOf(".svn") >=0 || file.name.indexOf(".svn") >=0 ) {
	            		console.log("drop "+file.relativePath+file.name);
	            		return;
	            	}
	            	var f_path = file.relativePath+file.name;
	            	console.log(f_path);
	            	if(window.FileReader) {  
		                var fr = new FileReader();  
		                fr.onloadend = function(e) {
		                	//console.log(e.target.result);
		                	var str = e.target.result;
		                	str = str.trim();
		                	//console.log(str);
		                	//$(".content").removeClass("hide");  
		                    //$(".content").text(e.target.result);
		                    //$(".content").data("str",e.target.result);
		                    getFileBlocks(f_path, function(data) {
		                    	if(data["direct"]) {
		                    		console.log("太小");
		                    		return
		                    	}
		                    	//console.log(data["l"]);
	         					//console.log(data.l_md5);
	         					var result=rsync.send_blocks(str,300,data.l,data.l_md5,data.c);
	         					result["f-path"] = file.relativePath;
	         					result["f-name"] = file.name;
	         					//$(".navbar").data("result",res);
	         					//$(".btn-danger").trigger("assemble",[file, res]);
	         					console.log(result);
	         					$.ajax({
									url: "../Assemble",
			         				type: "POST",
			         				data: result,
			         				success:function(){
										console.log("成功");
										//t_arr.push(Date.now());	
			         				},
			         				fail: function() {
			         					console.log("失败:"+file.relativePath+file.name);
			         				} 
								});				
		                    });

		                };  
		                fr.readAsText(file);  
		            }
	            })).done(function(){
            	//alert("上传成功");
            		console.log(Date.now());
            	});
            //Utilty._uploadFiles(files,files.length);
            //Utilty._uploadBlocks(files,files.length);//一个一个上传的方法
			
		});
	};     
})(jQuery); 