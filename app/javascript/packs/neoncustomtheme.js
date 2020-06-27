import {Sine, Circ, Elastic, Back, Bounce} from './jquery-ui-es6-migrations'
import { TweenMax } from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

/**
 *	Neon Main JavaScript File
 *
 *	Theme by: www.laborator.co
 **/

const public_vars = public_vars || {};

jQuery.extend(public_vars, {

	breakpoints: {
		largescreen: 	[991, -1],
		tabletscreen: 	[768, 990],
		devicescreen: 	[420, 767],
		sdevicescreen:	[0, 419]
	},

  lastBreakpoint: null,
  
	sidebarCollapseClass: 'sidebar-collapsed',
	sidebarOnTransitionClass: 'sidebar-is-busy',
	sidebarOnHideTransitionClass: 'sidebar-is-collapsing',
	sidebarOnShowTransitionClass: 'sidebar-is-showing',
	sidebarTransitionTime: 700, // ms
	isRightSidebar: false,
})

;(($, window, undefined) => {
    $(document).ready(() => {
		// Sidebar Menu var
		public_vars.$body	 	 	= $("body");
		public_vars.$pageContainer  = public_vars.$body.find(".page-container");
		public_vars.$chat 			= public_vars.$pageContainer.find('#chat');
		public_vars.$horizontalMenu = public_vars.$pageContainer.find('header.navbar');
		public_vars.$sidebarMenu	= public_vars.$pageContainer.find('.sidebar-menu');
		public_vars.$mainMenu	    = public_vars.$sidebarMenu.find('#main-menu');
		public_vars.$mainContent	= public_vars.$pageContainer.find('.main-content');
		public_vars.$sidebarUserEnv = public_vars.$sidebarMenu.find('.sidebar-user-info');
		public_vars.$sidebarUser 	= public_vars.$sidebarUserEnv.find('.user-link');


		public_vars.$body.addClass('loaded');

		// Just to make sure...
		$(window).on('error', ev => {
			// Do not let page without showing if JS fails somewhere
			init_page_transitions();
		});

		if(public_vars.$pageContainer.hasClass('right-sidebar'))
		{
			public_vars.isRightSidebar = true;
		}




		// Sidebar Menu Setup
		setup_sidebar_menu();




		// Horizontal Menu Setup
		setup_horizontal_menu();



		// Sidebar Collapse icon
		public_vars.$sidebarMenu.find(".sidebar-collapse-icon").on('click', function(ev)
		{
			ev.preventDefault();

			const with_animation = $(this).hasClass('with-animation');

			toggle_sidebar_menu(with_animation);
		});




		// Mobile Sidebar Collapse icon
		public_vars.$sidebarMenu.find(".sidebar-mobile-menu a").on('click', function(ev)
		{
			ev.preventDefault();

			const with_animation = $(this).hasClass('with-animation');

			if(with_animation)
			{
				public_vars.$mainMenu.stop().slideToggle('normal', () => {
					public_vars.$mainMenu.css('height', 'auto');
				});
			}
			else
			{
				public_vars.$mainMenu.toggle();
			}
		});




		// Mobile Horizontal Menu Collapse icon
		public_vars.$horizontalMenu.find(".horizontal-mobile-menu a").on('click', function(ev)
		{
			ev.preventDefault();

			const $menu = public_vars.$horizontalMenu.find('.navbar-nav'), with_animation = $(this).hasClass('with-animation');

			if(with_animation)
			{
				$menu.stop().slideToggle('normal', () => {
					$menu.attr('height', 'auto');

					if($menu.css('display') == 'none')
					{
						$menu.attr('style', '');
					}
				});
			}
			else
			{
				$menu.toggle();
			}
		});




		// Close Sidebar if Tablet Screen is visible
		public_vars.$sidebarMenu.data('initial-state', (public_vars.$pageContainer.hasClass('sidebar-collapsed') ? 'closed' : 'open'));

		if(is('tabletscreen'))
		{
			hide_sidebar_menu(false);
		}




		// NiceScroll
		if($.isFunction($.fn.niceScroll))
		{
			const nicescroll_defaults = {
				cursorcolor: '#d4d4d4',
				cursorborder: '1px solid #ccc',
				railpadding: {right: 3},
				cursorborderradius: 1,
				autohidemode: true,
				sensitiverail: true
			};

			public_vars.$body.find('.dropdown .scroller').niceScroll(nicescroll_defaults);

			$(".dropdown").on("shown.bs.dropdown", () => {
				$(".scroller").getNiceScroll().resize();
				$(".scroller").getNiceScroll().show();
			});
		}


		// Fixed Sidebar
		const fixed_sidebar = $(".sidebar-menu.fixed");

		if(fixed_sidebar.length == 1)
		{
			ps_init();
		}




		// Scrollable
		if($.isFunction($.fn.slimScroll))
		{
			$(".scrollable").each((i, el) => {
                const $this = $(el);
                let height = attrDefault($this, 'height', $this.height());

                if($this.is(':visible'))
				{
					$this.removeClass('scrollable');

					if($this.height() < parseInt(height, 10))
					{
						height = $this.outerHeight(true) + 10;
					}

					$this.addClass('scrollable');
				}

                $this.css({maxHeight: ''}).slimScroll({
					height,
					position: attrDefault($this, 'scroll-position', 'right'),
					color: attrDefault($this, 'rail-color', '#000'),
					size: attrDefault($this, 'rail-width', 6),
					borderRadius: attrDefault($this, 'rail-radius', 3),
					opacity: attrDefault($this, 'rail-opacity', .3),
					alwaysVisible: parseInt(attrDefault($this, 'autohide', 1), 10) == 1 ? false : true
				});
            });
		}




		// Panels

		// Added on v1.1.4 - Fixed collapsing effect with panel tables
		$(".panel-heading").each((i, el) => {
            const $this = $(el);
            let $body = $this.next('table');

            $body.wrap('<div class="panel-body with-table"></div>');

            $body = $this.next('.with-table').next('table');
            $body.wrap('<div class="panel-body with-table"></div>');
        });

		continueWrappingPanelTables();
		// End of: Added on v1.1.4


		$('body').on('click', '.panel > .panel-heading > .panel-options > a[data-rel="reload"]', function(ev)
		{
			ev.preventDefault();

			const $this = jQuery(this).closest('.panel');

			blockUI($this);
			$this.addClass('reloading');

			setTimeout(() => {
				unblockUI($this)
				$this.removeClass('reloading');

			}, 900);

		}).on('click', '.panel > .panel-heading > .panel-options > a[data-rel="close"]', function(ev)
		{
			ev.preventDefault();

			const $this = $(this), $panel = $this.closest('.panel');

			const t = new TimelineLite({
				onComplete() {
					$panel.slideUp(() => {
						$panel.remove();
					});
				}
			});

			t.append( TweenMax.to($panel, .2, {css: {scale: 0.95}}) );
			t.append( TweenMax.to($panel, .5, {css: {autoAlpha: 0, transform: "translateX(100px) scale(.95)"}}) );

		}).on('click', '.panel > .panel-heading > .panel-options > a[data-rel="collapse"]', function(ev)
		{
            ev.preventDefault();

            const $this = $(this);
            const $panel = $this.closest('.panel');
            const $body = $panel.children('.panel-body, .table');
            let do_collapse = ! $panel.hasClass('panel-collapse');

            if($panel.is('[data-collapsed="1"]'))
			{
				$panel.attr('data-collapsed', 0);
				$body.hide();
				do_collapse = false;
			}

            if(do_collapse)
			{
				$body.slideUp('normal');
				$panel.addClass('panel-collapse');
			}
			else
			{
				$body.slideDown('normal');
				$panel.removeClass('panel-collapse');
			}
        });




		// Data Toggle for Radio and Checkbox Elements
		$('[data-toggle="buttons-radio"]').each(function()
		{
			const $buttons = $(this).children();

			$buttons.each((i, el) => {
				const $this = $(el);

				$this.click(ev => {
					$buttons.removeClass('active');
				});
			});
		});

		$('[data-toggle="buttons-checkbox"]').each(function()
		{
			const $buttons = $(this).children();

			$buttons.each((i, el) => {
				const $this = $(el);

				$this.click(ev => {
					$this.removeClass('active');
				});
			});
		});

		$('[data-loading-text]').each((
            i,
            // Temporary for demo purpose only
            el
        ) => {
			const $this = $(el);

			$this.on('click', ev => {
				$this.button('loading');

				setTimeout(() => { $this.button('reset'); }, 1800);
			});
		});




		// Popovers and tooltips
		$('[data-toggle="popover"]').each((i, el) => {
			const $this = $(el), placement = attrDefault($this, 'placement', 'right'), trigger = attrDefault($this, 'trigger', 'click'), popover_class = $this.hasClass('popover-secondary') ? 'popover-secondary' : ($this.hasClass('popover-primary') ? 'popover-primary' : ($this.hasClass('popover-default') ? 'popover-default' : ''));

			$this.popover({
				placement,
				trigger
			});

			$this.on('shown.bs.popover', ev => {
				const $popover = $this.next();

				$popover.addClass(popover_class);
			});
		});

		$('[data-toggle="tooltip"]').each((i, el) => {
			const $this = $(el), placement = attrDefault($this, 'placement', 'top'), trigger = attrDefault($this, 'trigger', 'hover'), popover_class = $this.hasClass('tooltip-secondary') ? 'tooltip-secondary' : ($this.hasClass('tooltip-primary') ? 'tooltip-primary' : ($this.hasClass('tooltip-default') ? 'tooltip-default' : ''));

			$this.tooltip({
				placement,
				trigger
			});

			$this.on('shown.bs.tooltip', ev => {
				const $tooltip = $this.next();

				$tooltip.addClass(popover_class);
			});
		});




		// jQuery Knob
		if($.isFunction($.fn.knob))
		{
			$(".knob").knob({
				change(value) {
				},
				release(value) {
				},
				cancel() {
				},
				draw() {

					if (this.$.data('skin') == 'tron') {
                        const // Angle
                        a = this.angle(this.cv);

                        let // Previous start angle
                        sa = this.startAngle;

                        let // Start angle
                        sat = this.startAngle;

                        let // Previous end angle
                        ea;

                        let // End angle
                        eat = sat + a;

                        const r = 1;

                        this.g.lineWidth = this.lineWidth;

                        this.o.cursor && (sat = eat - 0.3) && (eat = eat + 0.3);

                        if (this.o.displayPrevious) {
							ea = this.startAngle + this.angle(this.v);
							this.o.cursor && (sa = ea - 0.3) && (ea = ea + 0.3);
							this.g.beginPath();
							this.g.strokeStyle = this.pColor;
							this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
							this.g.stroke();
						}

                        this.g.beginPath();
                        this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                        this.g.stroke();

                        this.g.lineWidth = 2;
                        this.g.beginPath();
                        this.g.strokeStyle = this.o.fgColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                        this.g.stroke();

                        return false;
                    }
				}
			});
		}




		// Slider
		if($.isFunction($.fn.slider))
		{
			$(".slider").each((i, el) => {
                const $this = $(el);
                const $label_1 = $('<span class="ui-label"></span>');
                const $label_2 = $label_1.clone();
                const orientation = attrDefault($this, 'vertical', 0) != 0 ? 'vertical' : 'horizontal';
                const prefix = attrDefault($this, 'prefix', '');
                const postfix = attrDefault($this, 'postfix', '');
                const fill = attrDefault($this, 'fill', '');
                const $fill = $(fill);
                const step = attrDefault($this, 'step', 1);
                const value = attrDefault($this, 'value', 5);
                const min = attrDefault($this, 'min', 0);
                const max = attrDefault($this, 'max', 100);
                const min_val = attrDefault($this, 'min-val', 10);
                const max_val = attrDefault($this, 'max-val', 90);
                const is_range = $this.is('[data-min-val]') || $this.is('[data-max-val]');
                let reps = 0;


                // Range Slider Options
                if(is_range)
				{
					$this.slider({
						range: true,
						orientation,
						min,
						max,
						values: [min_val, max_val],
						step,
						slide(e, ui) {
							const min_val = (prefix ? prefix : '') + ui.values[0] + (postfix ? postfix : ''), max_val = (prefix ? prefix : '') + ui.values[1] + (postfix ? postfix : '');

							$label_1.html( min_val );
							$label_2.html( max_val );

							if(fill)
								$fill.val(`${min_val},${max_val}`);

							reps++;
						},
						change(ev, ui) {
							if(reps == 1)
							{
								const min_val = (prefix ? prefix : '') + ui.values[0] + (postfix ? postfix : ''), max_val = (prefix ? prefix : '') + ui.values[1] + (postfix ? postfix : '');

								$label_1.html( min_val );
								$label_2.html( max_val );

								if(fill)
									$fill.val(`${min_val},${max_val}`);
							}

							reps = 0;
						}
					});

					var $handles = $this.find('.ui-slider-handle');

					$label_1.html((prefix ? prefix : '') + min_val + (postfix ? postfix : ''));
					$handles.first().append( $label_1 );

					$label_2.html((prefix ? prefix : '') + max_val+ (postfix ? postfix : ''));
					$handles.last().append( $label_2 );
				}
				// Normal Slider
				else
				{

					$this.slider({
						range: attrDefault($this, 'basic', 0) ? false : "min",
						orientation,
						min,
						max,
						value,
						step,
						slide(ev, ui) {
							const val = (prefix ? prefix : '') + ui.value + (postfix ? postfix : '');

							$label_1.html( val );


							if(fill)
								$fill.val(val);

							reps++;
						},
						change(ev, ui) {
							if(reps == 1)
							{
								const val = (prefix ? prefix : '') + ui.value + (postfix ? postfix : '');

								$label_1.html( val );

								if(fill)
									$fill.val(val);
							}

							reps = 0;
						}
					});

					var $handles = $this.find('.ui-slider-handle');
						//$fill = $('<div class="ui-fill"></div>');

					$label_1.html((prefix ? prefix : '') + value + (postfix ? postfix : ''));
					$handles.html( $label_1 );

					//$handles.parent().prepend( $fill );

					//$fill.width($handles.get(0).style.left);
				}
            })
		}




		// Radio Toggle
		if($.isFunction($.fn.bootstrapSwitch))
		{

			$('.make-switch.is-radio').on('switch-change', () => {
		        $('.make-switch.is-radio').bootstrapSwitch('toggleRadioState');
		    });
		}




		// Select2 Dropdown replacement
		if($.isFunction($.fn.select2))
		{
			$(".select2").each((i, el) => {
				const $this = $(el),
                      opts = {
                          allowClear: attrDefault($this, 'allowClear', false)
                      };

				$this.select2(opts);
				$this.addClass('visible');

				//$this.select2("open");
			});


			if($.isFunction($.fn.niceScroll))
			{
				$(".select2-results").niceScroll({
					cursorcolor: '#d4d4d4',
					cursorborder: '1px solid #ccc',
					railpadding: {right: 3}
				});
			}
		}




		// SelectBoxIt Dropdown replacement
		if($.isFunction($.fn.selectBoxIt))
		{
			$("select.selectboxit").each((i, el) => {
				const $this = $(el),
                      opts = {
                          showFirstOption: attrDefault($this, 'first-option', true),
                          'native': attrDefault($this, 'native', false),
                          defaultText: attrDefault($this, 'text', ''),
                      };

				$this.addClass('visible');
				$this.selectBoxIt(opts);
			});
		}




		// Auto Size for Textarea
		if($.isFunction($.fn.autosize))
		{
			$("textarea.autogrow, textarea.autosize").autosize();
		}




		// Tagsinput
		if($.isFunction($.fn.tagsinput))
		{
			$(".tagsinput").tagsinput();
		}




		// Typeahead
		if($.isFunction($.fn.typeahead))
		{
			$(".typeahead").each((i, el) => {
				const $this = $(el),
                      opts = {
                          name: $this.attr('name') ? $this.attr('name') : ($this.attr('id') ? $this.attr('id') : 'tt')
                      };

				if($this.hasClass('tagsinput'))
					return;

				if($this.data('local'))
				{
					let local = $this.data('local');

					local = local.replace(/\s*,\s*/g, ',').split(',');

					opts['local'] = local;
				}

				if($this.data('prefetch'))
				{
					const prefetch = $this.data('prefetch');

					opts['prefetch'] = prefetch;
				}

				if($this.data('remote'))
				{
					const remote = $this.data('remote');

					opts['remote'] = remote;
				}

				if($this.data('template'))
				{
					const template = $this.data('template');

					opts['template'] = template;
					opts['engine'] = Hogan;
				}

				$this.typeahead(opts);
			});
		}




		// Datepicker
		if($.isFunction($.fn.datepicker))
		{
			$(".datepicker").each((i, el) => {
				const $this = $(el),
                      opts = {
                          format: attrDefault($this, 'format', 'mm/dd/yyyy'),
                          startDate: attrDefault($this, 'startDate', ''),
                          endDate: attrDefault($this, 'endDate', ''),
                          daysOfWeekDisabled: attrDefault($this, 'disabledDays', ''),
                          startView: attrDefault($this, 'startView', 0),
                          rtl: rtl()
                      },
                      $n = $this.next(),
                      $p = $this.prev();

				$this.datepicker(opts);

				if($n.is('.input-group-addon') && $n.has('a'))
				{
					$n.on('click', ev => {
						ev.preventDefault();

						$this.datepicker('show');
					});
				}

				if($p.is('.input-group-addon') && $p.has('a'))
				{
					$p.on('click', ev => {
						ev.preventDefault();

						$this.datepicker('show');
					});
				}
			});
		}




		// Timepicker
		if($.isFunction($.fn.timepicker))
		{
			$(".timepicker").each((i, el) => {
				const $this = $(el),
                      opts = {
                          template: attrDefault($this, 'template', false),
                          showSeconds: attrDefault($this, 'showSeconds', false),
                          defaultTime: attrDefault($this, 'defaultTime', 'current'),
                          showMeridian: attrDefault($this, 'showMeridian', true),
                          minuteStep: attrDefault($this, 'minuteStep', 15),
                          secondStep: attrDefault($this, 'secondStep', 15)
                      },
                      $n = $this.next(),
                      $p = $this.prev();

				$this.timepicker(opts);

				if($n.is('.input-group-addon') && $n.has('a'))
				{
					$n.on('click', ev => {
						ev.preventDefault();

						$this.timepicker('showWidget');
					});
				}

				if($p.is('.input-group-addon') && $p.has('a'))
				{
					$p.on('click', ev => {
						ev.preventDefault();

						$this.timepicker('showWidget');
					});
				}
			});
		}




		// Colorpicker
		if($.isFunction($.fn.colorpicker))
		{
			$(".colorpicker").each((i, el) => {
				const $this = $(el),
                      opts = {
                          //format: attrDefault($this, 'format', false)
                      },
                      $n = $this.next(),
                      $p = $this.prev(),
                      $preview = $this.siblings('.input-group-addon').find('.color-preview');

				$this.colorpicker(opts);

				if($n.is('.input-group-addon') && $n.has('a'))
				{
					$n.on('click', ev => {
						ev.preventDefault();

						$this.colorpicker('show');
					});
				}

				if($p.is('.input-group-addon') && $p.has('a'))
				{
					$p.on('click', ev => {
						ev.preventDefault();

						$this.colorpicker('show');
					});
				}

				if($preview.length)
				{
					$this.on('changeColor', ev => {

						$preview.css('background-color', ev.color.toHex());
					});

					if($this.val().length)
					{
						$preview.css('background-color', $this.val());
					}
				}
			});
		}




		// Date Range Picker
		if($.isFunction($.fn.daterangepicker))
		{
			$(".daterange").each((i, el) => {
				// Change the range as you desire
				const ranges = {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
					'Last 7 Days': [moment().subtract('days', 6), moment()],
					'Last 30 Days': [moment().subtract('days', 29), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
				};

				const $this = $(el),
                      opts = {
                          format: attrDefault($this, 'format', 'MM/DD/YYYY'),
                          timePicker: attrDefault($this, 'timePicker', false),
                          timePickerIncrement: attrDefault($this, 'timePickerIncrement', false),
                          separator: attrDefault($this, 'separator', ' - '),
                      },
                      min_date = attrDefault($this, 'minDate', ''),
                      max_date = attrDefault($this, 'maxDate', ''),
                      start_date = attrDefault($this, 'startDate', ''),
                      end_date = attrDefault($this, 'endDate', '');

				if($this.hasClass('add-ranges'))
				{
					opts['ranges'] = ranges;
				}

				if(min_date.length)
				{
					opts['minDate'] = min_date;
				}

				if(max_date.length)
				{
					opts['maxDate'] = max_date;
				}

				if(start_date.length)
				{
					opts['startDate'] = start_date;
				}

				if(end_date.length)
				{
					opts['endDate'] = end_date;
				}


				$this.daterangepicker(opts, (start, end) => {
					const drp = $this.data('daterangepicker');

					if($this.is('[data-callback]'))
					{
						//daterange_callback(start, end);
						callback_test(start, end);
					}

					if($this.hasClass('daterange-inline'))
					{
						$this.find('span').html(start.format(drp.format) + drp.separator + end.format(drp.format));
					}
				});
			});
		}




		// Input Mask
		if($.isFunction($.fn.inputmask))
		{
			$("[data-mask]").each((i, el) => {
                const $this = $(el);
                let mask = $this.data('mask').toString();

                const opts = {
                    numericInput: attrDefault($this, 'numeric', false),
                    radixPoint: attrDefault($this, 'radixPoint', ''),
                    rightAlignNumerics: attrDefault($this, 'numericAlign', 'left') == 'right'
                };

                const placeholder = attrDefault($this, 'placeholder', '');
                const is_regex = attrDefault($this, 'isRegex', '');


                if(placeholder.length)
				{
					opts[placeholder] = placeholder;
				}

                switch(mask.toLowerCase())
				{
					case "phone":
						mask = "(999) 999-9999";
						break;

					case "currency":
					case "rcurrency":

						const sign = attrDefault($this, 'sign', '$');;

						mask = "999,999,999.99";

						if($this.data('mask').toLowerCase() == 'rcurrency')
						{
							mask += ` ${sign}`;
						}
						else
						{
							mask = `${sign} ${mask}`;
						}

						opts.numericInput = true;
						opts.rightAlignNumerics = false;
						opts.radixPoint = '.';
						break;

					case "email":
						mask = 'Regex';
						opts.regex = "[a-zA-Z0-9._%-]+@[a-zA-Z0-9-\.]+\\.[a-zA-Z]{2,4}";
						break;

					case "fdecimal":
						mask = 'decimal';
						$.extend(opts, {
							autoGroup		: true,
							groupSize		: 3,
							radixPoint		: attrDefault($this, 'rad', '.'),
							groupSeparator	: attrDefault($this, 'dec', ',')
						});
				}

                if(is_regex)
				{
					opts.regex = mask;
					mask = 'Regex';
				}

                $this.inputmask(mask, opts);
            });
		}




		// Form Validation
		if($.isFunction($.fn.validate))
		{
			$("form.validate").each((i, el) => {
				const $this = $(el),
                      opts = {
                          rules: {},
                          messages: {},
                          errorElement: 'span',
                          errorClass: 'validate-has-error',
                          highlight(element) {
                              $(element).closest('.form-group').addClass('validate-has-error');
                          },
                          unhighlight(element) {
                              $(element).closest('.form-group').removeClass('validate-has-error');
                          },
                          errorPlacement(error, element) {
                              if(element.closest('.has-switch').length)
                              {
                                  error.insertAfter(element.closest('.has-switch'));
                              }
                              else
                              if(element.parent('.checkbox, .radio').length || element.parent('.input-group').length)
                              {
                                  error.insertAfter(element.parent());
                              }
                              else
                              {
                                  error.insertAfter(element);
                              }
                          }
                      },
                      $fields = $this.find('[data-validate]');


				$fields.each((j, el2) => {
					const $field = $(el2), name = $field.attr('name'), validate = attrDefault($field, 'validate', '').toString(), _validate = validate.split(',');

					for(const k in _validate)
					{
                        const rule = _validate[k];
                        let params;
                        let message;

                        if(typeof opts['rules'][name] == 'undefined')
						{
							opts['rules'][name] = {};
							opts['messages'][name] = {};
						}

                        if($.inArray(rule, ['required', 'url', 'email', 'number', 'date', 'creditcard']) != -1)
						{
							opts['rules'][name][rule] = true;

							message = $field.data(`message-${rule}`);

							if(message)
							{
								opts['messages'][name][rule] = message;
							}
						}
						// Parameter Value (#1 parameter)
						else
						if(params = rule.match(/(\w+)\[(.*?)\]/i))
						{
							if($.inArray(params[1], ['min', 'max', 'minlength', 'maxlength', 'equalTo']) != -1)
							{
								opts['rules'][name][params[1]] = params[2];


								message = $field.data(`message-${params[1]}`);

								if(message)
								{
									opts['messages'][name][params[1]] = message;
								}
							}
						}
                    }
				});

				$this.validate(opts);
			});
		}




		// Replaced File Input
		$("input.file2[type=file]").each((i, el) => {
			const $this = $(el), label = attrDefault($this, 'label', 'Browse');

			$this.bootstrapFileInput(label);
		});




		// Jasny Bootstrap | Fileinput
		if($.isFunction($.fn.fileinput))
		{
			$(".fileinput").fileinput()
		}




		// Multi-select
		if($.isFunction($.fn.multiSelect))
		{
			$(".multi-select").multiSelect();
		}




		// Form Wizard
		if($.isFunction($.fn.bootstrapWizard))
		{
			$(".form-wizard").each((i, el) => {
				const $this = $(el), $progress = $this.find(".steps-progress div"), _index = $this.find('> ul > li.active').index();

				// Validation
				const checkFormWizardValidaion = (tab, navigation, index) => {
                    if($this.hasClass('validate'))
                    {
                        const $valid = $this.valid();

                        if( ! $valid)
                        {
                            $this.data('validator').focusInvalid();
                            return false;
                        }
                    }

                    return true;
                };


				$this.bootstrapWizard({
					tabClass: "",
			  		onTabShow($tab, $navigation, index) {

						setCurrentProgressTab($this, $navigation, $tab, $progress, index);
			  		},

			  		onNext: checkFormWizardValidaion,
			  		onTabClick: checkFormWizardValidaion
			  	});

			  	$this.data('bootstrapWizard').show( _index );

			  	/*$(window).on('neon.resize', function()
			  	{
			  		$this.data('bootstrapWizard').show( _index );
			  	});*/
			});
		}




		// Wysiwyg Editor
		if($.isFunction($.fn.wysihtml5))
		{
			$(".wysihtml5").each((i, el) => {
				const $this = $(el), stylesheets = attrDefault($this, 'stylesheet-url', '');

				$(".wysihtml5").wysihtml5({
					stylesheets: stylesheets.split(',')
				});
			});
		}




		// CKeditor WYSIWYG
		if($.isFunction($.fn.ckeditor))
		{
			$(".ckeditor").ckeditor({
				contentsLangDirection: rtl() ? 'rtl' : 'ltr'
			});
		}




		// Checkbox/Radio Replacement
		replaceCheckboxes();




		// Tile Progress
		$(".tile-progress").each((i, el) => {
			const $this = $(el), $pct_counter = $this.find('.pct-counter'), $progressbar = $this.find('.tile-progressbar span'), percentage = parseFloat($progressbar.data('fill')), pct_len = percentage.toString().length;

			if(typeof scrollMonitor == 'undefined')
			{
				$progressbar.width(`${percentage}%`);
				$pct_counter.html(percentage);
			}
			else
			{
				const tile_progress = scrollMonitor.create( el );

				tile_progress.fullyEnterViewport(() => {
					$progressbar.width(`${percentage}%`);
					tile_progress.destroy();

					const o = {pct: 0};
					TweenLite.to(o, 1, {pct: percentage, ease: Quint.easeInOut, onUpdate() {
                        const pct_str = o.pct.toString().substring(0, pct_len);

                        $pct_counter.html(pct_str);
                    }
					});
				});
			}
		});




		// Tile Stats
		$(".tile-stats").each((i, el) => {
			const $this = $(el), $num = $this.find('.num'), start = attrDefault($num, 'start', 0), end = attrDefault($num, 'end', 0), prefix = attrDefault($num, 'prefix', ''), postfix = attrDefault($num, 'postfix', ''), duration = attrDefault($num, 'duration', 1000), delay = attrDefault($num, 'delay', 1000), format = attrDefault($num, 'format', false);

			if(start < end)
			{
				if(typeof scrollMonitor == 'undefined')
				{
					$num.html(prefix + end + postfix);
				}
				else
				{
					const tile_stats = scrollMonitor.create( el );

					tile_stats.fullyEnterViewport(() => {

						const o = {curr: start};

						TweenLite.to(o, duration/1000, {curr: end, ease: Power1.easeInOut, delay: delay/1000, onUpdate() {
                            $num.html(prefix + (format ? numberWithCommas( Math.round(o.curr) ) : Math.round(o.curr)) + postfix);
                        }
						});

						tile_stats.destroy()
					});
				}
			}
		});




		// Tocify Table
		if($.isFunction($.fn.tocify) && $("#toc").length)
		{
			$("#toc").tocify({
				context: '.tocify-content',
				selectors: "h2,h3,h4,h5"
			});


			const $this = $(".tocify"), watcher = scrollMonitor.create($this.get(0));

			$this.width( $this.parent().width() );

			watcher.lock();

			watcher.stateChange(function()
			{
				$($this.get(0)).toggleClass('fixed', this.isAboveViewport)
			});
		}



		// Modal Static
		public_vars.$body.on('click', '.modal[data-backdrop="static"]', function(ev)
		{
			if( $(ev.target).is('.modal') )
			{
				const $modal_dialog = $(this).find('.modal-dialog .modal-content'), tt = new TimelineMax({paused: true});

				tt.append( TweenMax.to($modal_dialog, .1, {css: {scale: 1.1}, ease: Expo.easeInOut}) );
				tt.append( TweenMax.to($modal_dialog, .3, {css: {scale: 1}, ease: Back.easeOut}) );

				tt.play();
			}
		});


		// Added on v1.1

		// Sidebar User Links Popup
		if(public_vars.$sidebarUserEnv.length)
		{
			const $su_normal = public_vars.$sidebarUserEnv.find('.sui-normal'), $su_hover = public_vars.$sidebarUserEnv.find('.sui-hover');

			if($su_normal.length && $su_hover.length)
			{
				public_vars.$sidebarUser.on('click', ev => {
					ev.preventDefault();
					$su_hover.addClass('visible');
				});

				$su_hover.on('click', '.close-sui-popup', ev => {
					ev.preventDefault();
					$su_hover.addClass('going-invisible');
					$su_hover.removeClass('visible');

					setTimeout(() => { $su_hover.removeClass('going-invisible'); }, 220);
				});
			}
		}
		// End of: Added on v1.1


		// Added on v1.1.4
		$(".input-spinner").each((i, el) => {
			const $this = $(el), $minus = $this.find('button:first'), $plus = $this.find('button:last'), $input = $this.find('input'), minus_step = attrDefault($minus, 'step', -1), plus_step = attrDefault($minus, 'step', 1), min = attrDefault($input, 'min', null), max = attrDefault($input, 'max', null);


			$this.find('button').on('click', function(ev)
			{
                ev.preventDefault();

                const $this = $(this);
                let val = $input.val();
                let step = attrDefault($this, 'step', $this[0] == $minus[0] ? -1 : 1);

                if( ! step.toString().match(/^[0-9-\.]+$/))
				{
					step = $this[0] == $minus[0] ? -1 : 1;
				}

                if( ! val.toString().match(/^[0-9-\.]+$/))
				{
					val = 0;
				}

                $input.val( parseFloat(val) + step ).trigger('keyup');
            });

			$input.keyup(() => {
				if(min != null && parseFloat($input.val()) < min)
				{
					$input.val(min);
				}
				else

				if(max != null && parseFloat($input.val()) > max)
				{
					$input.val(max);
				}
			});

		});


		// Search Results Tabs
		const $search_results_env = $(".search-results-env");

		if($search_results_env.length)
		{
			const $sr_nav_tabs = $search_results_env.find(".nav-tabs li"), $sr_tab_panes = $search_results_env.find('.search-results-panes .search-results-pane');

			$sr_nav_tabs.find('a').on('click', function(ev)
			{
				ev.preventDefault();

				const $this = $(this), $tab_pane = $sr_tab_panes.filter($this.attr('href'));

				$sr_nav_tabs.not($this.parent()).removeClass('active');
				$this.parent().addClass('active');

				$sr_tab_panes.not($tab_pane).fadeOut('fast', () => {
					$tab_pane.fadeIn('fast');
				});
			});
		}
		// End of: Added on v1.1.4


		// Apply Page Transition
		onPageAppear(init_page_transitions);

	});



    // Enable/Disable Resizable Event
    let wid = 0;

    $(window).resize(() => {
		clearTimeout(wid);
		wid = setTimeout(trigger_resizable, 200);
	});
})(jQuery, window);


/* Functions */

// Sidebar Menu Setup
const setup_sidebar_menu = () =>
{
	const $ = jQuery,
          $items_with_submenu = public_vars.$sidebarMenu.find('li:has(ul)'),
          submenu_options	= {
              submenu_open_delay: 0.25,
              submenu_open_easing: Sine.easeInOut,
              submenu_opened_class: 'opened'
          },
          root_level_class = 'root-level',
          is_multiopen = public_vars.$mainMenu.hasClass('multiple-expanded');

	public_vars.$mainMenu.find('> li').addClass(root_level_class);

	$items_with_submenu.each((i, el) => {
		const $this = $(el), $link = $this.find('> a'), $submenu = $this.find('> ul');

		$this.addClass('has-sub');

		$link.click(ev => {
			ev.preventDefault();

			if( ! is_multiopen && $this.hasClass(root_level_class))
			{
				const close_submenus = public_vars.$mainMenu.find(`.${root_level_class}`).not($this).find('> ul');

				close_submenus.each((i, el) => {
					const $sub = $(el);
					menu_do_collapse($sub, $sub.parent(), submenu_options);
				});
			}

			if( ! $this.hasClass(submenu_options.submenu_opened_class))
			{
				let current_height;

				if( ! $submenu.is(':visible'))
				{
					menu_do_expand($submenu, $this, submenu_options);
				}
			}
			else
			{
				menu_do_collapse($submenu, $this, submenu_options);
			}
		});

	});

	// Open the submenus with "opened" class
	public_vars.$mainMenu.find(`.${submenu_options.submenu_opened_class} > ul`).addClass('visible');

	// Well, somebody may forgot to add "active" for all inhertiance, but we are going to help you (just in case) - we do this job for you for free :P!
	if(public_vars.$mainMenu.hasClass('auto-inherit-active-class'))
	{
		menu_set_active_class_to_parents( public_vars.$mainMenu.find('.active') );
	}

	// Search Input
	const $search_input = public_vars.$mainMenu.find('#search input[type="text"]'), $search_el = public_vars.$mainMenu.find('#search');

	public_vars.$mainMenu.find('#search form').submit(ev => {
		const is_collapsed = public_vars.$pageContainer.hasClass('sidebar-collapsed');

		if(is_collapsed)
		{
			if($search_el.hasClass('focused') == false)
			{
				ev.preventDefault();
				$search_el.addClass('focused');

				$search_input.focus();

				return false;
			}
		}
	});

	$search_input.on('blur', ev => {
		const is_collapsed = public_vars.$pageContainer.hasClass('sidebar-collapsed');

		if(is_collapsed)
		{
			$search_el.removeClass('focused');
		}
	});
}


const menu_do_expand = ($submenu, $this, options) => 
{
	$submenu.addClass('visible').height('');
	const current_height = $submenu.outerHeight();

	const props_from = {
              opacity: .2,
              height: 0,
              top: -20
          },
          props_to = {
              height: current_height,
              opacity: 1,
              top: 0
          };

	if(isxs())
	{
		delete props_from['opacity'];
		delete props_from['top'];

		delete props_to['opacity'];
		delete props_to['top'];
	}

	TweenMax.set($submenu, {css: props_from});

	$this.addClass(options.submenu_opened_class);

	TweenMax.to($submenu, options.submenu_open_delay, {css: props_to, ease: options.submenu_open_easing, onUpdate: ps_update, onComplete() {
		$submenu.attr('style', '');
	}});
}


const menu_do_collapse = ($submenu, $this, options) =>
{
	if(public_vars.$pageContainer.hasClass('sidebar-collapsed') && $this.hasClass('root-level'))
	{
		return;
	}

	$this.removeClass(options.submenu_opened_class);

	TweenMax.to($submenu, options.submenu_open_delay, {css: {height: 0, opacity: .2}, ease: options.submenu_open_easing, onUpdate: ps_update, onComplete() {
		$submenu.removeClass('visible');
	}});
}


const menu_set_active_class_to_parents = ($active_element) => 
{
	if($active_element.length)
	{
		const $parent = $active_element.parent().parent();

		$parent.addClass('active');

		if(! $parent.hasClass('root-level'))
			menu_set_active_class_to_parents($parent)
	}
}

// Horizontal Menu Setup
const setup_horizontal_menu = () =>
{
  const $ = jQuery,
    $nav_bar_menu = public_vars.$horizontalMenu.find('.navbar-nav'),
    $items_with_submenu = $nav_bar_menu.find('li:has(ul)'),
    $search = public_vars.$horizontalMenu.find('li#search'),
    $search_input = $search.find('.search-input'),
    $search_submit = $search.find('form'),
    root_level_class = 'root-level',
		is_multiopen = $nav_bar_menu.hasClass('multiple-expanded'),
		submenu_options = {
			submenu_open_delay: 0.5,
			submenu_open_easing: Sine.easeInOut,
			submenu_opened_class: 'opened'
		};

	$nav_bar_menu.find('> li').addClass(root_level_class);

	$items_with_submenu.each((i, el) => {
		const $this = $(el), $link = $this.find('> a'), $submenu = $this.find('> ul');

		$this.addClass('has-sub');

		setup_horizontal_menu_hover($this, $submenu);

		// xs devices only
		$link.click(ev => {
			if(isxs() || is('tabletscreen'))
			{
				ev.preventDefault();

				if( ! is_multiopen && $this.hasClass(root_level_class))
				{
					const close_submenus = $nav_bar_menu.find(`.${root_level_class}`).not($this).find('> ul');

					close_submenus.each((i, el) => {
						const $sub = $(el);
						menu_do_collapse($sub, $sub.parent(), submenu_options);
					});
				}

				if( ! $this.hasClass(submenu_options.submenu_opened_class))
				{
					let current_height;

					if( ! $submenu.is(':visible'))
					{
						menu_do_expand($submenu, $this, submenu_options);
					}
				}
				else
				{
					menu_do_collapse($submenu, $this, submenu_options);
				}
			}
		});

	});


	// Search Input
	if($search.hasClass('search-input-collapsed'))
	{
		$search_submit.submit(ev => {
			if($search.hasClass('search-input-collapsed'))
			{
				ev.preventDefault();
				$search.removeClass('search-input-collapsed');
				$search_input.focus();

				return false;
			}
		});

		$search_input.on('blur', ev => {
			$search.addClass('search-input-collapsed');
		});
	}
}

jQuery(public_vars, {
	hover_index: 4
})

const setup_horizontal_menu_hover = ($item, $sub) => 
{
	const del = 0.5, trans_x = -10, ease = Quad.easeInOut;

	TweenMax.set($sub, {css: {autoAlpha: 0, transform: `translateX(${trans_x}px)`}});

	$item.hoverIntent({
		over() {
			if(isxs())
				return false;

			if($sub.css('display') == 'none')
			{
				$sub.css({display: 'block', visibility: 'hidden'});
			}

			$sub.css({zIndex: ++public_vars.hover_index});
			TweenMax.to($sub, del, {css: {autoAlpha: 1, transform: "translateX(0px)"}, ease});
		},

		out() {
			if(isxs())
				return false;

			TweenMax.to($sub, del, {css: {autoAlpha: 0, transform: `translateX(${trans_x}px)`}, ease, onComplete() {
				TweenMax.set($sub, {css: {transform: `translateX(${trans_x}px)`}});
				$sub.css({display: 'none'});
			}});
		},

		timeout: 300,
		interval: 50
	});

}

// Block UI Helper
const blockUI = ($el) => 
{
	$el.block({
		message: '',
		css: {
			border: 'none',
			padding: '0px',
			backgroundColor: 'none'
		},
		overlayCSS: {
			backgroundColor: '#fff',
			opacity: .3,
			cursor: 'wait'
		}
	});
}

const unblockUI = ($el) =>
{
	$el.unblock();
}

// Element Attribute Helper
const attrDefault = ($el, data_var, default_val) =>
{
	if(typeof $el.data(data_var) != 'undefined')
	{
		return $el.data(data_var);
	}

	return default_val;
}

// Test function
const callback_test = (...args) => {
	alert(`Callback function executed! No. of arguments: ${args.length}\n\nSee console log for outputed of the arguments.`);

	console.log(args);
}

// Root Wizard Current Tab
const setCurrentProgressTab = ($rootwizard, $nav, $tab, $progress, index) =>
{
	$tab.prevAll().addClass('completed');
	$tab.nextAll().removeClass('completed');

	const items      	  = $nav.children().length, pct           = parseInt((index+1) / items * 100, 10), $first_tab    = $nav.find('li:first-child'), margin        = `${1/(items*2) * 100}%`;//$first_tab.find('span').position().left + 'px';

	if( $first_tab.hasClass('active'))
	{
		$progress.width(0);
	}
	else
	{
		if(rtl())
		{
			$progress.width( $progress.parent().outerWidth(true) - $tab.prev().position().left - $tab.find('span').width()/2 );
		}
		else
		{
			$progress.width( `${((index-1) /(items-1)) * 100}%` ); //$progress.width( $tab.prev().position().left - $tab.find('span').width()/2 );
		}
	}


	$progress.parent().css({
		marginLeft: margin,
		marginRight: margin
	});

	/*var m = $first_tab.find('span').position().left - $first_tab.find('span').width() / 2;

	$rootwizard.find('.tab-content').css({
		marginLeft: m,
		marginRight: m
	});*/
}

// Replace Checkboxes
const replaceCheckboxes = () =>
{
	const $ = jQuery;

	$(".checkbox-replace:not(.neon-cb-replacement), .radio-replace:not(.neon-cb-replacement)").each((i, el) => {
        const $this = $(el);
        const $input = $this.find('input:first');
        let $wrapper = $('<label class="cb-wrapper" />');
        const $checked = $('<div class="checked" />');
        const checked_class = 'checked';
        const is_radio = $input.is('[type="radio"]');
        let $related;
        const name = $input.attr('name');


        $this.addClass('neon-cb-replacement');


        $input.wrap($wrapper);

        $wrapper = $input.parent();

        $wrapper.append($checked).next('label').on('click', ev => {
			$wrapper.click();
		});

        $input.on('change', ev => {
			if(is_radio)
			{
				//$(".neon-cb-replacement input[type=radio][name='"+name+"']").closest('.neon-cb-replacement').removeClass(checked_class);
				$(`.neon-cb-replacement input[type=radio][name='${name}']:not(:checked)`).closest('.neon-cb-replacement').removeClass(checked_class);
			}

			if($input.is(':disabled'))
			{
				$wrapper.addClass('disabled');
			}

			$this[$input.is(':checked') ? 'addClass' : 'removeClass'](checked_class);

		}).trigger('change');
    });
}

// Scroll to Bottom
const scrollToBottom = ($el) =>
{
	const $ = jQuery;

	if(typeof $el == 'string')
		$el = $($el);

	$el.get(0).scrollTop = $el.get(0).scrollHeight;
}

// Check viewport visibility (entrie element)
const elementInViewport = (el) =>
{
	let top = el.offsetTop;
	let left = el.offsetLeft;
	const width = el.offsetWidth;
	const height = el.offsetHeight;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}

	return (
		top >= window.pageYOffset &&
		left >= window.pageXOffset &&
		(top + height) <= (window.pageYOffset + window.innerHeight) &&
		(left + width) <= (window.pageXOffset + window.innerWidth)
	);
}

