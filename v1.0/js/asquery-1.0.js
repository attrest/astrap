/*!
 * Astrap javascript library v1.0
 * https://www.attrest.com/astrap/
 *
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Includes jquery.js
 * https://jquery.com/
 *
 * Date: 2016-12-15
 */

var as = {
	//브라우저체크
	//as.getBrowser();
	getBrowser: function(){
		// 브라우저 및 버전을 구하기 위한 변수들.
		'use strict';
		var agent = navigator.userAgent.toLowerCase(),
		      name = navigator.appName,
		      browser;

		// MS 계열 브라우저 체크
		if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
		    browser = 'ie';
		    if(name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
		        agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
		        browser += parseInt(agent[1]);
		    } else { // IE 11+
		        if(agent.indexOf('trident') > -1) { // IE 11
		            browser += 11;
		        } else if(agent.indexOf('edge/') > -1) { // Edge
		            browser = 'edge';
		        }
		    }
		} else if(agent.indexOf('safari') > -1) { // Chrome or Safari
		    if(agent.indexOf('opr') > -1) { // Opera
		        browser = 'opera';
		    } else if(agent.indexOf('chrome') > -1) { // Chrome
		        browser = 'chrome';
		    } else { // Safari
		        browser = 'safari';
		    }
		} else if(agent.indexOf('firefox') > -1) { // Firefox
		    browser = 'firefox';
		}

		// IE: ie7~ie11, Edge: edge, Chrome: chrome, Firefox: firefox, Safari: safari, Opera: opera
		document.getElementsByTagName('html')[0].className = browser;
		return browser;
	},
	//이전 엘리먼트 찾기
	//as.getPrev(element);
	getPrev: function(elem){
		do {
			elem = elem.previousSibling;
		} while (elem && elem.nodeType != 1);
		return elem;
	},
	//다음 엘리먼트 찾기
	//as.getNext(element);
	getNext: function(elem){
		do {
			elem = elem.nextSibling;
		} while (elem && elem.nodeType != 1);
		return elem;
	},
	//요소내의 첫번째 엘리먼트 찾기
	//as.getFirst(element);
	getFirst: function(elem){
		elem = elem.firstChild;
		return elem && elem.nodeType != 1 ? as.getNext(elem) : elem;
	},
	//요소내의 마지막 엘리먼트 찾기
	//as.getLast(element);
	getLast: function(elem){
		elem = elem.lastChild;
		return elem && elem.nodeType != 1 ? as.getPrev(elem) : elem;
	},
	//요소의 부모 엘리먼트 찾기
	//as.getParent(document.getElementById('element_ID', parentLevel));
	getParent: function(elem, num){
		num = num || 1;
		for(var i = 0; i < num; i++) {
			if(elem != null) {
				elem = elem.parentNode;
			}
		}
		return elem;
	},
	//아이디로 엘리먼트 찾기
	//as.getId('element_ID');
	getId: function(name){
		return document.getElementById(name);
	},
	//전체 엘리먼트 또는 특정 요소에 속하는 모든 태그 엘리먼트 찾기
	//as.getTag('tag_name');   or   as.tag('tag_name')[0];   or   as.tag('tag_name', element);
	getTag: function(name, elem) {
		return (elem || document).getElementsByTagName(name);
	},

	//특정 클래스를 갖는 엘리먼트 모두 찾기
	//as.getClass('class_name', 'tag_type');   or   as.class('class_name', 'tag_type')[0];   or   as.class('class_name');
	getClass: function(name, type){
		var r = [];
		//클래스 이름 찾기
		var re = new RegExp('(^|\\s)' + name + '(\\s|$)');
		//특정 타입 엘리먼트 또는 전체 엘리먼트에서 찾기
		var e = document.getElementsByTagName( type || '*');
		for( var j = 0; j<e.length; j++) {
			//엘리먼트가 클래스를 포함한 경우 반환값에 추가
			if( re.test(e[j].className) ) {
				r.push( e[j] );
			}
		}
		return r;
	},
	//특정 클래스가 있으면 true 반환
	//as.hasClass('class_name', element);
	hasClass: function(name, elem){
		var re = new RegExp('(^|\\s)' + name + '(\\s|$)');
		return re.test(elem.className);
	},
	//addEvent, removeEvent, handleEvent
	//written by Dean Edwards, 2005
	//http://dean.edwards.name/weblog/2005/10/add-event/
	//as.addEvent( element, 'event_type', function )
	addEvent: function(element, type, handler){
		//각 이벤트 처리기에 고유 ID 부여
		if (!handler.$$guid) {
			handler.$$guid = as.addEvent.guid++;
		}
		//대상 에릴먼트의 이벤트 타입들에 대한 해시 테이블 생성
		if (!element.events) {
			element.events = {};
		}
		//엘리먼트-이벤트 쌍에 대한 이벤트 처리기들의 해시 테이블 생성
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			//존재할 경우 기존의 이벤트 처리기 저장
			if (element["on" + type]) {
				handlers[0] = element["on" + type];
			}
		}
		//이벤트 처리기를 해시 테이블에 저장
		handlers[handler.$$guid] = handler;
		//모든 작업을 담당하는 이벤트 처리기 할당
		element["on" + type] = handleEvent;
	},
	//as.removeEvent( element, 'event_type', function )
	removeEvent: function(element, type, handler){
		//해시 테이블에서 이벤트 처리기 삭제
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	},
	handleEvent: function(event){
		//이벤트 객체를 얻는다.
		event = event || window.event;
		//이벤트 처리기들을 담고 있는 해시 테이블에 대한 참조를 얻는다.
		var handlers = this.events[event.type];
		//이벤트 처리기를 실행한다.
		for (var i in handlers) {
			this.$$handleEvent = handlers[i];
			this.$$handleEvent(event);
		}
	},
	//dom이 준비되면 함수 실행하기
	//as.domReady(function(){ ... });
	domReady: function(f){
		//dom이 이미 로딩되었으면 즉시 함수 실행
		if( as.domReady.done ) {
			return f();
		}
		//이미 어떤 함수를 추가한 적이 있다면
		if( as.domReady.timer ) {
			//실행될 함수 목록에 추가
			as.domReady.ready.push(f);
		} else {
			//페이지 로딩이 먼저 끝날 경우를 위해 이벤트 추가
			as.addEvent( window, 'load', as.isDomReady );
			//실행 될 함수들의 배열 초기화
			as.domReady.ready = [f];
			//dom이 준비되었는지 최대한 빨리 확인
			as.domReady.timer = setInterval( as.isDomReady, 13 );
		}
	},
	//dom이 탐색 가능한 상태인지 확인
	isDomReady: function(){
		//페이지가 준비되었다면 무시
		if( as.domReady.done) {
			return false;
		}
		//여러가지 함수와 요소에 접근할 수 있는지 확인
		if( document && document.getElementsByTagName && document.getElementById && document.body ) {
			//접근이 가능하면 확인 중지
			clearInterval( as.domReady.timer );
			as.domReady.timer = null;
			//대기중인 모든 함수 실행
			for( var i = 0; i < as.domReady.ready.length; i++ ) {
				as.domReady.ready[i]();
			}
			as.domReady.ready = null;
			as.domReady.done = true;
		}
	},
	//엘리먼트에서 텍스트 내용만 얻기
	//as.text(element);
	text: function(elem){
		var t = '';
		elem = elem.childNodes || elem;
		for(var i = 0; i<elem.length; i++) {
			t += elem[i].nodeType != 1 ? elem[i].nodeValue : as.text(elem[i].childNodes);
		}
		return t;
	},
	//어트리뷰트 존재 여부 체크
	//as.hasAttribute('name', element);
	hasAttribute: function(name, elem) {
		return elem.getAttribute(name) != null;
	},
	//어트리뷰트 속성 얻기, 설정하기
	//as.attr(element, 'name', 'value');
	attr: function(elem, name, value){
		if( !name || name.constructor != String) return '';
		name = name;
		if( value != null ) {
			elem[name] = value;
			if( elem.setAttribute ) {
				elem.setAttribute(name, value);
			}
		}
		return elem[name] || elem.getAttribute(name) || '';
	},
	//엘리먼트 생성
	//as.create('div');
	create: function(elem) {
		return document.createElementNS ?
			    document.createElementNS( 'http://www.w3.org/1999/xhtml', elem ) :
			    document.createElement(elem);
	},
	//엘리먼트를 다른 엘리먼트 앞에 삽입
	//as.before(insert_element, '<div>Test Element</div>');
	before: function(parent, before, elem) {
		//parent 노드가 제공되지 않았는지 확인
		if(elem == null) {
			elem = before;
			before = parent;
			parent = before.parentNode;
		}
		//엘리먼트들의 배열
		var elems = as.checkElem(elem);
		//엘리먼트들을 앞에다 붙이기 위해 배열을 뒤에서 부터 반복
		for( var i = elems.length - 1; i>=0; i--) {
			as.getParent.insertBefore( elems[i], before );
		}
	},
	//엘리먼트를 다른 엘리먼트의 자식으로 추가
	//as.append(insert_element, '<div>Test Element</div>');
	append: function(parent, elem) {
		var elems = as.checkElem(elem);
		for(var i = 0; i <= elems.length; i++) {
			as.getParent.appendChild(elems[i]);
		}
	},
	//문자열만 제공된 경우 텍스트 노드로 변환하는 헬퍼 함수
	//checkElem( element );
	checkElem: function(a) {
		var r = [];
		//전달 인자가 배열이 아닐 경우 배열로 강제 변경
		if(a.constructor != Array) a = [a];
		for( var i = 0; i<a.length; i++) {
			if( a[i].constructor == String ) {
				//HTML을 담기위한 엘리먼트 생성
				var div = document.createElement('div');
				//HTML을 집어넣어 DOM 구조로 변환
				div.innerHTML = a[i];
				//임시 DIV에서 DOM 구조를 다시 꺼낸다.
				for(var j = 0; j<div.childNodes.length; j++) {
					r[r.length] = div.childNodes[j];
				}
			} else if( a[i].length ) {
				//DOM 노드의 배열로 가정
				for(var j = 0; j<a[i].length; j++) {
					r[r.length] = a[i][j];
				}
			} else {
				//DOM 노드로 가정
				r[r.length] = a[i];
			}
		}
		return r;
	},
	//DOM에서 노드를 제거
	//as.remove(element);
	remove: function(elem) {
		if(elem) {
			elem.parentNode.removeChild(elem);
		}
	},
	//엘리먼트의 모든 자식을 제거
	//as.empty(element);
	empty: function(elem) {
		while(elem.firstChild) {
			as.remove(elem.firstChild);
		}
	},
	//엘리먼트의 CSS 프로퍼티 값 얻기
	//as.getStyle(element, css_style);
	getStyle: function(elem, name) {
		if(elem.style[name]) {
			return elem.style[name];
		} else if(elem.currentStyle) {
			//IE용 메서드 사용
			return elem.currentStyle[name];
		} else if(document.defaultView && document.defaultView.getComputedStyle) {
			//IE용 메서드도 사용할 수 없으면 W3C 메서드 사용
			//이 메서드는 textAlign 대신, text-align 형태의 문법을 사용
			name = name.replace(/(A-Z)/g, "-$1");
			name = name.toLowerCase();
			//style 객체를 얻고 프로퍼티의 값을 얻는다.
			var s = document.defaultView.getComputedStyle(elem, '');
			return s && s.getPropertyValue(name);
		} else {
			return null;
		}
	},
	//문서상의 X좌표 얻기
	//as.getPageX(element);
	getPageX: function(elem) {
		var p = 0;
		while( elem.offsetParent ) {
			//모든 부모의 오프셋을 더한다.
			p += elem.offsetLeft;
			//부모의 엘리먼트를 얻은 후 작업 진행
			elem = elem.offsetParent;
		}
		return p;
	},
	//문서상의 Y좌표 얻기
	//as.getPageY(element);
	getPageY: function(elem) {
		var p = 0;
		while( elem.offsetParent ) {
			//모든 부모의 오프셋을 더한다.
			p += elem.offsetTop;
			//부모의 엘리먼트를 얻은 후 작업 진행
			elem = elem.offsetParent;
		}
		return p;
	},
	//부모 엘리먼트의 상대적인 X좌표 얻기
	//as.getParentX(element);
	getParentX: function(elem) {
		return elem.parentNode == elem.offsetParent ?
		//offsetParent가 주어진 엘리먼트의 부모일 경우
		elem.offsetLeft :
		//전체 페이지에 대한 상대 위치를 구한 후 둘 간의 차이를 계산
		as.getPageX(elem) - as.getPageX(elem.parentNode);
	},
	//부모 엘리먼트의 상대적인 Y좌표 얻기
	//as.getParentY(element);
	getParentY: function(elem) {
		return elem.parentNode == elem.offsetParent ?
		//offsetParent가 주어진 엘리먼트의 부모일 경우
		elem.offsetTop :
		//전체 페이지에 대한 상대 위치를 구한 후 둘 간의 차이를 계산
		as.getPageY(elem) - as.getPageY(elem.parentNode);
	},
	//엘리먼트의 X좌표 얻기
	//as.getPosX(element);
	getPosX: function(elem) {
		return parseInt( as.getStyle(elem, 'left') );
	},
	//엘리먼트의 Y좌표 얻기
	//as.getPosY(element);
	getPosY: function(elem) {
		return parseInt( as.getStyle(elem, 'top') );
	},
	//엘리먼트의 X좌표 설정하기
	//as.setPosX(element, px);
	setPosX: function(elem, pos) {
		elem.style.left = pos + 'px';
	},
	//엘리먼트의 Y좌표 설정하기
	//as.setPosY(element, px);
	setPosY: function(elem, pos) {
		elem.style.top = pos + 'px';
	},
	//엘리먼트에 상대위치 X 추가하기
	//as.offsetPosX(element, px)
	offsetPosX: function(elem, pos) {
		//엘리먼트의 x좌표를 얻고 그 값에 오프셋을 더한다.
		as.setPosX( as.getPosX(elem) + pos );
	},
	//엘리먼트에 상대위치 Y 추가하기
	//as.offsetPosX(element, px)
	offsetPosY: function(elem, pos) {
		//엘리먼트의 x좌표를 얻고 그 값에 오프셋을 더한다.
		as.setPosY( as.getPosY(elem) + pos );
	},
	//엘리먼트의 높이 구하기
	//as.getHeight(element) {
	getHeight: function(elem) {
		return parseInt( as.getStyle(elem, 'height') );
	},
	//엘리먼트의 넓이 구하기
	//as.getWidth(element) {
	getWidth: function(elem) {
		return parseInt( as.getStyle(elem, 'width') );
	},
	//엘리먼트의 최대 높이 구하기
	//as.getFullHeight(element);
	getFullHeight: function(elem) {
		//엘리먼트가 block면 offsetHeight 사용
		if( as.getStyle(elem, 'display') != 'none' ) {
			return elem.offsetHeight || as.getHeight(elem);
		}
		//정확한 값을 위해 CSS 재설정
		var old = as.resetStyle( elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		//엘리먼트의 최대 높이 알아내기
		var h = elem.clientHeight || as.getHeight(elem);
		//CSS 프로퍼티 복구
		as.restoreStyle(elem, old);
		return h;
	},
	//엘리먼트의 최대 넓이 구하기
	//as.getFullHeight(element);
	getFullWidth: function(elem) {
		//엘리먼트가 block면 offsetWidth 사용
		if( as.getStyle(elem, 'display') != 'none' ) {
			return elem.offsetWidth || as.getWidth(elem);
		}
		//정확한 값을 위해 CSS 재설정
		var old = as.resetStyle( elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		//엘리먼트의 최대 높이 알아내기
		var h = elem.clientWidth || as.getWidth(elem);
		//CSS 프로퍼티 복구
		as.restoreStyle(elem, old);
		return h;
	},
	//CSS 재설정하기
	//as.resetStyle(element, object);
	resetStyle: function(elem, prop) {
		var old = {};
		for( var i in prop ) {
			old[i] = elem.style[i];
			elem.style[i] = prop[i];
		}
		return old;
	},
	//CSS 리셋 후 설정 복구
	//as.restoreStyle(element, object);
	restoreStyle: function(elem, prop) {
		for( var i in prop ) {
			elem.style[i] = prop[i];
		}
	},
	hide: function(elem) {
		var currentDisplay = as.getStyle(elem, 'display');
		//나중을 위해 현재값 저장
		if( currentDisplay != 'none' ) {
			elem.$oldDisplay = currentDisplay;
		}
		elem.style.display = 'none';
	},
	show: function(elem) {
		elem.style.display = elem.$oldDisplay || 'block';
	},
	setOpacity: function(elem, level) {
		if( elem.filters ) {
			elem.filters.alpha.opacity = level;
		} else {
			elem.style.opacity = level / 100;
		}
	},
	slideDown: function(elem, time) {
		var t = time || 100;
		elem.style.height = '0px';
		as.show(elem);
		var h = as.getFullHeight(elem);
		//100 == 초당 20프레임
		for( var i = 0; i<= t; i+= 5) {
			//올바른 'i'값을 얻기위해 클로저 설정
			(function(){
				var pos = i;
				setTimeout(function(){
					//엘리먼트에 새로운 높이 설정
					elem.style.height = ((pos/100) * h) + 'px';
				}, (pos+1) * 10);
			})();
		}
	},
	fadeIn: function(element, time) {
		var t = time || 100;
		as.setOpacity(elem, 0);
		as.show(elem);
		for( var i = 0; i<=t; i+=5) {
			(function(){
				var pos = i;
				setTimeout(function(){
					as.setOpacity(elem, pos);
				}, (pos+1) * 10);
			})();
		}
	},
	getMouseX: function(e) {
		e = e || window.event;
		return e.pageX || e.clientX + document.body.scrollLeft || 0;
	},
	getMouseY: function(e) {
		e = e || window.event;
		return e.pageY || e.clientY + document.body.scrollTop || 0;
	},
	//대상 엘리먼트에 대한 상대적 마우스 좌표 X
	getElementX: function(e) {
		return ( e && e.layerX ) || window.event.offsetX;
	},
	getElementY: function(e) {
		return ( e && e.layerY ) || window.event.offsetY;
	},
	//웹 페이지의 높이
	getPageHeight: function() {
		return document.body.scrollHeight;
	},
	getPageWidth: function() {
		return document.body.scrollWidth;
	},
	//스크롤 X 위치
	getScrollX: function() {
		var de = document.documentElement;
		//pageXOffset를 지원하면
		return self.pageXOffset ||
		//루트 노트를 기준으로 왼쪽으로 스크롤된 위치를 계산
		( de && de.scrollLeft ) ||
		//body 엘리먼트를 기준으로 스크롤된 위치를 계산
		document.body.scrollLeft;
	},
	getScrollY: function() {
		var de = document.documentElement;
		//pageXOffset를 지원하면
		return self.pageYOffset ||
		//루트 노트를 기준으로 왼쪽으로 스크롤된 위치를 계산
		( de && de.scrollTop ) ||
		//body 엘리먼트를 기준으로 스크롤된 위치를 계산
		document.body.scrollTop;
	},
	//브라우저 뷰포트의 높이 얻기
	getWindowHeight: function() {
		var de = document.documentElement;
		return self.innerHeight || ( de && de.clientHeight ) || document.body.clientHeight;
	},
	getWindowWidth: function() {
		var de = document.documentElement;
		return self.innerWidth || ( de && de.clientWidth ) || document.body.clientWidth;
	},
	form: {
		//입력 엘리먼트에 입력된 정보가 있는지 체크
		//as.form.checkrequired(element);
		checkRequired: function(elem){
			if( elem.type == 'checkbox' || elem.type == 'radio' ) {
				return getInputsByName( elem.name ).numChecked;
			} else {
				return elem.value || elem.value == elem.defaultValue;
			}
		},
		//주어진 이름을 가진 입력 엘리먼트 모두 찾기
		getInputsByName: function(name) {
			var results = [];
			//체크된 항목의 개수 기억
			results.numChecked = 0;
			//문서의 모든 입력 엘리먼트 찾기
			var input = document.getElementsByTagName('input');
			for( var i = 0; i < input.length; i++ ) {
				//주어진 이름을 가진 필드 모두 찾기
				if( input[i].name == name ) {
					//나중에 반환할 결과 저장
					results.push( input[i] );
					//체크된 필드개수 기억
					if( input[i].checked ) {
						results.numChecked++;
					}
				}
			}
			return results;
		},
		checkEmail: function(elem) {
			//필드에 텍스트가 입력되어 있고, 올바른 값인지 검사
			return !elem.value || /^[0-9a-zA-Z][0-9a-zA-Z\_\-\.\+]+[0-9a-zA-Z]@[0-9a-zA-Z][0-9a-zA-Z\_\-]*[0-9a-zA-Z](\.[a-zA-Z]{2,6}){1,2}$/i.test( elem.value );
		},
		//as.form.checkUrl(input_element);
		checkUrl: function(elem) {
			return !elem.value || /^(https?:\/\/)?((([a-z\d](([a-z\d-]*[a-z\d]))|([ㄱ-힣])*)\.)+(([a-zㄱ-힣]{2,}))|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/.test( elem.value );
		},
		//as.form.checkPhone(element)   or   as.form.checkPhone(element, 'cell');
		checkPhone: function(elem, type) {
			if( type == 'cell') {
				//핸드폰 번호(000-0000-0000), 일치하는 부분을 찾으면 배열로 반환(exec)
				var m = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/.exec( elem.value );
			} else {
				//일반번호(00-000-000)
				var m = /^\d{2,3}-\d{3,4}-\d{4}$/.exec( elem.value );
			}
			//올바른 번호 입력시 (000) 000-0000 형식으로 변환
			if( m !== null ) elem.value = '(' + m[1] + ') ' + m[2] + '-' + m[3];
			return !elem.value || m;
		},
		checkDate: function(elem) {
			//yyyy-mm-dd 형식으로 입력되어있는지 검사
			//1970-01-01부터 2099-12-31까지 제한 할 경우 - /^(19[7-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
			return !elem.value || /^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test( elem.value );
		},
		errMsg: {
			required: {
				msg: 'This Field is Required.',
				test: function(obj, load) {
					return obj.value || load || obj.value == obj.defaultValue;
				}
			},
			email: {
				msg: 'Not a Valid Email Address.',
				test: function(obj) {
					return !obj.value || /^[0-9a-zA-Z][0-9a-zA-Z\_\-\.\+]+[0-9a-zA-Z]@[0-9a-zA-Z][0-9a-zA-Z\_\-]*[0-9a-zA-Z](\.[a-zA-Z]{2,6}){1,2}$/i.test( obj.value );
				}
			},
			url: {
				msg: 'Not a Valid Email Address.',
				test: function(obj) {
					return !obj.value || /^(https?:\/\/)?((([a-z\d](([a-z\d-]*[a-z\d]))|([ㄱ-힣])*)\.)+(([a-zㄱ-힣]{2,}))|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/.test( obj.value );
				}
			},
			date: {
				msg: 'Not a Valid Email Address.',
				test: function(obj) {
					return !obj.value || /^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test( obj.value );
				}
			},
			phone: {
				msg: 'Not a Valid Phone Address.',
				test: function(obj) {
					var m = /^\d{2,3}-\d{3,4}-\d{4}$/.exec( elem.value );
					if( m !== null ) obj.value = '(' + m[1] + ') ' + m[2] + '-' + m[3];
					return !obj.value || m;
				}
			}
		},
		//폼검증
		//as.form.validateForm( form_element, boolean )
		validateForm: function(form, load) {
			var valid = true;
			//form.elements는 폼 내의 모든 필드를 참조하는 배열
			for( var i = 0; form.elements.length; i++ ) {
				as.form.hideErrors( form.elements[i]);
				//필드에 입력된 값이 올바른 지 검사
				if( !as.form.validateField(form.elements[i], load )) {
					valid = false;
				}
				//필드에 올바른 값이 입력되면 true, 아니면 false 반환
				return valid;
			}
		},
		validateField: function(elem, load) {
			var errors = [];
			//사용가능한 모든 검증기법 순회
			for( var name in as.form.errMsg ) {
				//에러종류에 대응하는 클래스가 있는지 검사
				var re = new RegExp("(^|\\s)" + name + "(\\s|$)");
				//엘리먼트에 클래스가 있는지 검사하고, 검증 통과 가능여부 검사
				if( re.test(elem.className) && !as.form.errMsg[name].test(elem, load) ) {
					//검증에 실패하면 리스트에 에러메세지 추가
					errors.push( as.form.errMsg[name].msg);
				}
			}
			//에러 메세지 출력
			if( errors.length ) {
				as.form.showErrors(elem, errors);
			}
			//하나라도 검증이 실패할 경우 false 반환
			return errors.length > 0;
		},
		hideErrors: function(elem) {
			var next = elem.nextSibling;
			if( next && next.nodeName == 'UL' && next.className =='errors' ) {
				elem.parentNode.removeChild(next);
			}
		},
		showErrors: function(elem, errors) {
			var next = elem.nextSibling;
			if( next && (next.nodeName != 'UL' || next.className != 'errors') ) {
				next = document.createElement('ul');
				next.className = 'errors';
				elem.parentNode.insertBefore(next, elem.nextSibling);
			}
			for( var i = 0; i < errors.length; i++ ) {
				var li = document.createElement('li');
				li.innerHTML = errors[i];
				next.appendChild(li);
			}
		},
		//검증시점
		//폼 제출시
		watchForm: function(form) {
			addEvent(form, 'submit', function(){
				return validteForm(form);
			});
		},
		//필드 값 수정시
		watchField: function(form) {
			for( var i = 0; i < form.elements.length; i++ ) {
				addEvent(form.elements[i], 'blur', function(){
					return validateField(this);
				});
			}
		},
		watchFormLoad: function() {
			addEvent(window, 'load', function(){
				var forms = document.getElementsByTagName('form');
				for( var i = 0; i < form.elements.length; i++ ) {
					return validateForm( forms[i], true );
				}
			});
		}
	},
	//AJAX
	//as.ajax({options});
	ajax: function(){
		options = {
			//요청타입
			type: options.type || 'POST',
			//요청을 전달할 URL
			url: options.url || '',
			//요청 후 타임아웃 대기 시간
			timeout: options.timeout || 5000,
			//요청 완료, 실패, 성공 시 콜백 함수
			onComplete: options.onComplete || function(){},
			onError: options.onError || function(){},
			onSuccess: options.onSuccess || function(){},
			//서버에서 반환할 데이터 타입
			data: options.data || ''
		};
		//요청 객체 생성
		var xml = new XMLHttpRequest();
		//비동기 요청 생성
		xml.open(options.type, options.url, true);
		//5초간 대기 후 요청을 타임아웃 처리
		var timeoutLength = options.timeout;
		//요청 성공 시점 저장
		var requestDone = false;
		//5초후 실행되는 콜백 초기화(아직 수행 중일 겨우 요청 취소)
		setTimeout(function(){
			requestDone = true;
		}, timeoutLength);
		//문서 갱신 상태 감시
		xml.onreadystatechange = function(){
			//데이터 로딩 및 타임아웃이 되지 않았을 경우
			if( xml.readyState == 4 && !requestDone ) {
				if( httpSuccess(xml)) {
					//요청이 성공했을 경우 서버에서 반환한 데이터와 함께 콜백 실행
					options.onSuccess(httpData(xml, options.type));
				} else {
					//에러 콜백 실행
					options.onError();
				}
			}
			//완료 콜백 실행
			options.onComplete();
			//메모리 누수 방지를 위해 메모리 해제
			xml = null;
		};
		//서버 접속
		xml.send();
		//HTTP 응답 성공 확인
		function httpSuccess(r) {
			try {
				//로컬 파일 요청시 서버 상태가 반환되지 않거나 상태 코드 200번대 또는 문서가 변경되지 않았으면 성공으로 분류
				return !r.status && location.protocol == 'file:' || (r.status >= 200 && r.status < 300) || r.status == 304 ||
				//사파리는 파일이 변경되지 않았을 경우 빈 상태 코드 반환
				navigator.userAgent.indexOf('Safari') >= 0 && typeof r.status == 'undefined';
			} catch(e) {}
			//상태 검사 실패시 요청 실패로 간주
			return false;
		}
		//HTTP 응답에서 올바른 데이터 추출
		function httpData(r, type) {
			//content-type 헤더를 받아옴
			var ct = r.getResponseHeader('content-type');
			//기본 타입이 명시되지 않았으면 서버에서 받은 데이터의 XML 형태 검사
			var data = !type && ct && ct.indexOf('xml') >= 0;
			data = type == 'xml' || data ? r.responseXML : r.resonseText;
			//지정된 타입이 script이면 반환된 응답데이터를 자바스크립트로 실행
			if(type == 'script') {
				evel.call(window, data);
			}
			//응답 데이터를 반환
			return data;
		}
	}//AJAX
};

//addEvent에 고유 ID를 부여하는 카운터
as.addEvent.guid = 1;