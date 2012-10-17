memos.define([],'memos.animation_scheduler', {
	config:{
		fps:30
	},
	__intId:null,
	__cbs:[],
	__ontick:function(){
		for(var i = 0;i<memos.animation_scheduler.__cbs.length;++i){
			++memos.animation_scheduler.__cbs[i][2];
			if(memos.animation_scheduler.__cbs[i][3]) {memos.animation_scheduler.__cbs.splice(i,1);continue}
			if(memos.animation_scheduler.__cbs[i][1]==memos.animation_scheduler.__cbs[i][2]) {memos.animation_scheduler.__cbs[i][0].nextStep(i);memos.animation_scheduler.__cbs[i][2] = 0}
		}
	},
	start:function(){
		if(memos.isNull(this.__intId)) this.__intId = memos.setInterval(this.__ontick,(1000/this.config.fps))
	},
	stop:function(){
		if(!memos.isNull(this.__intId)) {
			clearInterval(this.__intId);
			this.__intId = null
		}
	},
	add:function(anO,delInt){
		return this.__cbs.push([anO,(delInt)?delInt:1,0,false])-1
	},
	rm:function(idInt){
		if (typeof this.__cbs[idInt] !== 'undefined') this.__cbs[idInt][3] = true
	}
});
memos.libLoaded();