// X Overflow
const disableXOverflow = () =>
{
	public_vars.$body.addClass('overflow-x-disabled');
}

const enableXOverflow = () => 
{
	public_vars.$body.removeClass('overflow-x-disabled');
}

// Page Transitions
const init_page_transitions = () =>
{
	const transitions = ['page-fade', 'page-left-in', 'page-right-in', 'page-fade-only'];

	for(const i in transitions)
	{
		const transition_name = transitions[i];

		if(public_vars.$body.hasClass(transition_name))
		{
			public_vars.$body.addClass(`${transition_name}-init`)

			setTimeout(() => {
				public_vars.$body.removeClass(`${transition_name} ${transition_name}-init`);

			}, 850);

			return;
		}
	}
}

// Page Visibility API
const onPageAppear = (callback) =>
{

	let hidden, state, visibilityChange;

	if (typeof document.hidden !== "undefined")
	{
		hidden = "hidden";
		visibilityChange = "visibilitychange";
		state = "visibilityState";
	}
	else if (typeof document.mozHidden !== "undefined")
	{
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
		state = "mozVisibilityState";
	}
	else if (typeof document.msHidden !== "undefined")
	{
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
		state = "msVisibilityState";
	}
	else if (typeof document.webkitHidden !== "undefined")
	{
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
		state = "webkitVisibilityState";
	}

	if(document[state] || typeof document[state] == 'undefined')
	{
		callback();
	}

	document.addEventListener(visibilityChange, callback, false);
}

