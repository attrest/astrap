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
			Use --> $.as.ui.scrollToTarget( $('from_element'), $('to_element'), { option } );
		*/
		scrollToTarget: function(fromElem, toElem, option){
			var fromElem = fromElem,
			      toElem = toElem;
			var options = $.extend({
				speed: 200,
				posOffset: 0,
				clickable: false,
				complete: function(){}
			}, option);
			if( options.clickable ) {
				$('html, body').animate({
					scrollTop: toElem.offset().top + options.posOffset
				}, options.speed, options.complete);
			} else {
				fromElem.click(function(e){
					e.preventDefault();
					$('html, body').animate({
						scrollTop: toElem.offset().top + options.posOffset
					}, options.speed, options.complete);
				});
			}
		},

		/*
			스크롤 헤더
			Use --> $.as.ui.scrollHeader( $('target_element'), { option } );
		*/
		scrollHeader: function(targetElement, option){
			var targetElem = targetElement,
			      didScroll,
			      lastScrollTop = 0,
			      navHeight = targetElem.outerHeight();

			var options = $.extend({
				useClass: undefined,
				delta: 5,
				speed: 250,
				inverse: false
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

			    if (st > lastScrollTop && st > navHeight){

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
							top: -navHeight
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
							top: -navHeight
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
			Use --> $.as.ui.scrollLayer( target_element, { option } } );
		*/
		scrollLayer: function(targetElem, option){
			var targetElem = targetElem,
			      currentPosition = parseInt(targetElem.css("top"));

			var options = $.extend({
				topOffset: 0,
				speed: 500,
			      breakPoint: 100,
			      callback: {
			      	onStart: function(){},
			      	onScroll: function(){}
			      }
			}, option);

			$(window).scroll(function() {
				var position = $(window).scrollTop();
				if( options.topOffset !== 0 && position <= options.breakPoint ) {
					targetElem.stop().animate({"top": currentPosition + "px"}, options.speed);
					options.callback.onStart();
				} else {
					targetElem.stop().animate({"top": position + currentPosition + options.topOffset + "px"}, options.speed);
					options.callback.onScroll();
				}
			});
		},


		/*
			오브젝트의 이동 속도를 제어하여 패럴랙스 효과를 주는 플러그인
			Use --> $.as.ui.parallaxObject(targetElement, direction, speed);
		*/
		parallaxObject: function(targetElement, direction, speed){
			var targetElem = targetElement;

			$(window).scroll(function() {
				var st = $(this).scrollTop(),
				      d = direction || 'bottom',
				      s = speed || 0.4;

				if(d === 'top') {
					targetElem.css({
						'top': -st * s
					});
				} else if(d === 'bottom') {
					targetElem.css({
						'bottom': -st * s
					});
				} else if(d === 'left') {
					targetElem.css({
						'left': -st * s
					});
				} else if(d === 'right') {
					targetElem.css({
						'right': -st * S
					});
				} else {
					targetElem.css({
						'bottom': -st * s
					});
				}
			});
		},


		/*
			아코디언 모듈
			Use --> $.as.ui.accordionModule( target_element, { speed, showAll, multiple } );
		*/
		accordionModule: function(targetElem, option){
			var targetElem = targetElem,
			      item;
			var options = $.extend({
				speed: 250,
				showAll: false,
				multiple: false,
				preventDefault: true
			}, option);

			item = targetElem.find("ul").parent("li").children("a");
			item.attr("data-option", "off");

			item.unbind('click').on("click", function(e) {
				var a = $(this);
				if (!options.multiple) {
					a.parent().parent().find("a[data-option='on']").parent("li").children("ul").slideUp(options.speed,
						function() {
							$(this).parent("li").children("a").attr("data-option", "off");
						});
				}
				if (a.attr("data-option") == "off") {
					if( options.preventDefault ) {
						e.preventDefault();
					}
					a.parent("li").children("ul").slideDown(options.speed,
						function() {
							a.attr("data-option", "on");
						});
				}
				if (a.attr("data-option") == "on") {
					if( options.preventDefault ) {
						e.preventDefault();
					}
					a.attr("data-option", "off");
					a.parent("li").children("ul").slideUp(options.speed);
				}
			});

			if (options.showAll) {
				targetElem.find("a").each(function() {

					$(this).parent("li").parent("ul").slideDown(options.speed,
						function() {
							$(this).parent("li").children("a").attr("data-option", "on");
						});
				});
			} else {
				item.next('ul').css('display', 'none'); //초기화
			}

		},


		/*
			윈도우 리사이즈 이벤트
			Use --> $.as.ui.resize( function, speed );
		*/
		resize: function(fn, speed){
			var speed = speed || 250;

			$(window).bind('resize', function(e){

				window.resizeTimeoutEvent;
				$(window).resize(function(){
					clearTimeout( window.resizeTimeoutEvent );
					window.resizeTimeoutEvent = setTimeout(function(){
						fn();
					}, speed);
				});

			});
		},

		/*
			내부 링크 이동 메뉴 만들기
			Use --> $.as.ui.createInnerLinkMenu( target_elements, { option } );
		*/
		createInnerLinkMenu: function(targetElems, option){

			var options = $.extend({
				insertTo: $('body'),
				navigationClass: 'as-nav',
				subMenuClass: 'as-nav-primary',
				secondaryClass: 'as-nav-secondary',
				dataSet: 'linker',
				useClass: false,
				className: '.linker'
			}, option);

			var targetElems = targetElems,
				navContainer = $('<nav class="' + options.navigationClass + '"></nav>'), 	// all depth level container
				subMenuContainer = $('<ul class="' + options.subMenuClass + '"></ul>'), // 1depth level container
				subMenuContainerSecond,													// 2depth level container
				subMenuContainerThird;													// 3depth level container

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
				options.insertTo.append( navContainer );		// 타켓 엘리먼트에 네비게이션 추가
			}); // each -> targetElem
		}


	}//$.as.ui
})(jQuery);