/*!
 * astrap jquery plugin library v1.0
 * https://www.attrest.com/astrap/
 *
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Includes jquery.js
 * https://jquery.com/
 *
 * Date: 2016-11-16
 */

(function( $ ) {
	$.as = {};
	$.as.ui = {
		/*
			반응형 오버플로우 테이블(IE10+)
			Use --> $.as.ui.responsiveOverflowTable( '.target_table_class', { option } );
		*/
		responsiveOverflowTable: function(targetElement, option){
			var targetElem = targetElement,
						tableRows, tableColumns;
			var options = $.extend({
				breakPoint: 620
			}, option);

			$(targetElem).addClass('as-ui-responsive-overflow-table');
			tableRows = $('.as-ui-responsive-overflow-table th').length;
			tableColumns = $('.as-ui-responsive-overflow-table tr').length;

			tableColumnSet();
			$(window).resize(function() { tableColumnSet(); });

			function tableColumnSet() {
					if ($(window).width() < options.breakPoint) {
							for (i=0;i < tableRows; i++) {
									var maxHeight = $(targetElem + ' th:nth-child(' + i + ')').outerHeight();
									for (j=0; j < tableColumns; j++) {
											if ($(targetElem + ' tr:nth-child(' + j + ') td:nth-child(' + i + ')').outerHeight() > maxHeight) {
													maxHeight = $(targetElem + ' tr:nth-child(' + j + ') td:nth-child(' + i + ')').outerHeight();
											}
											if ($(targetElem + ' tr:nth-child(' + j + ') td:nth-child(' + i + ')').prop('scrollHeight') > $(targetElem + ' tr:nth-child(' + j + ') td:nth-child(' + i + ')').outerHeight()) {
													maxHeight = $(targetElem + ' tr:nth-child(' + j + ') td:nth-child(' + i + ')').prop('scrollHeight');
											}
									}
									for (j=0; j < tableColumns; j++) {
											$(targetElem + ' tr:nth-child(' + j + ') td:nth-child(' + i + ')').css('height',maxHeight);
											$(targetElem + ' th:nth-child(' + i + ')').css('height',maxHeight);
									}
							}
					} else {
							$(targetElem + ' td, ' + targetElem + ' th').removeAttr('style');
					}
			}
		},

		/*
			스크롤 이동 버튼
			Use --> $.as.ui.scrollTarget( $('from_element'), $('to_element'), { option } );
		*/
		scrollTarget: function(fromElem, toElem, option){
			var fromElem = fromElem,
						toElem = toElem;
			var options = $.extend({
				speed: 200,
				posOffset: 0,
				clickable: false,
				complete: function(){}
			}, option);
			if( options.clickable ) {
				$('body').animate({
					scrollTop: toElem.offset().top + options.posOffset
				}, options.speed, options.complete);
			} else {
				fromElem.click(function(e){
					e.preventDefault();
					$('body').animate({
						scrollTop: toElem.offset().top + options.posOffset
					}, options.speed, options.complete);
				});
			}
		},

		/*
			스크롤 버튼 자동 생성
			Use --> $.as.ui.scrollButtons( $('target_element'), { option } );
		*/
		scrollButtons: function(targetElem, option){
			var options = $.extend({
				speed: 1200,
				insert: 'body',
				id: 'scrollTarget',
				activeClass: 'active',
				useNavigationButton: true,
				useContentButton: false,
				container: '<nav class="side-buttons-container"></nav>',
				contentContainer: '<nav class="content-buttons-container"></nav>',
				contentButtonClass: 'scroll-button',
				upClass: 'ascon ascon-arrow-top-100',
				downClass: 'ascon ascon-arrow-bottom-100',
				topClass: 'ascon ascon-arrow-top-100',
				callback: {
					scrollStart: function(){},
					scrollEnd: function(){}
				}
			}, option);

			var targetElem = targetElem;

			//사이드 네이게이션 생성
			var createButtonsContainer = $( options.container );
			for(var i = 1 ; i < targetElem.length + 1 ; i++) {
				createButtonsContainer.append( $('<li><a href="' + (options.id + i) + '">' + i + '</a></li>') );
			}
			$( options.insert ).append(createButtonsContainer);
			createButtonsContainer.wrapInner('<ul></ul>');

			//사이드 네비게이션 콘트롤
			createButtonsContainer.find('li').each(function(index){
				var sectionIndex = index + 1;
				var dotButton = $(this).find('a');

				dotButton.click(function(e){
					e.preventDefault();
					options.callback.scrollStart();
					$('html, body').stop().animate({
						scrollTop:$('#scrollTarget' + sectionIndex).offset().top
					}, options.speed, function(){
						window.scrollTargetTimeoutEvent;
						$(window).scroll(function(){
							clearTimeout( window.scrollTargetTimeoutEvent );
							window.scrollTargetTimeoutEvent = setTimeout(function(){
								options.callback.scrollEnd();
							}, 250);
						});
					});
				});
			});

			//콘텐츠 네비게이션 버튼 생성
			targetElem.each(function(index){
				var num = index + 1;
				$(this).attr( 'id', 'scrollTarget' + num );

				if( options.useContentButton ) {
					var contentButtonsContainer = $( options.contentContainer );
					if(index == 0) {
						contentButtonsContainer.append( $('<a class="' + options.contentButtonClass + '">Down</a>').addClass( options.downClass ).attr('href', '#' + options.id + (num + 1) ) );
						$(this).append( contentButtonsContainer );
					} else  if(num == targetElem.length){
						contentButtonsContainer.append( $('<a class="' + options.contentButtonClass + '">Top</a>').addClass( options.topClass ).attr('href', '#' + options.id + 1 ) );
						$(this).append( contentButtonsContainer );
					} else {
						contentButtonsContainer
							.append( $('<a class="' + options.contentButtonClass + '">Up</a>').addClass( options.upClass ).attr('href', '#' + options.id + (num - 1) ) )
							.append( $('<a class="' + options.contentButtonClass + '">Down</a>').addClass( options.downClass ).attr('href', '#' + options.id + (num + 1) ) );
						$(this).append( contentButtonsContainer );
					}
				}
			});

			if( options.useContentButton ) {
				//컨텐츠 네비게이션 콘트롤
				$( '.' + options.contentButtonClass ).click(function(e){
					e.preventDefault();
					options.callback.scrollStart();
					var target_id = $(this).attr('href');
					$('html, body').animate({
						scrollTop: $(target_id).offset().top
					}, options.speed, function(){
						window.scrollTargetTimeoutEvent;
						$(window).scroll(function(){
							clearTimeout( window.scrollTargetTimeoutEvent );
							window.scrollTargetTimeoutEvent = setTimeout(function(){
								options.callback.scrollEnd();
							}, 250);
						});
					});
				});
			}

			drowCurrentPosition();

			// 스크롤 시 사이드 네비게이션에 현재 위치 표시
			$(window).bind('scroll',function(e){
				drowCurrentPosition();
			});

			function drowCurrentPosition(){
				var bt = createButtonsContainer.find('li').length;
				var st = $(document).scrollTop();
				var pos = [];

				for(var i=0 ; i < bt ; i++) {
					var index = i + 1;

					if(index == 1) {
						pos[i] = 0;
					} else {
						pos[i] = ( ($('#' + options.id + index).offset().top - $('#' + options.id + i).offset().top) / 2 ) + $('#' + options.id + i).offset().top;
					}
					//console.log( 'index -> ' + index + ' :: pos -> ' +  pos[i] );
				}

				createButtonsContainer.find('a').removeClass( options.activeClass );
				for(var j=0; j < bt ; j++) {
					if(st >= pos[j] && st < pos[j + 1]) {
						createButtonsContainer.find( 'a:eq(' + j + ')' ).addClass( options.activeClass );
					} else if( st >= pos[bt - 1] ) {
						createButtonsContainer.find( 'a:eq(' + ( bt - 1 ) + ')' ).addClass( options.activeClass );
					}
				}
			};

		},

		/*
			스크롤 헤더
			Use --> $.as.ui.scrollHeader( $('target_element'), { option } );
		*/
		scrollHeader: function(targetElement, option){
			var targetElem = targetElement,
						didScroll,
						lastScrollTop = 0;

			var options = $.extend({
				useClass: undefined,
				delta: 5,
				speed: 250,
				inverse: false,
				scrollHeight: targetElem.outerHeight()
			}, option);

			$(window).scroll(function(event){
					didScroll = true;
			});

			setInterval(function() {
					if (didScroll) {
							hasScrolled();
							didScroll = false;
					}
			}, 250);

			function hasScrolled() {
					var st = $(this).scrollTop();

					if(Math.abs(lastScrollTop - st) <= options.delta)
							return;

					if (st > lastScrollTop && st > options.scrollHeight){

							// Scroll Down
							if( options.useClass !== undefined ) {
								if( options.inverse ) {
									targetElem.removeClass(options.useClass);
								} else {
									targetElem.addClass(options.useClass);
								}
							} else {
								if( options.inverse ) {
									targetElem.stop().animate({
							top: 0
						}, options.speed);
								} else {
									targetElem.stop().animate({
							top: -options.scrollHeight
						}, options.speed);
								}
							}
					} else {
							// Scroll Up
							if( options.useClass !== undefined ) {
								if( options.inverse ) {
									targetElem.addClass(options.useClass);
								} else {
									targetElem.removeClass(options.useClass);
								}
							} else {
								if( options.inverse ) {
									targetElem.stop().animate({
							top: -options.scrollHeight
						}, options.speed);
								} else {
									targetElem.stop().animate({
							top: 0
						}, options.speed);
								}
						 }
					}
					lastScrollTop = st;
			}
		},

		/*
			스크롤 시 Browser, Element의 끝에 도달했는지 체크
			Use --> $.as.ui.scrollEndCheck( $('target_element'), callback, { option } );
		*/
		scrollEndCheck: function(targetElem, fn, option){
			var targetElem = targetElem,
						isWindow = targetElem.height() == $(window).height();
			var options = $.extend({
				delay: 250,
				correct: 0.2
			}, option);

			targetElem.bind('scroll', function(){
				var st = targetElem.scrollTop();
				targetElem.scrollEndCheckEvent;

				targetElem.scroll( function(){
					clearTimeout( targetElem.scrollEndCheckEvent );
					targetElem.scrollEndCheckEvent = setTimeout( function(){
						if(!isWindow) {
							if (targetElem[0].scrollHeight - targetElem.scrollTop() <= targetElem.outerHeight() + options.correct) {
								fn();
								//console.log(options.delay);
							}
						} else {
							if ($(document).height() - $(window).height() <= st + options.correct) {
								fn();
							}
						}
					}, options.delay );
				} );
			});
		},

		/*
			스크롤 시 함께 움직이는 레이어
			Use --> $.as.ui.scrollLayer( $(target_element), { option } } );
		*/
		scrollLayer: function(targetElem, option){
			var targetElem = targetElem,
				currentPosition = parseInt(targetElem.css("top"));

			var options = $.extend({
				topOffset: 0,
				async: false,
				speed: 500,
				startPoint: 100,
				callback: {
					onStart: function(){},
					onScroll: function(){}
				}
			}, option);

			$(window).scroll(function() {
				var position = $(window).scrollTop();
				if( options.async ) {
					// topOffset 설정 시 스크롤 중에만 topOffset 적용
					if( options.topOffset !== 0 && position <= options.startPoint ) {
						targetElem.stop().animate({"top": currentPosition + "px"}, options.speed);
						options.callback.onStart();
					} else {
						targetElem.stop().animate({"top": position + currentPosition + options.topOffset + "px"}, options.speed);
						options.callback.onScroll();
					}
				} else {
					// topOffset 설정 시 항상 그대로 유지
					targetElem.stop().animate({"top": position + currentPosition + options.topOffset + "px"}, options.speed);
						options.callback.onScroll();
				}
			});
		},


		/*
			오브젝트의 이동 속도를 제어하여 패럴랙스 효과를 주는 플러그인
			Use --> $.as.ui.parallaxObject( $(targetElement), option );
		*/
		parallaxObject: function(targetElement, option){
			var targetElem = targetElement;
			var options = $.extend({
				direction: 'bottom',
				speed: 0.4
			}, option);

			$(window).scroll(function() {
				var st = $(this).scrollTop();

				if(options.direction === 'top') {
					targetElem.css({
						'top': -st * options.speed
					});
				} else if(options.direction === 'bottom') {
					targetElem.css({
						'bottom': -st * options.speed
					});
				} else if(options.direction === 'left') {
					targetElem.css({
						'left': -st * options.speed
					});
				} else if(options.direction === 'right') {
					targetElem.css({
						'right': -st * options.speed
					});
				}
			});
		},


		/*
			아코디언 모듈
			Use --> $.as.ui.accordionModule( $(target_element), option );
		*/
		accordionModule: function(targetElem, option){
			var targetElem = targetElem,
				item;
			var options = $.extend({
				speed: 250,
				showAll: false,
				multiple: false,
				container: 'ul',
				subContainer: 'li',
				linker: 'a',
				dataAttribute: 'data-option',
				preventDefault: true,
				callback: {
					slideOpen: function(){},
					slideClose: function(){}
				}
			}, option);

			item = targetElem.find(options.container).parent(options.subContainer).children(options.linker);
			item.attr(options.dataAttribute, 'off');

			item.unbind('click').on('click', function(e) {
				var a = $(this);
				// callback
				if( a.attr(options.dataAttribute) == 'on' ) {
					options.callback.slideClose();
				} else {
					options.callback.slideOpen();
				}
				if (!options.multiple) {
					a.parent().parent().find('a[' + options.dataAttribute + '="on"]').parent(options.subContainer).children(options.container).slideUp(options.speed,
						function() {
							$(this).parent(options.subContainer).children(options.linker).attr(options.dataAttribute, 'off');
						});
				}
				if (a.attr(options.dataAttribute) == 'off') {
					if( options.preventDefault ) {
						e.preventDefault();
					}
					a.parent(options.subContainer).children(options.container).slideDown(options.speed,
						function() {
							a.attr(options.dataAttribute, 'on');
						});
				}
				if (a.attr(options.dataAttribute) == 'on') {
					if( options.preventDefault ) {
						e.preventDefault();
					}
					a.attr(options.dataAttribute, 'off');
					a.parent(options.subContainer).children(options.container).slideUp(options.speed);
				}
			});

			if (options.showAll) {
				targetElem.find(options.linker).each(function() {

					$(this).parent(options.subContainer).parent(options.container).slideDown(options.speed,
						function() {
							$(this).parent(options.subContainer).children(options.linker).attr(options.dataAttribute, 'on');
							});
				});
			} else {
				item.next(options.container).css('display', 'none'); //초기화
			}

		},

		/*
			내부 링크 이동 메뉴 만들기
			Use --> $.as.ui.createInnerLinkMenu( $(target_elements), { option } );
		*/
		createInnerLinkMenu: function(targetElems, option){

			var options = $.extend({
				insertTo: $('body'),
				navigationClass: 'as-nav',
				subMenuClass: 'as-nav-primary',
				secondaryClass: 'as-nav-secondary',
				dataSet: 'linker',
				useClass: false,
				className: '.linker',
				currentPosCheck: false,
				currentPosOffset: 160,
				activeClass: 'active',
				isAccordion: false,
				dataAttribute: 'data-option',
				complete: function(){}
			}, option);

			var targetElems = targetElems,
				navContainer = $('<nav class="' + options.navigationClass + '"></nav>'), 	// all depth level container
				subMenuContainer = $('<ul class="' + options.subMenuClass + '"></ul>'), // 1depth level container
				subMenuContainerSecond,												// 2depth level container
				subMenuContainerThird;												// 3depth level container

			targetElems.each(function(){
				var loopElem = $(this); // first each element

				if( options.useClass ) {
					if( loopElem.find( options.className ).length > 0 ) {

						var current_primary_id, current_secondary_id;

						loopElem.find( options.className ).each(function(){
							if( $(this).is('h2') ) {
								subMenuContainer.append('<li><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
								current_primary_id = $(this).attr('id');
							}
							else if( $(this).is('h3') ) {
								if( subMenuContainer.find('[href="#' + current_primary_id + '"]').parent().find('.first-level').length <= 0 ) {
									subMenuContainer.find('[href="#' + current_primary_id + '"]').parent().append('<ul class="' + options.secondaryClass + ' first-level"></ul>');
								}
								subMenuContainer.find('[href="#' + current_primary_id + '"]').parent().find('.first-level').append('<li><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
								current_secondary_id = $(this).attr('id');
							}
							else if( $(this).is('h4') ) {
								if( subMenuContainer.find('[href="#' + current_secondary_id + '"]').parent().find('.second-level').length <= 0 ) {
									subMenuContainer.find('[href="#' + current_secondary_id + '"]').parent().append('<ul class="' + options.secondaryClass + ' second-level"></ul>');
								}
								subMenuContainer.find('[href="#' + current_secondary_id + '"]').parent().find('.second-level').append('<li><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
							}

						}); // each -> loopElem
					} // end if
				} else {
					if( loopElem.find('[data-set="' + options.dataSet + '"]').length > 0 ) {

						var current_primary_id, current_secondary_id;

						loopElem.find('[data-set="' + options.dataSet + '"]').each(function(){
							if( $(this).is('h2') ) {
								subMenuContainer.append('<li><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
								current_primary_id = $(this).attr('id');
							}
							else if( $(this).is('h3') ) {
								if( subMenuContainer.find('[href="#' + current_primary_id + '"]').parent().find('.first-level').length <= 0 ) {
									subMenuContainer.find('[href="#' + current_primary_id + '"]').parent().append('<ul class="' + options.secondaryClass + ' first-level"></ul>');
								}
								subMenuContainer.find('[href="#' + current_primary_id + '"]').parent().find('.first-level').append('<li><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
								current_secondary_id = $(this).attr('id');
							}
							else if( $(this).is('h4') ) {
								if( subMenuContainer.find('[href="#' + current_secondary_id + '"]').parent().find('.second-level').length <= 0 ) {
									subMenuContainer.find('[href="#' + current_secondary_id + '"]').parent().append('<ul class="' + options.secondaryClass + ' second-level"></ul>');
								}
								subMenuContainer.find('[href="#' + current_secondary_id + '"]').parent().find('.second-level').append('<li><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a></li>');
							}

						}); // each -> loopElem
					} // end if
				} // end else

				navContainer.append( subMenuContainer );	// 전체 컨테이너에 생성된 네비게이션 추가
				options.insertTo.append( navContainer );	// 타켓 엘리먼트에 네비게이션 추가

			}); // each -> targetElem

			//현재 위치 표시
			if( options.currentPosCheck ) {
				drowCurrentPosition();
				$(window).scroll(function(){
					drowCurrentPosition();
				});

				function drowCurrentPosition(){
					var links = [];
					var bt;
					var st = $(document).scrollTop();
					var pos = [];

					//a태그의 id명 배열로 저장
					$('.as-nav-primary').find('a').each(function(index){
						var num = index + 1;
						links[index] = $(this).attr('href');
					});

					//중복값 제거
					links = links.reduce(function(a,b){
						if (a.indexOf(b) < 0 ) a.push(b);
						return a;
					},[]);

					bt = links.length;

					for(var i=0 ; i < bt ; i++) {
						var index = i + 1;

						if(index == 1) {
							pos[i] = 0;
						} else if(index == bt ) {
							pos[i] = $(links[i]).offset().top - options.currentPosOffset;
						} else {
							pos[i] = ( ($(links[index]).offset().top - $(links[i]).offset().top) / 2 ) + $(links[i]).offset().top - options.currentPosOffset;
						}
						//console.log( 'index -> ' + index + ' :: pos -> ' +  pos[i] );
					}

					subMenuContainer.find('a').removeClass( options.activeClass );

					for(var j=0; j < bt ; j++) {
						if(st >= pos[j] && st < pos[j + 1]) {
							subMenuContainer.find( 'a[href=' + links[j] + ']' ).addClass( options.activeClass );
							if( options.isAccordion ) {
								//스크롤 시 아코디언 기능 컨트롤
								if( subMenuContainer.find( 'a[href=' + links[j] + ']' ).attr( options.dataAttribute ) !== undefined && subMenuContainer.find( 'a[href=' + links[j] + ']' ).attr( options.dataAttribute ) === 'off' ) {
									subMenuContainer.find( 'a[href=' + links[j] + ']' ).trigger('click');
								}
							}
						} else if( st >= pos[bt - 1] ) {
							subMenuContainer.find( 'a[href=' + links[bt - 1] + ']' ).addClass( options.activeClass );
							if( options.isAccordion ) {
								//스크롤 시 아코디언 기능 컨트롤
								if( subMenuContainer.find( 'a[href=' + links[bt - 1] + ']' ).attr( options.dataAttribute ) !== undefined && subMenuContainer.find( 'a[href=' + links[bt - 1] + ']' ).attr( options.dataAttribute ) === 'off' ) {
									subMenuContainer.find( 'a[href=' + links[bt - 1] + ']' ).trigger('click');
								}
							}
						}
					}
				};
			}

		}, // createInnerLinkMenu

		/*
			윈도우 리사이즈 이벤트
			Use --> $.as.ui.resize( function, interval );
		*/
		resize: function(fn, interval){
			var interval = interval || 250;

			$(window).bind('resize', function(e){
				window.resizeTimeoutEvent;
				$(window).resize(function(){
					clearTimeout( window.resizeTimeoutEvent );
					window.resizeTimeoutEvent = setTimeout(function(){
						fn();
					}, interval);
				});

			});
		}

	}//$.as.ui
})(jQuery);