const continueWrappingPanelTables = () =>
{
	const $tables = jQuery(".panel-body.with-table + table");

	if($tables.length)
	{
		$tables.wrap('<div class="panel-body with-table"></div>');
		continueWrappingPanelTables();
	}
}

const show_loading_bar = (options) =>
{
    let defaults = {
		pct: 0,
		delay: 1.3,
		wait: 0,
		before() {},
		finish() {},
		resetOnEnd: true
	};

    if(typeof options == 'object')
		defaults = jQuery.extend(defaults, options);
	else
	if(typeof options == 'number')
		defaults.pct = options;


    if(defaults.pct > 100)
		defaults.pct = 100;
	else
	if(defaults.pct < 0)
		defaults.pct = 0;

    const $ = jQuery;
    let $loading_bar = $(".neon-loading-bar");

    if($loading_bar.length == 0)
	{
		$loading_bar = $('<div class="neon-loading-bar progress-is-hidden"><span data-pct="0"></span></div>');
		public_vars.$body.append( $loading_bar );
	}

    const $pct = $loading_bar.find('span'), current_pct = $pct.data('pct'), is_regress = current_pct > defaults.pct;


    defaults.before(current_pct);

    TweenMax.to($pct, defaults.delay, {css: {width: `${defaults.pct}%`}, delay: defaults.wait, ease: is_regress ? Expo.easeOut : Expo.easeIn,
	onStart() {
		$loading_bar.removeClass('progress-is-hidden');
	},
	onComplete() {
		const pct = $pct.data('pct');

		if(pct == 100 && defaults.resetOnEnd)
		{
			hide_loading_bar();
		}

		defaults.finish(pct);
	},
	onUpdate() {
		$pct.data('pct', parseInt($pct.get(0).style.width, 10));
	}});
}

