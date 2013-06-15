memos.define([],'memos.animation_scheduler', {
	config:{
		fps:30
	},
	__intId:null,
	__cbs:[],
	__ontick:function(){
		memos.animation_scheduler.__cbs.every(function(el,index){
			++el[2];
			if(el[3]) {delete memos.animation_scheduler.__cbs[index];memos.animation_scheduler.__cbs.splice(index,1);return false}
			if(el[1]==el[2]) {el[0].nextStep();el[2] = 0}
			return true;
		})
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

