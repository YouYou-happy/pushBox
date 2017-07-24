window.onload = function(){
	game.load();
}
var game={
	oWrap: $("#game"),
	size:{x:10,y:8},
	lv:0,
	tempMap :[],
	stepNum : 0,
	step :[],
	init:function(){
		this.oWrap.html("");
		this.tempMap= [];
		this.stepNum=0;
		this.step=[];
	},
	load:function(){
		var self = this;
		$(".pre_lv").click(self.preLv);
		$(".next_lv").click(self.nextLv);
		$(".pre_step").click(self.preStep);
		$(".restart").click(self.restart);
		$("#select_lv").change(function(){
			self.lv = Number($("#select_lv").val());
			self.mapchange();
		});
		this.bindDirec();
		this.map(this.Data[this.lv]);
		this.personControl();
	},
	map:function(data){
		var x= this.size.x , y = this.size.y;
		this.init();
		this.tempMap = data.map(function(data1){ //深拷贝二维数组
			return data1.concat([]);
		})
		for(var i = 0 ; i < y ; i++){
			for(var j =0 ; j < x ; j++){		
				switch(data[i][j]){

					case 0 :
						game.createElement().className='empty';
						break;
					case 1 :
						game.createElement().className='wall';
						break;
					case 2 :
						game.createElement().className='box';
						break;
					case 3 :
						game.createElement().className='target';
						break;
					case 4 :
						game.createElement().className='person';
						this.step =[[j,i]];
						break;
					// case 5 :
					// 	game.createElement().className='match';
					// 	break;
					// case 6 :
					// 	game.createElement().className="person2";
					// 	break;
				}

			}
		}
	},
	bindDirec:function(){
		var self = this;
		$(".player").bind("click",function(ev){
			var ev = window.event || ev,
				target = ev.target || ev.srcElement;
				switch (target.className) {
					case "topArr":
						self.personMove({x:0,y:-1});
						break;
					case "leftArr":
						self.personMove({x:-1,y:0});
						break;
					case "bottomArr":
						self.personMove({x:0,y:1});
						break;
					case "rightArr":
						self.personMove({x:1,y:0});
						break;
							
					default:
						break;
				}
			
		})
	},
	preLv:function(){
		if(game.lv>0){
			game.lv-=1;
			game.mapchange();
		}else{
			alert("当前已是第一关");
		}
	},
	nextLv:function(){
		if(game.lv<game.Data.length-1){
			game.lv+=1;
			game.mapchange();
		}else{
			alert("当前已是最后一关");
		}
	},
	mapchange:function(){
		$(".levelNum")[0].innerHTML = game.lv+1;
		$("#select_lv").val(game.lv);
		game.map(game.Data[game.lv]);
	},
	createElement:function(){
		var ele = document.createElement("div");
		game.oWrap.append(ele);
		return ele;
	},
	personControl: function(){
		var self = this;
		document.onkeydown = function(ev){
			var ev = ev || window.event,
			    keyCode = ev.keyCode;
			    switch(keyCode){//0：空地，1：围墙，2：箱子，3：目标点，4：人物  5:箱子匹配  6：人物位于目标点
			    	case 37 : //left
			    		self.personMove({x:-1,y:0});
			    		break;
			    	case 38 : //up
			    		self.personMove({x:0,y:-1});
			    		break;
			    	case 39 : // right
			    		self.personMove({x:1,y:0});
			    		break;
			    	case 40 : //down
			    		self.personMove({x:0,y:1});
			    		break; 
			    }
			    
		}
	},
	personMove: function(obj){
		var	position = this.step[this.step.length-1],
			x = position[0],
			y = position[1],
			i = obj.x,
			j = obj.y;
		if(y+j<0 ||y+j>7){
			return
		};
		if(this.tempMap[y+j][x+i] == 0){
			this.tempMap[y+j][x+i] = 4 ;
			this.oWrap.find("div")[(y+j)*10+x+i].className="person";
			this.step.push([x+i,y+j]); 
			this.determine_current(x,y);
		}else if(this.tempMap[y+j][x+i] == 3){
			this.tempMap[y+j][x+i] = 6 ;
			this.oWrap.find("div")[(y+j)*10+x+i].className="person2";
			this.step.push([x+i,y+j]); 
			this.determine_current(x,y);
		}else if(this.tempMap[y+j][x+i] == 2){
			if(this.tempMap[y+2*j][x+2*i] == 0 ){
				this.tempMap[y+j][x+i] = 4 ;
				this.tempMap[y+2*j][x+2*i] = 2 ;
				this.oWrap.find("div")[(y+j)*10+x+i].className="person";
				this.oWrap.find("div")[(y+2*j)*10+x+2*i].className="box";
			}else if(this.tempMap[y+2*j][x+2*i] && this.tempMap[y+2*j][x+2*i] == 3){
				this.tempMap[y+2*j][x+2*i] = 5 ;
				this.tempMap[y+j][x+i] = 4 ;				
				this.oWrap.find("div")[(y+2*j)*10+x+2*i].className="match";
				this.oWrap.find("div")[(y+j)*10+x+i].className="person";
			}else{
				return
			}
			this.step.push([x+i,y+j,"box"]); 
			this.determine_current(x,y);
		}else if(this.tempMap[y+j][x+i] == 5 && ((this.tempMap[y+2*j][x+2*i] == 0)|| this.tempMap[y+2*j][x+2*i] ==3)){
			if(this.tempMap[y+2*j][x+2*i] == 0){
				this.tempMap[y+2*j][x+2*i] = 2;
				this.oWrap.find("div")[(y+2*j)*10+x+2*i].className="box";
			}else if(this.tempMap[y+2*j][x+2*i] ==3){
				this.tempMap[y+2*j][x+2*i] = 5;
				this.oWrap.find("div")[(y+2*j)*10+x+2*i].className="match";
			}else{
				return;
			}
			this.tempMap[y+j][x+i] = 6;
			this.oWrap.find("div")[(y+j)*10+x+i].className="person2";
			this.step.push([x+i,y+j,"box"]); 
			this.determine_current(x,y);
		}else{
			return
		};
		this.stepNum++;
		$(".step").html(this.stepNum);
		this.passCheck();
	},
	determine_current : function(x,y){
		var self = game;
		if(self.tempMap[y][x] == 6){
			self.tempMap[y][x] = 3
			self.oWrap.find("div")[y*10+x].className="target";
		}else{
			self.tempMap[y][x] = 0;
			self.oWrap.find("div")[y*10+x].className="empty";
	};},
	preStep : function(){
		if(game.step.length>1){
			var self = game,
				currentStep = self.step[self.step.length-1],
				preStep = self.step[self.step.length-2],
				i = preStep[0] - currentStep[0],  //需要还原的x位移
				j = preStep[1] - currentStep[1],
				temp = {x:i,y:j};
				self.personMove(temp);
				self.step.pop();
				self.step.pop();
				if(currentStep[2] && currentStep[2] == "box"){
					var boxX = currentStep[0]-i,boxY = currentStep[1]-j;
					console.log(self.tempMap[boxY][boxX],self.tempMap[boxY+j][boxX+i]);
					if(self.tempMap[boxY][boxX] ==2){
						self.tempMap[boxY][boxX] = 0;
						self.oWrap.find("div")[(boxY)*10+boxX].className="empty";
						if(self.tempMap[boxY+j][boxX+i] == 3){
							self.tempMap[boxY+j][boxX+i] = 5;
							self.oWrap.find("div")[(boxY+j)*10+boxX+i].className="match";
						}else{
							self.tempMap[boxY+j][boxX+i] = 2;
							self.oWrap.find("div")[(boxY+j)*10+boxX+i].className="box";
						}
					}else if( self.tempMap[boxY][boxX] == 5){
						self.tempMap[boxY][boxX] = 3
						self.oWrap.find("div")[(boxY)*10+boxX].className="target";
						if(self.tempMap[boxY+j][boxX+i] == 3){
							self.tempMap[boxY+j][boxX+i] = 5;
							self.oWrap.find("div")[(boxY+j)*10+boxX+i].className="match";
						}else{
							self.tempMap[boxY+j][boxX+i] = 2
							self.oWrap.find("div")[(boxY+j)*10+boxX+i].className="box";
						}
					}else{
						console.log("error")
					}
				}
		}else{
			alert("已经无法再退步了！")
		}
	},
	restart : function(){
		game.map(game.Data[game.lv]);
	},
	passCheck : function(){
		var temp =this.tempMap.every(function(item){
			return item.every(function(item2){
				return item2!=2;
			})
		});
		if(temp){
			setTimeout(function(){
				if(game.lv<(game.Data.length-1)){
					alert("恭喜进入下一关！")
					game.nextLv();
				}else{
					alert("恭喜您已通关游戏！")
				}
			}, 500)
		}
	},
	//10x8格子  0：空地，1：围墙，2：箱子，3：目的地，4：人物
	Data:[
		[
		  [0,0,0,0,0,0,0,0,0,0],
	      [0,0,0,1,1,1,0,0,0,0],
	      [0,0,1,1,3,3,1,0,0,0],
	      [0,0,1,4,2,2,0,1,0,0],
	      [0,0,1,0,0,0,0,1,0,0],
	      [0,0,1,1,1,1,1,1,0,0],
		  [0,0,0,0,0,0,0,0,0,0],
	      [0,0,0,0,0,0,0,0,0,0],
	    ],
	    [
	      [0,0,1,1,1,1,1,0,0,0],
	      [0,0,1,0,0,1,1,1,0,0],
	      [0,0,1,4,2,0,0,1,0,0],
	      [0,1,1,1,0,1,0,1,1,0],
	      [0,1,3,1,0,1,0,0,1,0],
	      [0,1,3,0,0,0,1,0,1,0],
	      [0,1,3,2,0,0,2,0,1,0],
	      [0,1,1,1,1,1,1,1,1,0]
	    ],
	    [
	      [0,0,0,1,1,1,1,1,1,0],
	      [0,1,1,1,0,0,0,0,1,0],
	      [1,1,3,0,2,1,1,0,1,1],
	      [1,3,3,2,0,2,0,0,4,1],
	      [1,3,3,0,2,0,2,0,1,1],
	      [1,1,1,1,1,1,0,0,1,0],
	      [0,0,0,0,0,1,1,1,1,0],
	      [0,0,0,0,0,0,0,0,0,0]
	    ],[
	      [0,0,0,1,1,1,1,0,0,0],
	      [0,0,0,1,3,3,1,0,0,0],
	      [0,0,1,1,0,3,1,1,0,0],
	      [0,0,1,0,0,2,3,1,0,0],
	      [0,1,1,0,2,0,0,1,1,0],
	      [0,1,0,0,1,2,2,0,1,0],
	      [0,1,0,0,4,0,0,0,1,0],
	      [0,1,1,1,1,1,1,1,1,0]

	    ],
	    [
	      [0,1,1,1,1,1,1,1,0,0],
	      [0,1,0,0,0,0,0,1,1,1],
	      [1,1,2,1,1,1,0,0,0,1],
	      [1,0,4,0,2,0,0,2,0,1],
	      [1,0,3,3,1,0,2,0,1,1],
	      [1,1,3,3,1,0,0,0,1,0],
	      [0,1,1,1,1,1,1,1,1,0],
	      [0,0,0,0,0,0,0,0,0,0]
	    ],[
	      [0,1,1,1,1,1,1,1,0,0],
	      [1,1,4,0,2,0,0,1,1,0],
	      [1,0,2,3,3,3,2,0,1,0],
	      [1,0,1,0,0,0,1,0,1,0],
	      [1,0,2,3,3,3,2,0,1,0],
	      [1,1,0,0,2,0,0,1,1,0],
	      [0,1,1,1,1,1,1,1,0,0],
	      [0,0,0,0,0,0,0,0,0,0]
	    ],
	    [
	      [0,0,0,1,1,1,1,1,1,1],
	      [0,0,1,1,0,0,1,0,4,1],
	      [0,0,1,0,0,0,1,0,0,1],
	      [0,0,1,2,0,2,0,2,0,1],
	      [0,0,1,0,2,1,1,0,0,1],
	      [1,1,1,0,2,0,1,0,1,1],
	      [1,3,3,3,3,3,0,0,1,0],
	      [1,1,1,1,1,1,1,1,1,0]
	    ],[
	      [0,0,1,1,1,1,1,0,0,0],
	      [0,0,1,0,3,0,1,1,0,0],
	      [0,1,1,2,3,2,0,1,0,0],
	      [0,1,0,2,3,0,0,1,0,0],
	      [0,1,4,0,3,2,0,1,0,0],
	      [0,1,1,2,3,2,0,1,0,0],
	      [0,0,1,0,3,0,1,1,0,0],
	      [0,0,1,1,1,1,1,0,0,0]
	    ],[
	      [0,0,1,1,1,1,1,0,0,0],
	      [0,0,1,0,4,0,1,1,1,0],
	      [0,1,1,2,1,2,0,0,1,0],
	      [0,1,0,3,3,0,3,0,1,0],
	      [0,1,0,0,2,2,0,1,1,0],
	      [0,1,1,1,0,1,3,1,0,0],
	      [0,0,0,1,0,0,0,1,0,0],
	      [0,0,0,1,1,1,1,1,0,0]	
	    ],[
	      [1,1,1,1,1,1,1,1,1,1],
	      [1,0,0,0,1,0,0,0,0,1],
	      [1,0,2,0,1,3,0,0,0,1],
	      [1,4,0,2,2,0,0,1,3,1],
	      [1,0,2,0,1,3,0,0,0,1],
	      [1,0,0,2,1,3,0,3,0,1],
	      [1,1,0,0,1,1,1,1,1,1],
	      [0,1,1,1,1,0,0,0,0,0]
	    ]
	],
}