const hide_loading_bar = () =>
{
	const $ = jQuery, $loading_bar = $(".neon-loading-bar"), $pct = $loading_bar.find('span');

	$loading_bar.addClass('progress-is-hidden');
	$pct.width(0).data('pct', 0);
}

const numberWithCommas = (x) => {
    x = x.toString();
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}




/* Main Function that will be called each time when the screen breakpoint changes */
const resizable = (breakpoint) =>
{
	let sb_with_animation;


	// Large Screen Specific Script
	if(is('largescreen'))
	{
		sb_with_animation = public_vars.$sidebarMenu.find(".sidebar-collapse-icon").hasClass('with-animation') || public_vars.$sidebarMenu.hasClass('with-animation');

		if(public_vars.$sidebarMenu.data('initial-state') == 'open')
		{
			show_sidebar_menu(sb_with_animation);
		}
		else
		{
			hide_sidebar_menu(sb_with_animation);
		}
	}


	// Tablet or larger screen
	if(ismdxl())
	{
		public_vars.$mainMenu.attr('style', '');
	}


	// Tablet Screen Specific Script
	if(is('tabletscreen'))
	{
		sb_with_animation = public_vars.$sidebarMenu.find(".sidebar-collapse-icon").hasClass('with-animation') || public_vars.$sidebarMenu.hasClass('with-animation');

		hide_sidebar_menu(sb_with_animation);
	}


	// Tablet Screen Specific Script
	if(isxs())
	{
		public_vars.$pageContainer.removeClass('sidebar-collapsed');
	}


	// Trigger Event
	jQuery(window).trigger('neon.resize');
}



