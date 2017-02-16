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
	$.as.form = {
		/*
			Resizable Input Box
			Use --> $.as.form.resizableInput(  $('.target_input'), { option } );
		*/
		resizableInput: function(targetElement, option){
			var targetElem = targetElement;
			var options = $.extend({
				containerClass: 'resizable-input-container',
				containerStyle: null,
				spanClass: 'resizable-span'
			}, option);

			//css 초기화
			if( options.containerStyle !== null ) {
				targetElem.css({
					'width': 'auto',
					'padding-left': 0,
					'padding-right':0,
					'text-align': 'center',
					'background': 'none',
					'border': 'none'
				});
			} else {
				targetElem.css({
					'width': 'auto',
					'padding-left': 0,
					'padding-right':0,
					'text-align': 'center'
				});
			}

			console.log( options.containerStyle );

			//인풋박스를 검색하여 resizableInput으로 초기화
			targetElem.each(function() {
				var $resizable_input = $(this);
				resizableInput( $resizable_input );
			});

			//키보드를 떼거나 포커스가 사라지면 resizableInput 업데이트
			targetElem.on('keyup blur', function() {
				var $resizable_input = $(this);
				resizableInput( $resizable_input );
			});

			//포커스가 없어지면 input에 입력된 내용을 추가
			targetElem.on('blur', function() {
				var $resizable_input = $(this).val().replace(/\s+/g, ' ');
				$(this).val( $resizable_input );
			});

			function resizableInput($resizable_input) {
				var resizable_text = $resizable_input.val().replace(/\s+/g, ' '),
					placeholder = $resizable_input.attr('placeholder');

				if( $resizable_input.next('.' + options.spanClass ).length === 0 ) {
					var resizable_container = $resizable_input.wrap('<span class="' + options.containerClass + '"></span>');
					resizable_container.parent().append( '<i class="' + options.spanClass + '"></i>' ).css( options.containerStyle );;
					$('.resizable-span').hide();

					//console.log( resizable_container.parent() );
				}

				var resizable_span = $resizable_input.next( '.' + options.spanClass );
				      resizable_span.text(placeholder); //span 태그의 텍스트를 placeholder 텍스트와 동기화
				var resizable_width = resizable_span.width();

				if( resizable_text !== '' ) {
					resizable_span.text( resizable_text );
					var resizable_width = resizable_span.width();
				}

				$resizable_input.css( 'width', resizable_width );
			};


		}

	}//$.as.form
})(jQuery);