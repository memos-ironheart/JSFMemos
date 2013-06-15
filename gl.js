memos.define([],'memos.gl',{
	init: function($) {
		this.onReady = function (canvNode,execFun,noGLFun) {
			if(memos.hasCanvas && memos.hasWebGL) {
				var methods = ['webgl','moz-webgl','webkit-3d','experimental-webgl'];
				for(var i = 0;!memos.gl.context&&i<methods.length;++i) {
					try { memos.gl.context = canvNode.getContext(methods[i]) }
					catch(e){memos.gl.context=null}
				}
				if (memos.gl.context) execFun(memos.gl.context);
				else if(memos.isFun(noGLFun)) noGLFun(memos)
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
		if (typeof this.loadedFShaders[name] === 'undefined') {
			memos.request({success:function(resp){
				memos.gl.loadedFShaders[name] = resp.responseText
			}},fshader,false);
		}
		return this.loadedFShaders[name]
	},
	loadVShader:function(name){
		var vshader = memos.config.glshaderspath + '/' + name.replace(/\./g, '/') + '.v';
		if (typeof this.loadedVShaders[name] === 'undefined') {
			memos.request({success:function(resp){
				memos.gl.loadedVShaders[name] = resp.responseText
			}},vshader,false);
		}
		return this.loadedVShaders[name]
	}
});
memos.libLoaded();