/* Functions */

// Get current breakpoint
const get_current_breakpoint = () =>
{
	const width = jQuery(window).width(), breakpoints = public_vars.breakpoints;

	for(const breakpont_label in breakpoints)
	{
        const bp_arr = breakpoints[breakpont_label];
        let min = bp_arr[0];
        let max = bp_arr[1];

        if(max == -1) {
          max = width;
        }

        if(min <= width && max >= width)
		    {
			    return breakpont_label;
		    }
  }

	return null;
}


// Check current screen breakpoint
const is = (screen_label) =>
{
	return get_current_breakpoint() == screen_label;
}


// Is xs device
const isxs = () =>
{
	return is('devicescreen') || is('sdevicescreen');
}

// Is md or xl
const ismdxl = () => 
{
	return is('tabletscreen') || is('largescreen');
}


// Trigger Resizable Function
const trigger_resizable = () =>
{
	if(public_vars.lastBreakpoint != get_current_breakpoint())
	{
		public_vars.lastBreakpoint = get_current_breakpoint();
		resizable(public_vars.lastBreakpoint);
	}
}

const show_sidebar_menu = (with_animation) =>
{
	if(isxs())
		return;

	if( ! with_animation)
	{
		public_vars.$pageContainer.removeClass(public_vars.sidebarCollapseClass);
	}
	else
	{
		if(public_vars.$mainMenu.data('is-busy') || ! public_vars.$pageContainer.hasClass(public_vars.sidebarCollapseClass))
			return;

		// Check
		public_vars.$pageContainer.removeClass(public_vars.sidebarCollapseClass);

		const duration		 = public_vars.sidebarTransitionTime, expanded_width   = public_vars.$sidebarMenu.width(), $sidebar_inner   = public_vars.$sidebarMenu.find('.sidebar-menu-inner'), $span_elements   = public_vars.$mainMenu.find('li a span'), $submenus        = public_vars.$mainMenu.find('.has-sub > ul'), $search_input    = public_vars.$mainMenu.find('#search .search-input'), $search_button   = public_vars.$mainMenu.find('#search button'), $logo_env		 = public_vars.$sidebarMenu.find('.logo-env'), $collapse_icon	 = $logo_env.find('.sidebar-collapse'), $logo			 = $logo_env.find('.logo'), $sidebar_ulink	 = public_vars.$sidebarUser.find('span, strong'), logo_env_padding = parseInt($logo_env.css('padding'), 10);

		// Check
		public_vars.$pageContainer.addClass(public_vars.sidebarCollapseClass);

		public_vars.$sidebarMenu.add( $sidebar_inner ).transit({width: expanded_width}, public_vars.sidebarTransitionTime/2);

		// Showing Class
		setTimeout(() => { public_vars.$pageContainer.addClass(public_vars.sidebarOnShowTransitionClass); }, 1);

		// Start animation
		public_vars.$mainMenu.data('is-busy', true);

		public_vars.$pageContainer.addClass(public_vars.sidebarOnTransitionClass);

		$logo_env.transit({padding: logo_env_padding}, public_vars.sidebarTransitionTime);

		// Second Phase
		setTimeout(() => {
			$logo.css({width: 'auto', height: 'auto'});

			TweenMax.set($logo, {css: {scaleY: 0}});

			TweenMax.to($logo, (public_vars.sidebarTransitionTime/2) / 1100, {css: {scaleY: 1}});

			// Third Phase
			setTimeout(() => {

				public_vars.$pageContainer.removeClass(public_vars.sidebarCollapseClass);

				$submenus.hide().filter('.visible').slideDown('normal', () => {
					$submenus.attr('style', '');
				});

				public_vars.$pageContainer.removeClass(public_vars.sidebarOnShowTransitionClass);

				// Last Phase
				setTimeout(() => {
					// Reset Vars
					public_vars.$pageContainer
					.add(public_vars.$sidebarMenu)
					.add($sidebar_inner)
					.add($logo_env)
					.add($logo)
					.add($span_elements)
					.add($submenus)
					.attr('style', '');

					public_vars.$pageContainer.removeClass(public_vars.sidebarOnTransitionClass);

					public_vars.$mainMenu.data('is-busy', false); // Transition End

				}, public_vars.sidebarTransitionTime);


			}, public_vars.sidebarTransitionTime/2);

		}, public_vars.sidebarTransitionTime/2);
	}
}

