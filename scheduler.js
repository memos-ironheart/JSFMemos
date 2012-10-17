memos.define([],'memos.scheduler', {
	config:{
		fps:30
	},
	__intid:null,
	__cbs:[],
	__ontick:function(){
		for(var i = 0;i<memos.scheduler.__cbs.length;++i){
			++memos.scheduler.__cbs[i][2];
			if(memos.scheduler.__cbs[i][3]) {memos.scheduler.__cbs.splice(i,1);continue}
			if(memos.scheduler.__cbs[i][1]==memos.scheduler.__cbs[i][2]) {memos.scheduler.__cbs[i][0]();memos.scheduler.__cbs[i][2] = 0}
		}
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

