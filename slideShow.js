memos.define(['memos.animation'],'memos.slideShow', {
	setOn: function(onNode, dataO, imgsCInt, durInt,chDelay,forHideO,forShowO,cssStr,idStr) {
		if (!dataO) throw ('Data array is empty.');
		if (dataO.length < imgsCInt) throw ('Data elements are lower than images per frame you want to show.');
		memos.putEl(memos.createEl('link', {rel: 'stylesheet',type: 'text/css',href: cssStr}),memos.getEl('html,head'), 'first');
		var list = memos.putEl(memos.createEl('ol',{id:idStr}),onNode);
		list.slideShow = {
			owner:list,
			duration: (durInt)?durInt:1000,
			delay:(chDelay)?chDelay:1000,
			data:dataO,
			imgsC:(imgsCInt)?imgsCInt:1,
			forShow:forShowO,
			forHide:forHideO,
			lock:0,
			auto:false,
			__imgPosN:0,
			__imgPosP:0,
			__rmEl:function() {
				var sS = this.owner.parentNode.slideShow;
				this.owner.parentNode.removeChild(this.owner);
				--sS.lock;
				if(sS.auto) memos.sched_add(function(i){memos.sched_rm(i);sS.next()},sS.delay)
			},
			__showLast:function() {
				this.owner.parentNode.childNodes[0].animation.startF()
			},
			__showFirst:function() {
				this.owner.parentNode.childNodes[this.owner.parentNode.slideShow.imgsC].animation.startF()
			},
			next: function() {
				if(!this.lock) {
					++this.lock;
					++this.__imgPosP;
					if (this.__imgPosP>(this.data.length-1)) this.__imgPosP = 0;
					++this.__imgPosN;
					if (this.__imgPosN>(this.data.length-1)) this.__imgPosN = 0;
					memos.putEl(memos.createEl('li',{style:'background-image: url(' + this.data[this.__imgPosN][1] + ');',title:this.data[this.__imgPosN][0]}),this.owner);
					memos.animation.setOn(this.owner.childNodes[0],this.forHide,this.duration,null,null,this.__rmEl);
					memos.animation.setOn(this.owner.childNodes[this.imgsC],this.forShow,this.duration,this.__showLast).startF();
				}
			},
			prev: function() {
				if(!this.lock) {
					++this.lock;
					if (!this.__imgPosP) this.__imgPosP = this.data.length-1;
					else --this.__imgPosP;
					if (!this.__imgPosN) this.__imgPosN = this.data.length-1;
					else --this.__imgPosN;
					memos.putEl(memos.createEl('li',{style:'background-image: url(' + this.data[this.__imgPosP][1] + ');',title:this.data[this.__imgPosP][0]}),this.owner,'first');
					memos.animation.setOn(this.owner.childNodes[this.imgsC],this.forHide,this.duration,null,null,this.__rmEl);
					memos.animation.setOn(this.owner.childNodes[0],this.forShow,this.duration,this.__showFirst).startF();
				}
			},
		}
		for (;list.slideShow.__imgPosN<list.slideShow.imgsC;++list.slideShow.__imgPosN) {
			memos.putEl(memos.createEl('li',{style:'background-image: url(' + list.slideShow.data[list.slideShow.__imgPosN][1] + ');',title:list.slideShow.data[list.slideShow.__imgPosN][0]}), list);
		}
		--list.slideShow.__imgPosN;
		return list.slideShow
	}
});
memos.libLoaded();

