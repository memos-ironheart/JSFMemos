// Author: Agamemnon Skepetaris -> <memos at Dragon's Paradise Networks>
// SUGGESTIONS ARE WELCOMED!!!
(function(){
	Object.prototype.elCache = {}
})()
var memos = {
	config: {
		glshaderspath: '/data/glshaders',
		libpath: '/common/scripts',
		async_enabled:true,
		ready_delay:1,
		sched_interval:10
	},
	hasWorker:!!Worker,
	hasCanvas:!!HTMLCanvasElement,
	hasWebGL:!!WebGLRenderingContext,
	__tStr:{}.toString,
	isFun:function(Obj) {
		return this.__tStr.call(Obj) == '[object Function]'
	},
	isStr:function(Obj) {
		return this.__tStr.call(Obj) == '[object String]'
	},
	isA:function(Obj) {
		return this.__tStr.call(Obj) == '[object Array]'
	},
	isO:function(Obj) {
		return this.__tStr.call(Obj) == '[object Object]'
	},
	isNull:function(Obj) {
		return this.__tStr.call(Obj) == '[object Null]'
	},
	isNum:function(Obj) {
		return this.__tStr.call(Obj) == '[object Number]'
	},
	reqObjs: {},
	newReqObj: function() {
		try {
			return new XMLHttpRequest()
		}
		catch(e1) {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP.6.0')
			}
			catch(e2) {
				try {
					return new ActiveXObject('Msxml2.XMLHTTP.4.0')
				}
				catch(e3) {
					try {
						return new ActiveXObject('Microsoft.XMLHTTP')
					}
					catch(e4) {
						try {
							return new ActiveXObject('Msxml2.XMLHTTP')
						}
						catch(e5) {
							try {
								return createRequest()
							}
							catch(e6) {
								return null
							}
						}
					}
				}
			}
		}
	},
	__arrelRegEx:/^[^,]+,/,
	shiftA:function(toShA){
		return toShA.toString().replace(this.__arrelRegEx,'').split(',')
	},
	request: function(onreadyO, uriStr, asyncBool, nosendBool, postdataStr) {
		if(typeof this.reqObjs[uriStr] === 'undefined') this.reqObjs[uriStr] = this.newReqObj();
		else return;
		if(postdataStr) {
			this.reqObjs[uriStr].onreadystatechange = function() {
				if(memos.reqObjs[uriStr].readyState != 4) return;
				else if(memos.reqObjs[uriStr].status == 200) {
					memos.reqObjs[uriStr].onreadystatechange = null;
					if(typeof onreadyO['success'] === 'undefined') onreadyO['success'](memos.reqObjs[uriStr])
				}
			}
			this.reqObjs[uriStr].open('POST', uriStr, asyncBool);
			try {
				this.reqObjs[uriStr].setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
			}
			catch(e) {
				throw ('When trying to set the content type to application/x-www-form-urlencoded.')
			}
			if(!nosendBool) this.reqObjs[uriStr].send(postdataStr);
		}
		else {
			this.reqObjs[uriStr].onreadystatechange = function() {
				if(memos.reqObjs[uriStr].readyState != 4) return;
				else if(memos.reqObjs[uriStr].status == 200) {
					memos.reqObjs[uriStr].onreadystatechange = null;
					if(typeof onreadyO['success'] !== 'undefined') onreadyO['success'](memos.reqObjs[uriStr])
				}
			};
			this.reqObjs[uriStr].open('GET', uriStr, asyncBool);
			if(!nosendBool) this.reqObjs[uriStr].send()
		}
	},
	__pLibs:0,
	libsInUse:{},
	usinglib: function(libnameStr) {
		var libfile = this.config.libpath + '/' + libnameStr.replace(/\./g, '/') + '.js';
		if(typeof this.libsInUse[libfile] === 'undefined') {
			++this.__pLibs;
			this.libsInUse[libfile] = this.putEl(this.createEl('script',{async:this.config.async_enabled,type:'application/javascript',src:libfile}),this.getEl('html,head'),'first')
		}		
	},
	libLoaded: function() {
		--this.__pLibs
	},
	define: function(requiredLibsA, libnameStr, valANY) {
		if((this.isA(requiredLibsA))?requiredLibsA.length:false) {
			this.usinglib(requiredLibsA.shift());
			this.define(requiredLibsA, libnameStr, valANY)
		} else {
			var names = libnameStr.split('.');
			if(names.length) return this.__define(valANY, names, window, names.shift())
		}
	},
	__define: function(valANY, __pA, __parentO, __childStr) {
		if(__pA.length) {
			if(typeof __parentO[__childStr] === 'undefined') __parentO[__childStr] = {};
			this.__define(valANY, __pA,__parentO[__childStr], __pA.shift())
		} else {
			if(typeof __parentO[__childStr] === 'undefined') {
				__parentO[__childStr] = valANY;
				if(this.isFun(__parentO[__childStr].init)) {
					__parentO[__childStr].init(this);
					delete __parentO[__childStr].init
				}
			} else {
				console.log('Tried to redefine \''+__childStr+'\'. Returning the previously defined variable.');
				return __parentO[__childStr];
			}
		}
	},
	createEl: function(tagnameStr, attrO) {
		var el = document.createElement(tagnameStr);
		this.setAttr(el, attrO);
		return el
	},
	putEl: function(thisEl,pEl, whereStrNode, affbelBool){
		if(thisEl && pEl) {
			var el = null;
			if(!whereStrNode) el = pEl.appendChild(thisEl);
			else if(this.isStr(whereStrNode)) {
				if(whereStrNode == 'first') {
					if(affbelBool) {
						if(pEl.childNodes.length) el = pEl.insertAfter(thisEl, pEl.childNodes[0]);
						else el = pEl.appendChild(thisEl)
					} else {
						if(pEl.childNodes.length) el = pEl.insertBefore(thisEl, pEl.childNodes[0]);
						else el = pEl.appendChild(thisEl)
					}
				} else if(whereStrNode == 'last') {
					if(affbelBool) {
						if(pEl.childNodes.length) el = pEl.insertBefore(thisEl, pEl.childNodes[pEl.childNodes.length-1]);
						else el = pEl.appendChild(thisEl)
					} else el = pEl.appendChild(thisEl)
				}
			} else if(this.isO(whereStrNode)) {
				if(affbelBool) el = pEl.insertBefore(thisEl, whereStrNode);
				else el = pEl.insertAfter(thisEl, whereStrNode)
			}
			return el
		}
	},
	setAttr: function(el, attrO) {
		var attr;
		for (attr in attrO) el.setAttribute(attr, attrO[attr])
	},
	addEvent: function(onNode, eventStr, thisFun,borcBool) {
		if(this.isFun(onNode.attachEvent)) onNode.attachEvent(eventStr, thisFun);
		else onNode.addEventListener(eventStr.replace(/^on/, ''), thisFun,borcBool)
	},
	removeEvent: function(nameNode, eventStr, nameFun) {
		if(this.isFun(nameNode.detachEvent)) nameNode.detachEvent(eventStr, nameFun);
		else nameNode.removeEventListener(eventStr.replace(/^on/, ''), nameFun, false)
	},
	removeEl:function(reqAStr,pEl) {
		var reqStr = (isStr(reqAStr))?reqAStr:reqAStr.toString();
		if(typeof this.elCache[reqStr] !== 'undefined') {
			this.elCache[reqStr].parentNode.removeChild(this.elCache[reqStr]);
			delete this.elCache[reqStr];
		} else {
			var reqA = (isA(reqAStr))?reqAStr:reqAStr.split(',');
			this.getEl(reqA,pEl).parentNode.removeChild(this.elCache[reqStr]);
			delete this.elCache[reqStr];
		}
	},
	__numextRegEx:/^[\.#]?[a-zA-Z0-9-_:]+@/,
	__exposRegEx:/^@[0-9]+$/,
	__tagRegEx:/^[a-zA-Z0-9-_:]+(@[0-9]+)?$/,
	__classRegEx:/^\.[a-zA-Z0-9-_:]+(@[0-9]+)?$/,
	__exclspRegEx:/^\./,
	__idRegEx:/^#[a-zA-Z0-9-_:]+(@[0-9]+)?$/,
	__exidpRegEx:/^#/,
	getEl: function(reqStr, __pEl = document) {
		if(!this.isStr(reqStr)) return null;
		reqStr = reqStr.replace(' ','');
		if(reqStr.length === 0) return null;
		var req = reqStr.split(',');
		var entry_name = '';
		var name = '';
		var chi = 0;
		if(!req[0].match(this.__exposRegEx)) {
			entry_name = req[0] + '@0';
			name = req[0]
		} else {
			entry_name = req[0];
			name = entry_name.replace(this.__exposRegEx,'');
			chi = parseInt(entry_name.replace(this.__numextRegEx,''))
		}
		if(typeof __pEl.elCache[entry_name] !== 'undefined') {
			if(req.length > 1) {
				req.shift();
				return this.getEl(req.toString(), __pEl.elCache[entry_name])
			}
			else return __pEl.elCache[entry_name]
		}
		for (var childi = 0; childi < __pEl.childNodes.length; ++childi) {
			if(entry_name.match(this.__tagRegEx) && typeof __pEl.childNodes[childi].tagName !== 'undefined') {
				if(__pEl.childNodes[childi].tagName.match(name)) {
					if(!chi) {
						if(req.length > 1) {
							req.shift();
							__pEl.elCache[entry_name] = __pEl.childNodes[childi];
							return this.getEl(req.toString(), __pEl.elCache[entry_name])
						} else {
							__pEl.elCache[entry_name] = __pEl.childNodes[childi];
							return __pEl.elCache[entry_name]
						}
					} else --chi;
				}
			} else if(entry_name.match(this.__classRegEx) && typeof __pEl.childNodes[childi].className !== 'undefined') {
				var class_name = name.replace(this.__exclspRegEx,'');
				if(__pEl.childNodes[childi].className.match(class_name)) {
					if(!chi) {
						if(req.length > 1) {
							req.shift();
							__pEl.elCache[entry_name] = __pEl.childNodes[childi];
							return this.getEl(req.toString(), __pEl.elCache[entry_name])
						} else {
							__pEl.elCache[entry_name] = __pEl.childNodes[childi];
							return __pEl.elCache[entry_name]
						}
					} else --chi
				}
			} else if(entry_name.match(this.__idRegEx) && typeof __pEl.childNodes[childi].id !== 'undefined') {
				var id_name = name.replace(this.__exidpRegEx,'');
				if(__pEl.childNodes[childi].id.match(id_name)) {
					if(!chi) {
						if(req.length > 1) {
							req.shift();
							__pEl.elCache[entry_name] = __pEl.childNodes[childi];
							return this.getEl(req.toString(), __pEl.elCache[entry_name])
						} else {
							__pEl.elCache[entry_name] = __pEl.childNodes[childi];
							return __pEl.elCache[entry_name]
						}
					} else --chi
				}
			}
		}
	},
	__DOMReady:false,
	__winOnLoad:false,
	__rSComl:false,
	executionStack:[],
	__readyIntIds:[],
	onReady: function(uselibsA, execFun) {
		this.sched_start();
		if((this.isA(uselibsA))?uselibsA.length:false) {
			this.usinglib(uselibsA.shift());
			this.onReady(uselibsA, execFun)
		} else {
			if(!this.executionStack.length) {
				this.addEvent(window,'onload',function(){memos.__winOnLoad = true});
				this.addEvent(document,'DOMContentLoaded',function(){memos.__DOMReady = true});
				this.addEvent(document,'onreadystatechange',this.__completehelper);
			}
			this.executionStack.push(execFun);
			this.__readyIntIds.push(this.sched_add(this.__readyhelper,this.config.ready_delay))
		}
	},
	__readyhelper: function(){
		if(!memos.__pLibs && (memos.__DOMReady || memos.__rSComl || memos.__winOnLoad)) {
			memos.__readyIntIds.every(function(el){memos.sched_rm(el);return true});
			memos.executionStack.every(function(el){el(memos);return true})
		}
	},
	__completehelper: function(){
		if(document.readyState != 'complete') return;
		memos.__rSComl = true;
	},
	__ints:[],
	__setInterval: function(delInt,intId) {
		if(typeof memos.__ints[intId] !== 'undefined') {
			memos.__ints[intId][0]();
			memos.__ints[intId][1] = setTimeout(function(){memos.__setInterval(delInt,intId)},delInt);
		}
	},
	setInterval: function(execFun,delInt) {
		var inte = memos.__ints.push([execFun])-1;
		memos.__ints[inte][1] = setTimeout(function(){memos.__setInterval(delInt,inte)},delInt);
		return inte
	},
	cancelInterval: function(intId) {
		if(typeof memos.__ints[intId] !== 'undefined') {
			cancelTimeout(memos.__ints[intId][1]);
			delete memos.__ints[intId];
			memos.__ints.splice(intId,1)
		}
	},
	__sched_intId:null,
	__sched_cbs:[],
	__sched_ontick:function(){
		memos.__sched_cbs.every(function(el,index){
			++el[2];
			if(el[3]) {delete memos.__sched_cbs[index];memos.__sched_cbs.splice(index,1);return false}
			if(el[1]==el[2]) {el[0]();el[2] = 0}
			return true;
		})
	},
	sched_start:function(){
		if(this.isNull(this.__sched_intId)) this.__sched_intId = memos.setInterval(this.__sched_ontick,this.config.sched_interval)
	},
	sched_stop:function(){
		if(!this.isNull(this.__sched_intId)) {
			clearInterval(this.__sched_intId);
			this.__sched_intId = null
		}
	},
	sched_add:function(execFun,delInt){
		return this.__sched_cbs.push([execFun,(delInt)?delInt:1,0,false])-1
	},
	sched_rm:function(idInt){
		if(typeof this.__sched_cbs[idInt] !== 'undefined') this.__sched_cbs[idInt][3] = true
	}
}
