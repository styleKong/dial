var dial = (function(id,data) {
	!data.button?data.button = '抽奖':'';
	!data.rotateNum?data.rotateNum = 4:'';
	var activeAward = null;
    if(data.awards.length > 1){
		//计算每一项中心角角度
        var itemDeg = 360 / data.awards.length;
		const _tan = Math.tan(itemDeg / 2 * Math.PI / 180); //中心角的正切值（做垂直辅助线后）
        let a = 0, b = 0; 
        if(itemDeg < 90) {
			b =  (100 - (_tan * 200)) / 2; // x轴需要切掉部分，x平均切掉两边部分（b） （_tan * 200）为保留部分
        }else if(itemDeg != 90 && itemDeg != 180 ){
            a = 100 - 50 / _tan; //y轴需要切掉部分 （50 / _tan）为保留部分 单位%
        }
        let _style = id + " {position: relative; border-radius: 50%;overflow: hidden;}";
            _style += ".dial_ul {position: absolute;width: 100%;height: 100%;}";
			//设置每一项扇形大小
            _style += ".dial_li {width: 100%;height: 100%;transform-origin: 50% 100%;clip-path: polygon(0% 0%,100% 0," + (100 - b) + "% " + a + "%,50% 100%," + b + "% " + a + "%);position: absolute;top: -50%; padding-top: 50%; padding-bottom: 10%;box-sizing: border-box;color: #ffffff;display: flex;justify-content: center;align-items: center;align-content: center;}";
            _style += ".dial_li:nth-child(even) {background: black;}";
            _style += ".dial_li:nth-child(odd) {background: yellow;}";
            _style += ".dial_li:nth-child(1) {display: block;}";
			_style += ".dial_button {position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);background: red; width: 100px;height: 100px;border-radius: 50%;color: #ffffff;border: none;outline: none;}";
			_style += ".dial_button::after {content: '';display: block; border-top: none;border-left: 10px solid transparent;border-right: 10px solid transparent;border-bottom: 10px solid red; position: absolute;top: 0px;left: 50%;transform: translate(-50%,-90%);}"
		var $style = document.createElement('style');
            $style.innerText = _style;
            $style.setAttribute('type','text/css');
		document.getElementsByTagName('head')[0].appendChild($style);
		// 创建转盘
		var _ul = document.createElement('ul');
			_ul.setAttribute('id','my_dial');
			_ul.setAttribute('class','dial_ul');
        data.awards.forEach(function(item,index){
            let rotate = itemDeg * index;
			let _li = document.createElement('li');
				_li.setAttribute('name',item.name);
				_li.setAttribute('class','dial_li');
				_li.innerHTML = item.value;
				_li.style.cssText = 'transform: rotate(' + rotate + 'deg);';
			_ul.appendChild(_li);
        })
		document.querySelectorAll(id)[0].appendChild(_ul);
		// 创建抽奖按钮
		let _button = document.createElement('button');
			_button.setAttribute('type','button');
			_button.setAttribute('class','dial_button');
			_button.innerText = data.button;
			// 按钮点击事件
			_button.addEventListener('click',function() {
				data.btnFct();
			})
        document.querySelectorAll(id)[0].appendChild(_button);
	}
	return {
		setAward: function(info) {
			activeAward = info;
			let activeLi;
			let lis = document.querySelectorAll('.dial_li');
			for (var i = 0; i < lis.length; i++){
				(function(index){
					if(lis[index].getAttribute('name') == activeAward){
						activeLi = index;
					}
				})(i)
			}
			let rotateDeg = 0;
			if(document.getElementById('my_dial').style.getPropertyValue('transform').indexOf('rotate') !== -1){
				let oldRotateDeg = document.getElementById('my_dial').style.getPropertyValue('transform');
				// 获取转盘已转角度
				oldRotateDeg = Number(oldRotateDeg.slice(7,-4));
				// 先将转盘复位
				rotateDeg = oldRotateDeg + (360- oldRotateDeg % 360);
			}
			rotateDeg += 360 * data.rotateNum - itemDeg * activeLi + itemDeg * Math.random() - itemDeg / 2;
			_ul.style.cssText = 'transform: rotate(' + rotateDeg + 'deg);transition: all ease 3s;';
			return true
		}
	}
})