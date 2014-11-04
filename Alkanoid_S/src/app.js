var HelloWorldLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {

//		1. super init first
		this._super();
		this.ball = new cc.Sprite("res/ball2.png");
		this.ball.scale = 0.005;
		this.ball.x = this.width/2;
		this.ball.y = this.height/2;
		this.addChild(this.ball);
		var initialDirection = 4.5;
		this.ball.speedX = 6*Math.cos(initialDirection);
		this.ball.speedY = 6*Math.sin(initialDirection);
		this.ball.angleSpeed = 0;
		this.box = new cc.Sprite("res/box.png");
		this.box.scaleX = 0.15;
		this.box.scaleY = 0.04;
		this.box.x = this.width/2;
		this.box.y = 50;
		this.addChild(this.box);
		this.box_g = new cc.Sprite("res/box_g.png");
		this.box_g.scaleX = 0.1;
		this.box_g.scaleY = 0.04;
		this.box_g.x = this.width/2;
		this.box_g.y = 300;
		this.addChild(this.box_g);
		var eventListener = cc.EventListener.create({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches:true,
			onTouchBegan:function(){
				return true;
			},
			onTouchMoved:function(touch, event){
				event.getCurrentTarget().box.x = touch.getLocationX();
				return true;
			}
		});
		cc.eventManager.addListener(eventListener, this);
		this.update = function(){
			var boxTop = this.box.y+this.box.getBoundingBox().height/2;
			var ballBottom = this.ball.y-this.ball.getBoundingBox().height/2;
			var ballTop = this.ball.y + this.ball.getBoundingBox().height/2;
			var box_g_Top = this.box_g.y + this.box_g.getBoundingBox().height/2;
			var box_g_Bottom = this.box_g.y - this.box_g.getBoundingBox().height/2;
			if(ballBottom>boxTop&&ballBottom+this.ball.speedY<boxTop){
				var xOnBox = this.ball.x+(boxTop+this.ball.getBoundingBox().height/2-this.ball.y)*this.ball.speedX/(this.ball.speedY);
				var boxLeft = this.box.x-this.box.getBoundingBox().width/2;
				var boxRight = this.box.x+this.box.getBoundingBox().width/2;
				if(xOnBox>boxLeft&&xOnBox<boxRight){
					cc.audioEngine.playEffect("res/bang.mp3", false);
					this.ball.speedY *= -1;
					if(this.ball.speedX>0){
						this.ball.angleSpeed = 1.2;
					}else{
						this.ball.angleSpeed = -1.2;
					}
					this.ball.y = 2*(boxTop+this.ball.getBoundingBox().height/2)-this.ball.y;
					var alpha = Math.atan2(this.ball.speedY, this.ball.speedX);
					alpha += 0.01*(this.box.x-xOnBox);
					this.ball.speedX = 6*Math.cos(alpha);
					this.ball.speedY = 6*Math.sin(alpha);
				}
			}
			if(ballTop<box_g_Bottom && ballTop + this.ball.speedY > box_g_Bottom){//초록 박스의 아랫부분 충돌처리 
				var xOnBox = this.ball.x+(box_g_Bottom+this.ball.getBoundingBox().height/2-this.ball.y)*this.ball.speedX/(this.ball.speedY);
				var boxLeft = this.box_g.x-this.box_g.getBoundingBox().width/2;
				var boxRight = this.box_g.x+this.box_g.getBoundingBox().width/2;
				if(xOnBox>boxLeft&&xOnBox<boxRight){
					cc.log("done");
					cc.audioEngine.playEffect("res/bang.mp3", false);
					this.ball.speedY *= -1;
					if(this.ball.speedX>0){
						this.ball.angleSpeed = 1.2;
					}else{
						this.ball.angleSpeed = -1.2;
					}
					this.ball.y = 2*(box_g_Bottom - this.ball.getBoundingBox().height/2)-this.ball.y;
					var alpha = Math.atan2(this.ball.speedY, this.ball.speedX);
					alpha += 0.01*(this.box_g.x-xOnBox);
					this.ball.speedX = 6*Math.cos(alpha);
					this.ball.speedY = 6*Math.sin(alpha);
				}
			}
				
			this.ball.rotation+=this.ball.angleSpeed;
			this.ball.x += this.ball.speedX;
			this.ball.y += this.ball.speedY;
			//벽에 닿을때 튕기는 부분.
			if(this.ball.x<this.ball.getBoundingBox().width/2){
				this.ball.speedX *= -1;
				if(this.ball.speedY>0){
					this.ball.angleSpeed = -1.2;
				}else{
					this.ball.angleSpeed = 1.2;
				}
				this.ball.x = this.ball.getBoundingBox().width-this.ball.x;
			}
			if(this.ball.x>this.width-this.ball.getBoundingBox().width/2){
				this.ball.speedX *= -1;
				if(this.ball.speedY>0){
					this.ball.angleSpeed = 1.2;
				}else{
					this.ball.angleSpeed = -1.2;
				}
				this.ball.x = 2*(this.width-this.ball.getBoundingBox().width/2)- this.ball.x;
			}
			//아랫부분 튕기는 부분. -> 기회 삭제, 재시작.
			if(this.ball.y<this.ball.getBoundingBox().height/2){
				/*this.ball.speedY *= -1;
				if(this.ball.speedX>0){
					this.ball.angleSpeed = 1.2;
				}else{
					this.ball.angleSpeed = -1.2;
				}
				this.ball.y = 2*(this.ball.getBoundingBox().height/2)-this.ball.y;*/
				this.ball.x = this.width/2;
				this.ball.y = this.height/2;
			}
			if(this.ball.y>this.height-this.ball.getBoundingBox().height/2){
				this.ball.speedY *= -1;
				if(this.ball.speedX>0){
					this.ball.angleSpeed = -1.2;
				}else{
					this.ball.angleSpeed = 1.2;
				}
				this.ball.y = 2*(this.height - this.ball.getBoundingBox().height/2) - this.ball.y;
			}
		}
		this.scheduleUpdate();
		return true;
	}
});
var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
	}
});