const hide_sidebar_menu = (with_animation) =>
{
	if(isxs())
		return;

	if( ! with_animation)
	{
		public_vars.$pageContainer.addClass(public_vars.sidebarCollapseClass);
		public_vars.$mainMenu.find('.has-sub > ul').attr('style', '');
	}
	else
	{
		if(public_vars.$mainMenu.data('is-busy') || public_vars.$pageContainer.hasClass(public_vars.sidebarCollapseClass))
			return;

		// Check
		public_vars.$pageContainer.addClass(public_vars.sidebarCollapseClass);

		const duration		 = public_vars.sidebarTransitionTime, collapsed_width  = public_vars.$sidebarMenu.width(), $sidebar_inner   = public_vars.$sidebarMenu.find('.sidebar-menu-inner'), $span_elements   = public_vars.$mainMenu.find('li a span'), $user_link   	 = public_vars.$sidebarMenu.find('.user-link *').not('img'), $submenus        = public_vars.$mainMenu.find('.has-sub > ul'), $search_input    = public_vars.$mainMenu.find('#search .search-input'), $search_button   = public_vars.$mainMenu.find('#search button'), $logo_env		 = public_vars.$sidebarMenu.find('.logo-env'), $collapse_icon	 = $logo_env.find('.sidebar-collapse'), $logo			 = $logo_env.find('.logo'), $sidebar_ulink	 = public_vars.$sidebarUser.find('span, strong'), logo_env_padding = parseInt($logo_env.css('padding'), 10);

		// Return to normal state
		public_vars.$pageContainer.removeClass(public_vars.sidebarCollapseClass);

		// Start animation (1)
		public_vars.$mainMenu.data('is-busy', true);


		$logo.transit({scale: [1, 0]}, duration / 5, '', () => {
			$logo.hide();
			public_vars.$sidebarMenu.transit({width: collapsed_width});

			if(public_vars.$sidebarMenu.hasClass('fixed'))
			{
				$sidebar_inner.transit({width: collapsed_width});
			}

			$span_elements.hide();
			$user_link.hide();
		});

		// Add Classes & Hide Span Elements
		public_vars.$pageContainer.addClass(public_vars.sidebarOnTransitionClass);
		setTimeout(() => { public_vars.$pageContainer.addClass(public_vars.sidebarOnHideTransitionClass); }, 1);

		TweenMax.to($submenus, public_vars.sidebarTransitionTime / 1100, {css: {height: 0}});

		$logo.transit({scale: [1,0], perspective: 300}, public_vars.sidebarTransitionTime/2);
		$logo_env.transit({padding: logo_env_padding}, public_vars.sidebarTransitionTime);

		setTimeout(() => {
			// In the end do some stuff
			public_vars.$pageContainer
			.add(public_vars.$sidebarMenu)
			.add($sidebar_inner)
			.add($search_input)
			.add($search_button)
			.add($user_link)
			.add($logo_env)
			.add($logo)
			.add($span_elements)
			.add($collapse_icon)
			.add($submenus)
			.add($sidebar_ulink)
			.add(public_vars.$mainMenu)
			.attr('style', '');

			public_vars.$pageContainer.addClass(public_vars.sidebarCollapseClass);

			public_vars.$mainMenu.data('is-busy', false);
			public_vars.$pageContainer.removeClass(public_vars.sidebarOnTransitionClass).removeClass(public_vars.sidebarOnHideTransitionClass);

			$collapse_icon.css('style', '');

		}, public_vars.sidebarTransitionTime);
	}
}

