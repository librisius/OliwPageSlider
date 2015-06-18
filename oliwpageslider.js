function pageslider(item, callback) {

	var $this = item,
		$body = document.body,
		$page = $this.children,
		winH = window.innerHeight || document.documentElement.clientHeight,
		location = window.location,
		hash = location.hash,
		nowWheel,
		nowHandle,
		lastCallWhile = 0,
		lastCallHandle = 0,
		pageActive = 0,
		$pageActive,
		$noActivePage,
		pageCount = $page.length - 1,
		pageLength = $this.children.length,
		pageCenter = Math.round(pageLength/2),
		moveFlag = true,
		delta,
		deltaPrev = 0,
		touchStartPoint,
		touchMovePoint,
		touchNowPoint,
		yAbs,

		animationTime = .7,
		delayTime = animationTime*1000,
		
		loop = false,
		navKeyloop = true,

		$toTop = document.getElementById('pageslider__to-top'),
		$navLi = document.getElementById('pageslider__nav').children,  // id of main nav > li
		$textBlock = document.getElementById('pageslider__for-text'),

		$prev = document.getElementById('b-navkey__prev'),
		$next = document.getElementById('b-navkey__next'),

		textArray = ['Ты можешь...', '... вставить текст ...', '... в зависимости ...', '... от слайда ...', 'Oliw Page Slider'],
		hrefArray = 'layout';


	if (hrefArray == 'layout') {  // add hashes from nav
		hrefArray = [];

		var thisHash;

		for (var i = 0; i < $navLi.length; i++) {
			thisHash = $navLi[i].querySelector('a').getAttribute('href');

			hrefArray.push(thisHash);
		}
	}



	if (hrefArray) { // to active page
		// read active block from nav

		var thisHash,
			regexp = /^#./;

		for (var i = 0; i < hrefArray.length; i++) {

			if( !(regexp.test(hrefArray[i])) ) {
				thisHash = '#' + hrefArray[i];
			} else {
				thisHash = hrefArray[i];
			}
			
			if (hash == thisHash) {
				pageActive = i;
				$pageActive = $page[pageActive]
				break;
			} else if (i == hrefArray.length - 1) {
				location.hash = hrefArray[0];
			}
		}
	}

	$pageActive.classList.add('active');

	sliderActive(pageActive);



	// Touch
	document.addEventListener('touchstart', function(event) {

		touchStartPoint = event.changedTouches[0].clientY;

	}, false);



	document.addEventListener('touchmove', function(event) {

		var $children = $pageActive.children[0];

		if ($children.clientHeight > winH) {
			moveFlag = false;

			if ($children.getBoundingClientRect().top == 0) {
				moveFlag = true;
			}

			if (Math.abs($children.getBoundingClientRect().top) == $children.clientHeight - winH) {
				moveFlag = true;
			}
		}
		else {
			moveFlag = true;

			touchMovePoint = event.changedTouches[0].clientY;

			$pageActive.style.transform = 'translateY(' + -(touchStartPoint - touchMovePoint) + 'px' + ')';
		}

	}, false);



	document.addEventListener('touchend', function(event) {

		touchNowPoint = event.changedTouches[0];

		yAbs = Math.abs(touchStartPoint - touchNowPoint.clientY);

		$pageActive.style.transform = '';

		if (yAbs > winH/4 && moveFlag) {

			if (touchNowPoint.clientY < touchStartPoint) {
				delta = 1;
			}
			else {
				delta = -1;
			}

			handle(delta, delayTime, false);

		}

	}, false);



	//Keybord
	document.addEventListener('keydown', function(event) {

		var keyCode = event.keyCode;

		keyNav(keyCode);

	}, false);

	window.addEventListener('scrollDown', function(event) {
        handle(1, delayTime);
    });

	window.addEventListener('scrollUp', function(event) {
        handle(-1, delayTime);
    });

	window.addEventListener('resize', function(event) {
        winH = window.innerHeight || document.documentElement.clientHeight
    });



	if ( $prev ) {

		$prev.addEventListener('click', function(event) {
			fnPrevNav();
		}, false);

		$prev.addEventListener('touchend', function(event) {
			fnPrevNav();
		}, false);
	}

	if ( $next ) {

		$next.addEventListener('click', function(event) {
			fnNextNav();
		}, false);

		$next.addEventListener('touchend', function(event) {
			fnNextNav();
		}, false);
	}

	if ( $toTop ) {

		$toTop.addEventListener('click', function(event) {
			toTop();
		}, false);

		$toTop.addEventListener('touchend', function(event) {
			toTop();
		}, false);
	}



	for (var i = 0; i < $navLi.length; i++) {

		$navLi[i].num = i;

		$navLi[i].addEventListener('click', function(event) {
			event.preventDefault();
			clickNav(this);
		}, false);

		$navLi[i].addEventListener('touchend', function(event) {
			event.preventDefault();
			clickNav(this);
		}, false);

	};

	function toTop() {

		if ( pageActive != 0 ) {

			if (pageActive < pageCenter) {
				delta = -1;

				noActivePage = pageActive;
				
				handle(delta, animationTime, true, 0, noActivePage);

			} else {
				delta = 1;

				noActivePage = pageActive;

				handle(delta, animationTime, true, 0, noActivePage);
			}
		}
	}



	function sliderActive(pageActive) {

		$body.setAttribute( 'data-pageslider-progress', Math.round(100 / (pageLength - 1) * pageActive) );
		$body.setAttribute( 'data-pageslider-number', pageActive + 1 );
		$navLi[pageActive].classList.add('active');

		setTimeout(function() { //weaknesses

			if (textArray) {
				$textBlock.innerHTML = textArray[pageActive];
			}

			if (hrefArray) {
				location.hash = hrefArray[pageActive];
			}
		}, delayTime - 700);
	}



	function fnPrevNav() {

		if ( pageActive == 0 ) {

			if (navKeyloop) {

				delta = 1;

				handle(delta, animationTime, true, pageCount, pageActive);
			}

		} else {

			delta = -1;
			
			handle(delta, delayTime);
		}
	}

	function fnNextNav() {

		if ( pageActive == pageCount ) {

			if (navKeyloop) {

				delta = -1;

				handle(delta, animationTime, true, 0, pageActive);
			}

		} else {

			delta = 1;
			
			handle(delta, delayTime);
		}

	}



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
			// 87 - is arrow top
			// 38 - is arrow bottom
			delta = -1;

			noActivePage = pageActive;
			
			handle(delta, delayTime);

		} else if ( keyCode == 83 || keyCode == 40 ) {
			// 83 - is letter 'W'
			// 38 - is letter 'S'
			delta = 1;

			noActivePage = pageActive;

			handle(delta, delayTime);
		}
	}



	// delete all class active
	function classClean() {

		for (var i = pageCount; i >= 0; i--) {
			$page[i].classList.remove('active');
			$navLi[i].classList.remove('active');
		};
	}



	function handle(delta, delay, nav, i, noActivePage) {

		nowHandle = Date.now();

		if (nowHandle - lastCallHandle > delay) {

			callback();

			$body.classList.add('onanimation');

			if ( delta > 0 ) {

				if (nav) {
				
					classClean();

					pageActive = i;

					$pageActive = $page[pageActive],
					$noActivePage = $page[noActivePage];

					$pageActive.classList.add('active', 'pt-page-moveFromBottom');
					$noActivePage.classList.add('active', 'pt-page-ontop', 'pt-page-moveToTop');

					sliderActive(pageActive);

					setTimeout(func, delayTime);

					lastCallHandle = nowHandle;
				
				} else {

					if ( !( pageActive == pageCount ) ) {
				
						classClean();

						pageActive++;

						$pageActive = $page[pageActive],
						$noActivePage = $page[pageActive].previousElementSibling;

						$pageActive.classList.add('active', 'pt-page-moveFromBottom');
						$noActivePage.classList.add('active', 'pt-page-ontop', 'pt-page-moveToTop');

						sliderActive(pageActive);

						setTimeout(func, delayTime);

						lastCallHandle = nowHandle;

					} else if ( pageActive == pageCount && loop ) {
				
						classClean();

						pageActive = 0;

						$pageActive = $page[pageActive],
						$noActivePage = $page[pageCount];

						$pageActive.classList.add('active', 'pt-page-moveFromBottom');
						$noActivePage.classList.add('active', 'pt-page-ontop', 'pt-page-moveToTop');

						sliderActive(pageActive);

						setTimeout(func, delayTime);

						lastCallHandle = nowHandle;
					}
				}
			} else if ( delta < 0 ) {

				if (nav) {
				
					classClean();

					pageActive = i;

					$pageActive = $page[pageActive],
					$noActivePage = $page[noActivePage];

					$pageActive.classList.add('active', 'pt-page-ontop', 'pt-page-moveFromTop');
					$noActivePage.classList.add('active', 'pt-page-moveToBottom');

					sliderActive(pageActive);

					setTimeout(func, delayTime);

					lastCallHandle = nowHandle;

				} else {

					if ( !(pageActive == 0) ) {
				
						classClean();

						pageActive--;

						$pageActive = $page[pageActive],
						$noActivePage = $page[pageActive].nextElementSibling;

						$pageActive.classList.add('active', 'pt-page-ontop', 'pt-page-moveFromTop');
						$noActivePage.classList.add('active', 'pt-page-moveToBottom');

						sliderActive(pageActive);

						setTimeout(func, delayTime);

						lastCallHandle = nowHandle;

					} else if ( pageActive == 0 && loop ) {
				
						classClean();

						$pageActive = $page[pageCount],
						$noActivePage = $page[pageActive];

						pageActive = pageCount; // it should be here!

						$pageActive.classList.add('active', 'pt-page-ontop', 'pt-page-moveFromTop');
						$noActivePage.classList.add('active', 'pt-page-moveToBottom');

						sliderActive(pageActive);

						setTimeout(func, delayTime);

						lastCallHandle = nowHandle;
					}
				}
			}
		}

	}



	function func() { // add class for animation and
	//add active class for new slider

		for (var i = pageCount; i >= 0; i--) {
			$body.classList.remove('onanimation');
			$page[i].classList.remove('active', 'pt-page-ontop', 'pt-page-moveFromBottom', 'pt-page-moveToTop', 'pt-page-moveToBottom', 'pt-page-moveFromTop');
		};

		$pageActive.classList.add('active');
	}

};