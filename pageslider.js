function pageslider(item) {

	var $this = item,
		$body = document.body,
		$page = $this.children,
		winH = window.innerHeight || document.documentElement.clientHeight,
		winW = window.innerWidth || document.documentElement.clientWidth,
		lastCall = 0,
		pageActive = 0,
		pageCount = $page.length - 1,
		pageLength = $this.children.length,
		delta,
		touchStartPoint = {},
		touchNowPoint,
		yAbs,

		animationTime = 700,
		delayTime = 1500,
		$navLi = document.getElementById('pageslider__nav').children,  // id of main nav > li
		$textBlock = document.getElementById('pageslider__for-text'),
		prevNav = true,
		$prev = document.getElementById('b-navkey__prev'),
		nextNav = true,
		$next = document.getElementById('b-navkey__next'),
		$navKeyloop = true,
		textArray = ['Ты можешь...', '... вставить текст ...', '... в зависимости ...', '... от слайда ...', 'Bye!'];



	$page[pageActive].classList.add('active');
	$body.setAttribute( 'data-pageslider-progress', Math.round(100 / (pageLength - 1) * pageActive) );
	$body.setAttribute( 'data-pageslider-number', pageActive + 1 );
	$navLi[pageActive].classList.add('active');

	if (textArray) {
		$textBlock.innerHTML = textArray[0];
	}



	if (window.addEventListener) {

		if ('onwheel' in document) {
			// IE9+, FF17+, Ch31+
			window.addEventListener("wheel", onWheel);
		} else if ('onmousewheel' in document) {
			// old event variant
			window.addEventListener("mousewheel", onWheel);
		} else {
			// Firefox < 17
			window.addEventListener("MozMousePixelScroll", onWheel);
		}

	} else { // IE8-

		window.attachEvent("onmousewheel", onWheel);

	}



	document.addEventListener('touchstart', function(event) {

		event.preventDefault();
		event.stopPropagation();

		touchStartPoint.y = event.changedTouches[0].pageY;

	}, false);



	document.addEventListener('keydown', function(event) {

		var keyCode = event.keyCode;

		keyNav(keyCode);

	}, false);


	if (prevNav) {

		$prev.addEventListener('click', function(event) {

			if ( pageActive == 0 ) {

				if ($navKeyloop) {

					delta = 1;

					handle(delta, animationTime, true, pageCount, pageActive);
				}

			} else {

				delta = -1;
				
				handle(delta, animationTime);
			}

		}, false);

	}



	if (nextNav) {

		$next.addEventListener('click', function(event) {

			if ( pageActive == pageCount ) {

				if ($navKeyloop) {

					delta = -1;

					handle(delta, animationTime, true, 0, pageActive);
				}

			} else {

				delta = 1;
				
				handle(delta, animationTime);
			}

		}, false);

	}



	for (var i = 0; i < $navLi.length; i++) {

		$navLi[i].num = i;

		$navLi[i].addEventListener('click', function(event) {
			clickNav(this);
		}, false);

		$navLi[i].addEventListener('touchend', function(event) {
			clickNav(this);
		}, false);

	};



	function clickNav(item) {

		var i = item.num;

		if (pageActive > i) {
			delta = -1;

			noActivePage = pageActive;
			
			handle(delta, animationTime, true, i, noActivePage);

		} else if (pageActive < i) {
			delta = 1;

			noActivePage = pageActive;

			handle(delta, animationTime, true, i, noActivePage);
		}
	}

	function keyNav(keyCode) {

		if ( keyCode == 87 || keyCode == 38 ) {
			delta = -1;

			noActivePage = pageActive;
			
			handle(delta, animationTime);

		} else if ( keyCode == 83 || keyCode == 40 ) {
			delta = 1;

			noActivePage = pageActive;

			handle(delta, animationTime);
		}
	}
	


	function onWheel(event) {

		event = event || window.event;

		delta = event.deltaY || event.detail || event.wheelDelta;

		handle(delta, delayTime);
	}



	function classClean() {

		for (var i = pageCount; i >= 0; i--) {
			$page[i].classList.remove('active');
			$navLi[i].classList.remove('active');
		};

	}



	function handle(delta, delay, nav, i, noActivePage) {

		var now = Date.now();

		if (now - lastCall > delay) {

			if ( delta > 0 ) {

				if (nav) {
					
					pageActive = i;

					classClean();

					$page[pageActive].classList.add('active', 'pt-page-moveFromBottom');
					$page[noActivePage].classList.add('active', 'pt-page-moveToTopEasing', 'pt-page-ontop');
				
				} else {

					if( !( pageActive == pageCount ) ) {

						classClean();

						pageActive++;

						$page[pageActive].classList.add('active', 'pt-page-moveFromBottom');
						$page[pageActive].previousElementSibling.classList.add('active', 'pt-page-moveToTopEasing', 'pt-page-ontop');
					}
				}

			} else if ( delta < 0 ) {

				if (nav) {
					
					pageActive = i;

					classClean();

					$page[pageActive].classList.add('active', 'pt-page-moveFromTop', 'pt-page-ontop');
					$page[noActivePage].classList.add('active', 'pt-page-moveToBottomEasing');
				
				} else {

					if( !(pageActive == 0) ) {

						classClean();

						pageActive--;

						$page[pageActive].classList.add('active', 'pt-page-moveFromTop', 'pt-page-ontop');
						$page[pageActive].nextElementSibling.classList.add('active', 'pt-page-moveToBottomEasing');
					}
				}
			}

			$body.setAttribute( 'data-pageslider-progress', Math.round(100 / (pageLength - 1) * pageActive) );
			$body.setAttribute( 'data-pageslider-number', pageActive + 1 );
			$navLi[pageActive].classList.add('active');

			if (textArray) {
				$textBlock.innerHTML = textArray[pageActive];
			}

			setTimeout(func, animationTime);

			lastCall = now;
		}
	}



	function func() { // add class for animation and
	//add active class for new slider

		for (var i = pageCount; i >= 0; i--) {
			$page[i].classList.remove('active', 'pt-page-ontop', 'pt-page-moveFromBottom', 'pt-page-moveToTopEasing', 'pt-page-moveToBottomEasing', 'pt-page-moveFromTop');
		};

		$page[pageActive].classList.add('active');
	}

};