const toggle_sidebar_menu = (with_animation) =>
{
	const open = public_vars.$pageContainer.hasClass(public_vars.sidebarCollapseClass);

	if(open)
	{
		show_sidebar_menu(with_animation);
		ps_init();
	}
	else
	{
		hide_sidebar_menu(with_animation);
		ps_destroy();
	}
}


// Added on v1.5
const rtl = () => // checks whether the content is in RTL mode
{
	if(typeof window.isRTL == 'boolean')
		return window.isRTL;

	window.isRTL = jQuery("html").get(0).dir == 'rtl' ? true : false;

	return window.isRTL;
}

// Right to left Coeficient
const rtlc = () =>
{
	return rtl() ? -1 : 1;
}


// Perfect scroll bar functions by Arlind Nushi
const ps_update = (destroy_init) =>
{
	if(isxs())
		return;

	if(jQuery.isFunction(jQuery.fn.perfectScrollbar))
	{
		if(public_vars.$sidebarMenu.hasClass('collapsed'))
		{
			return;
		}

		public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('update');

		if(destroy_init)
		{
			ps_destroy();
			ps_init();
		}
	}
}

const ps_init = () =>
{
	if(isxs())
		return;

	if(jQuery.isFunction(jQuery.fn.perfectScrollbar))
	{
		if(public_vars.$pageContainer.hasClass(public_vars.sidebarCollapseClass) || ! public_vars.$sidebarMenu.hasClass('fixed'))
		{
			return;
		}

		public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar({
			wheelSpeed: 1,
			wheelPropagation: public_vars.wheelPropagation
		});
	}
}

const ps_destroy = () =>
{
	if(jQuery.isFunction(jQuery.fn.perfectScrollbar))
	{
		public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('destroy');
	}
}