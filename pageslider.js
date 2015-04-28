function pageslider(item) {

    var options = {
		nav: 'pageslider__nav', // id of main nav
    };

	var $this = item,
		$body = document.body,
		$page = $this.children,
		winH = window.innerHeight || document.documentElement.clientHeight,
		winW = window.innerWidth || document.documentElement.clientWidth,
		lastCall = 0,
		pageActive = 0,
		pageLength = $this.children.length,
		delta,
		touchStartPoint = {},
		touchNowPoint,
		yAbs,

		loop = options.loop,
		$nav = options.nav,
		$navLi = document.getElementById($nav).children;



	$page[pageActive].classList.add('active');
	$body.setAttribute( 'data-pageslider-progress', Math.round(100 / (pageLength - 1) * pageActive) );
	$body.setAttribute( 'data-pageslider-number', pageActive + 1 );
	$navLi[pageActive].classList.add('active');



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



	document.addEventListener('touchend', function(event) {

		touchNowPoint = event.changedTouches[0];

		yAbs = Math.abs(touchStartPoint.y - touchNowPoint.pageY);

		if (yAbs > 20) {

			if (touchNowPoint.pageY < touchStartPoint.y) {
				delta = 1;
			}
			else {
				delta = -1;
			}

			handle(delta, 700, false);

		}
	}, false);



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
			
			handle(delta, 700, true, i, noActivePage);

		} else if (pageActive < i) {
			delta = 1;

			noActivePage = pageActive;

			handle(delta, 700, true, i, noActivePage);
		}
	}
	


	function onWheel(event) {

		event = event || window.event;

		delta = event.deltaY || event.detail || event.wheelDelta;

		handle(delta, 1500, false);
	}



	function classClean() {

		for (var i = $page.length - 1; i >= 0; i--) {
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

					if( !( pageActive == ($page.length - 1) ) ) {

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

			setTimeout(func, 700, false);

			lastCall = now;
		}
	}



	function func() { // add class for animation and
	//add active class for new slider

		for (var i = $page.length - 1; i >= 0; i--) {
			$page[i].classList.remove('active', 'pt-page-ontop', 'pt-page-moveFromBottom', 'pt-page-moveToTopEasing', 'pt-page-moveToBottomEasing', 'pt-page-moveFromTop');
		};

		$page[pageActive].classList.add('active');
	}

};