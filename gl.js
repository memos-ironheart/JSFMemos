memos.define([],'memos.gl',{
	init: function() {
		memos.whenGL = function (canvNode,execFun) {
			if(memos.hasCanvas && memos.hasWebGL) {
				var methods = ['webgl','moz-webgl','webkit-3d','experimental-webgl'];
				for(var i = 0;!memos.gl.context&&i<methods.length;++i) {
					try { memos.gl.context = canvNode.getContext(methods[i]) }
					catch(e){memos.gl.context=null}
				}
				if (memos.gl.context) execFun();
			}
		}
	},
	reqAnFr:(function(){return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback,element){return window.setTimeout(callback, 1000/60)}})(),
	canAnFr:(function(){return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.clearTimeout})(),
	context:null,
	loadedFShaders:{},
	loadedVShaders:{},
	loadFShader:function(name){
		var fshader = memos.config.glshaderspath + '/' + name.replace(/\./g, '/') + '.f';
		if (typeof this.loadedFShaders[fshader] === 'undefined') {
			memos.request({success:function(resp){
				memos.gl.loadedFShaders[fshader] = resp.responseText
			}},fshader,false);
		}
		return this.loadedFShaders[fshader]
	},
	loadVShader:function(name){
		var vshader = memos.config.glshaderspath + '/' + name.replace(/\./g, '/') + '.v';
		if (typeof this.loadedVShaders[vshader] === 'undefined') {
			memos.request({success:function(resp){
				memos.gl.loadedVShaders[vshader] = resp.responseText
			}},fshader,false);
		}
		return this.loadedVShaders[vshader]
	}
});
memos.libLoaded();
