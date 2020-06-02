(function () {
	var idbase = "slideshowabhi";
	var count = 7;
	var slide_current = 1;
	var slide_next = 1;
	var frozen = 0;
	var timeinterval_s = 5;
	var timeinterval_first_s = timeinterval_s + 0;
	var action_type;
	var slide_prev;
	var timerid;
	var a, b, c;
	zIndex_current = 500;
	var self = this;
	if (frozen) return;
	for (n = 1; n <= count; n++) {
		b = document.getElementById(idbase + '-dot-' + n);
		if (b)
			(function (nn) {
				b.onclick = function () {
					timer_stop(); if (false && nn == slide_current)
					{ document.getElementById(idbase + '-slide-' + nn).click(); return; } display(nn); timer_start(6);
				}
			})(n)
	}


	if (b = document.getElementById(idbase + '-buttonback'))
		b.onclick = function () { var n = slide_current - 1;; if (n < 1) n = count; display(n, false, true); timer_start() }
	if (b = document.getElementById(idbase + '-buttonforward'))
		b.onclick = function () { var n = slide_current + 1; if (n > count) n = 1; display(n, false, false); timer_start() }



	function start() {
		action_type = "start"
		this.rotation_time_start_utc_ms = (new Date()).getTime();
		timer_start(0.01)
	}

	function sequencer(n) {
		if (n != null) { timer_stop(); display(n); timer_start(); this.rotation_time_start_utc_ms = (new Date()).getTime(); return; }
		switch (action_type) {
			case "start": display(slide_current, true);
				action_type = "usualpass"
				timer_start(timeinterval_first_s)
				break

			case "usualpass":
				b = document.getElementById(idbase + '-image-' + slide_next);
				if (!b.slide_ready) {
					if (!b.slide_try_n) b.slide_try_n = 1;
					if (b.slide_try_n < 3) b.slide_try_n++;
					else slide_next = (slide_next >= count) ? 1 : slide_next + 1;
					timer_start(timeinterval_s / 4);
					return;
				}
				//usual pass
				if (1 || this.contents_ar[slide_next].ready()) {
					display(slide_next, false, false);
					timer_start()
				}
				else {
					slide_next++; if (slide_next > count) slide_next = 1;
					display(slide_next)
					timer_start()
				}
		}
	}


	function display(n, now, backward) {
		//console.debug(n);
		var d = document.getElementById(idbase + '-slide-' + n);
		if (!d) return;
		zIndex_current += 2;
		for (var nn = count; nn >= 1; nn--) button_off(nn);
		d.style.zIndex = zIndex_current;
		if (!now) d.style.opacity = 0;
		d.style.visibility = "visible";
		button_on(n);
		if (zIndex_current > 9000) {
			for (var nn = count; nn >= 1; nn--) { if (n != nn) document.getElementById(this.contents_ar[nn].id).style.zIndex -= 8500; }
			zIndex_current -= 8500;
			d.style.zIndex = zIndex_current;
		}

		if ((this.frameimage != null) && (this.frameimage.src != null) && (this.contents_ar[slide_next].href != null))
			document.getElementById(this.frameimage.id + '_a').href = this.contents_ar[slide_next].href
		//console.debug(n+'  '+slide_current);
		if (backward == undefined) backward = n < slide_current;
		slide_current = n;
		slide_next = slide_current + 1; if (slide_next > count) slide_next = 1;
		if (!now) effect(d, slide_prev, backward);
		slide_prev = d;
	}

	function button_off(n) { class_delete(document.getElementById(idbase + '-dot-' + n), '-on'); class_delete(document.getElementById(idbase + '-arrow-' + n), '-on'); }
	function button_on(n) { class_set(document.getElementById(idbase + '-dot-' + n), '-on'); class_set(document.getElementById(idbase + '-arrow-' + n), '-on') }


	function timer_start(timer_s) { timer_stop(); timerid = window.setTimeout(sequencer, 1000 * (timer_s == null ? timeinterval_s : timer_s)); }
	function timer_stop() { if (timerid) window.clearTimeout(timerid); timerid = null }


	function class_set(obj, clss) {
		if (!obj) return;
		class_delete(obj, clss);
		obj.className = String(obj.className) + ' ' + clss;
		//console.debug(obj.id);
		//console.debug(obj.className);
	}


	function class_delete(obj, clss) {
		if (!obj) return;
		obj.className = String(obj.className).replace(new RegExp('(^|\\s)' + clss + '(\\s|$)', 'g'), '$2');
	}


	function effect(obj, direction) {
		if (!obj) return;
		//console.debug(obj.style.opacity);
		var o = (obj.style.opacity ? parseFloat(obj.style.opacity) : 0) + 0.1;
		if (o >= 1) { o = 1; obj.effect_limiter = 0; }
		obj.style.opacity = o;
		obj.effect_limiter = obj.effect_limiter ? obj.effect_limiter + 1 : 1;
		if (o < 1 && obj.effect_limiter < 100)
			window.setTimeout(function () {
				effect(obj);
			}
				, 25);
	}


	start();

})();