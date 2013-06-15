memos.define([],'memos.scheduler', {
	config:{
		tps:10
	},
	__intid:null,
	__cbs:[],
	__ontick:function(){
		memos.scheduler.__cbs.every(function(el,index){
			++el[2];
			if(el[3]) {delete memos.scheduler.__cbs[index];memos.scheduler.__cbs.splice(index,1);return false}
			if(el[1]==el[2]) {el[0]();el[2] = 0}
			return true;
		})
	},
	start:function(){
		if(memos.isNull(this.__intid)) this.__intid = setInterval(this.__ontick,(1000/this.config.fps))
	},
	stop:function(){
		if(!this.isNull(this.__intid)) {
			clearInterval(this.__intid);
			this.__intid = null
		}
	},
	add:function(execFun,delInt){
		return this.__cbs.push([execFun,(delInt)?delInt:1,0,false])-1
	},
	rm:function(idInt){
		if (typeof this.__cbs[idInt] !== 'undefined') this.__cbs[idInt][3] = true
	}
});
memos.libLoaded();

