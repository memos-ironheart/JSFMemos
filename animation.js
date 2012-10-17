memos.define(['memos.animation_scheduler'], 'memos.animation', {
	setOn: function(onNode, propsO, durInt, _onStartFFun, _onStartRFun, _onEndFun, _whenRunsFun) {
		onNode.animation = {
			owner: onNode,
			props: propsO,
			__intId: null,
			startF: function() {
				memos.animation_scheduler.start();
				if (memos.isNull(this.__intId)) {
					if (this.onStartFFun) this.onStartFFun();
					this.__intId = memos.animation_scheduler.add(this)
				}
			},
			startR: function() {
				memos.animation_scheduler.start();
				if (memos.isNull(this.__intId)) {
					if (this.onStartRFun) this.onStartRFun();
					this.__intId = memos.animation_scheduler.add(this)
				}
			},
			stop: function() {
				if (!memos.isNull(this.__intId)) {
					memos.animation_scheduler.rm(this.__intId);
					this.__intId = null;
					if (this.onEndFun) this.onEndFun()
				}
			},
			reset: function() {
				var prop;
				for (prop in this.props) {
					this.owner.style[prop] = this.props[prop].start + this.props[prop].unit;
					if (this.props[prop].end > this.props[prop].start) this.props[prop].step = (this.props[prop].end - this.props[prop].start) / (this.config.duration/(1000/memos.animation_scheduler.config.fps));
					else if (this.props[prop].end < this.props[prop].start) this.props[prop].step = (this.props[prop].start - this.props[prop].end) / (this.config.duration/(1000/memos.animation_scheduler.config.fps))
				}
			},
			nextStep: function(intId) {
				var prop;
				for (prop in this.props) {
					var curr = parseFloat(this.owner.style[prop].replace(this.props[prop].unit, ''));
					if (this.props[prop].end > this.props[prop].start) {
						if (curr < this.props[prop].end) {
							curr += this.props[prop].step;
							this.owner.style[prop] = (curr > this.props[prop].end) ? this.props[prop].end + this.props[prop].unit : curr + this.props[prop].unit;
							if (this.whenRunsFun) this.whenRunsFun();
							continue
						}
						this.stop();
					}
					else if (this.props[prop].end < this.props[prop].start) {
						if (curr > this.props[prop].end) {
							this.owner.style[prop] = (curr > this.props[prop].step) ? (curr - this.props[prop].step) + this.props[prop].unit : this.props[prop].end + this.props[prop].unit;
							if (this.whenRunsFun) this.whenRunsFun();
							continue
						}
						this.stop()
					}
				}
			},
			prevStep: function(intId) {
				var prop;
				for (prop in this.props) {
					var curr = parseFloat(this.owner.style[prop].replace(this.props[prop].unit, ''));
					if (this.props[prop].end > this.props[prop].start) {
						if (curr > this.props[prop].start) {
							this.owner.style[prop] = (curr > this.props[prop].step) ? (curr - this.props[prop].step) + this.props[prop].unit : this.props[prop].start + this.props[prop].unit;
							if (this.whenRunsFun) this.whenRunsFun();
							continue
						}
						this.stop();
					}
					else if (this.props[prop].end < this.props[prop].start) {
						if (curr < this.props[prop].start) {
							curr += this.props[prop].step;
							this.owner.style[prop] = (curr > this.props[prop].start) ? this.props[prop].start + this.props[prop].unit : curr + this.props[prop].unit;
							if (this.whenRunsFun) this.whenRunsFun();
							continue
						}
						this.stop()
					}
				}
			},
			onStartFFun: _onStartFFun,
			onStartRFun: _onStartRFun,
			onEndFun: _onEndFun,
			whenRunsFun: _whenRunsFun,
			config: {
				duration: (durInt)?durInt:200
			}
		}
		onNode.animation.reset();
		return onNode.animation
	}
});
memos.libLoaded();
