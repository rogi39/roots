document.addEventListener("DOMContentLoaded", function () {

	// Custom JS

});

const header = document.querySelector('.header');
const togglemenu = document.querySelector('#toggle-menu');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.overlay');
var scrollPrev = 0;
togglemenu.addEventListener('click', () => {
	togglemenu.classList.toggle("on");
	menu.classList.toggle("on");
	overlay.classList.toggle("active");
	document.body.classList.toggle("noscroll");
	let wsb = widthScrollBar();
	if (togglemenu.classList.contains('on')) {
		header.style.paddingRight = widthScrollBar() + 'px';
		document.querySelector('.main').style.paddingRight = wsb + 'px';
		document.querySelector('.footer').style.paddingRight = wsb + 'px';
	} else {
		header.style.paddingRight = '0px';
		document.querySelector('.main').style.paddingRight = '0px';
		document.querySelector('.footer').style.paddingRight = '0px';
	}
});



window.addEventListener('click', (e) => {
	if (e.target == overlay) {
		togglemenu.classList.remove("on");
		menu.classList.remove("on");
		overlay.classList.remove("active");
		document.body.classList.remove("noscroll");
		header.style.paddingRight = '0px';
		document.querySelector('.main').style.paddingRight = '0px';
		document.querySelector('.footer').style.paddingRight = '0px';
	}
});



window.addEventListener('scroll', () => {
	let scrolled = window.pageYOffset;
	if (scrolled >= 500) {
		header.classList.add("scrolled");
	} else if (scrolled <= 500) {
		header.classList.remove("scrolled");
	}
	if (scrolled >= 900) {
		header.classList.add("on");
	} else if (scrolled <= 900) {
		header.classList.remove("on");
	}

});


var galleries = document.querySelectorAll('.lg');
for (let i = 0; i < galleries.length; i++) {
	lightGallery(galleries[i], {
		thumbnail: false,
		selector: '.lg-item',
		download: false
	})
}

const createProductSingleSlider = () => {

	let thumb = new Swiper(".cottage-thumbs-slider", {
		spaceBetween: 14,

		loop: false,
		slidesPerView: 4,
		autoHeight: false,
		// slidesPerColumnFill: 'row',
		breakpoints: {
			'768': {
				direction: 'vertical',
			}
		},

	});
	let big = new Swiper(".cottage-big-slider", {
		spaceBetween: 16,
		autoHeight: false,
		loop: false,
		navigation: {
			prevEl: ".slider-btn__item_prev",
			nextEl: ".slider-btn__item_next",
		},
		pagination: {
			el: '.slider-pagination',
			clickable: true,
		},
		thumbs: {
			swiper: thumb,
		},
	});

}

createProductSingleSlider();


const createAboutSlider = () => {

	let about = new Swiper(".about-slider", {
		spaceBetween: 8,
		slidesPerView: 1,
		autoHeight: false,
		loop: true,
		navigation: {
			prevEl: ".slider-btn__item_prev",
			nextEl: ".slider-btn__item_next",
		},
		breakpoints: {
			'576': {
				pagination: false,
				slidesPerView: 2,
				spaceBetween: 16,
			},
			'768': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 4,
				spaceBetween: 30,
			}
		},
		pagination: {
			el: ".swiper-pagination",
		},
		// pagination: {
		// 	el: '.slider-pagination',
		// 	clickable: true,
		// },

	});

}

createAboutSlider();


if (document.querySelector('#open-video')) {
	document.querySelector('#open-video').addEventListener('click', openVideo);
}

function openVideo() {
	let modalCallback = document.getElementById("modal-video");
	if (document.getElementById("modal-video").querySelector('video')) {
		document.getElementById("modal-video").querySelector('video').play();
	}
	window.addEventListener('click', function (e) {
		if (e.target.classList.contains("modal") || e.target.classList.contains("modal-content")) {
			fadeOut(modalCallback, 300);
			if (document.getElementById("modal-video").querySelector('video')) {
				document.getElementById("modal-video").querySelector('video').pause();
			}
		}
	});
	let close = modalCallback.querySelector(".modal-content__close");
	fadeIn(modalCallback, 300, 'flex');
	close.onclick = function () {
		fadeOut(modalCallback, 300);
		if (document.getElementById("modal-video").querySelector('video')) {
			document.getElementById("modal-video").querySelector('video').pause();
		}
	}
}

let memoriesItems = document.querySelectorAll('.memories__item');
if (memoriesItems) {
	memoriesItems.forEach(el => {
		el.addEventListener('click', openMemories);
	})
}

function openMemories(e) {
	let trg = e.currentTarget;
	let modal = trg.querySelector('.memories__modal');
	window.addEventListener('click', function (e) {
		if (e.target.classList.contains("memories__modal") && modal.classList.contains('active') || e.target.classList.contains("memories__modal-close")) {
			fadeOut(modal, 300);
			setTimeout(() => {
				modal.classList.remove('active');
				document.body.classList.remove("noscroll");
				header.style.paddingRight = '0px';
				document.querySelector('.main').style.paddingRight = '0px';
			}, 300);

		}
	});
	if (modal !== null && !modal.classList.contains('active')) {
		let wsb = widthScrollBar();
		fadeIn(modal, 300, 'block');
		document.body.classList.add("noscroll");
		header.style.paddingRight = wsb + 'px';
		document.querySelector('.main').style.paddingRight = wsb + 'px';
		setTimeout(() => {
			modal.classList.add('active');
		}, 300);
	}
}



document.querySelector('.form').addEventListener('submit', sendForm);

function sendForm(event) {
	let form = event.target;
	event.preventDefault();
	let btn = event.target.querySelector('button');
	let btnText = btn.textContent;
	btn.setAttribute('disabled', 'disabled');
	btn.textContent = 'Загрузка...';
	let formData = new FormData(form);
	formData.append("action", "form_send");
	fetch('/wp-admin/admin-ajax.php', {
			method: "POST",
			body: formData,
		})
		.then(response => response.json())
		.then((data) => {
			if (data.result === 'ok') {
				formMessageResponse(true, data.message);
				btn.textContent = btnText;
				btn.removeAttribute('disabled');
				form.reset();
			} else if (data.result === 'false') {
				formMessageResponse(false, data.message);
				btn.textContent = btnText;
				btn.removeAttribute('disabled');
				let inputs = form.querySelectorAll('input');
				inputs.forEach(el => {
					el.addEventListener('input', () => {
						el.removeAttribute("style");
					});
				});
				if (data.errors) {
					for (let el in data.errors) {
						document.querySelector(`input[name=${el}]`).style.borderColor = "#da4c4c";
					}
				}
			}
		});
}

function formMessageResponse(check, msg = '') {
	if (document.querySelector('.form-message-response')) document.querySelector('.form-message-response').remove();
	let div = document.createElement('div');
	div.classList.add('form-message-response');
	check === true ? div.classList.add('form-message-response__success') : div.classList.add('form-message-response__error');
	div.textContent = msg ? msg : (check === true ? 'Сообщение успешно отправлено!' : 'Заполните обязательные поля!');
	// div.textContent = 'Сообщение успешно отправлено!';

	document.querySelector('body').insertAdjacentElement('beforebegin', div);
	setTimeout(() => {
		div.classList.add('active');
		setTimeout(() => {
			div.classList.remove('active');
			setTimeout(() => {
				div.remove();
			}, 500);
		}, 3000);
	}, 10);
}

if (document.querySelector('.g-form')) {
	document.querySelector('.g-form').addEventListener('submit', gForm);
	document.addEventListener('DOMContentLoaded', gForm);
	setInterval(gForm, 60000);

	function gForm() {
		grecaptcha.ready(function () {
			grecaptcha.execute('6LckdfwpAAAAAB2H1IBD8eTFk7KsMMHflCCLSMQw', {
				action: 'homepage'
			}).then(function (token) {
				var captcha = document.querySelector('input[name="g-recaptcha-response-form"]');
				captcha.value = token;
			});
		});
	}
}

function fadeIn(el, timeout, display) {
	el.style.opacity = 0;
	el.style.display = display || 'block';
	el.style.transition = `opacity ${timeout}ms`;
	setTimeout(() => {
		el.style.opacity = 1;
	}, 10);
}

function fadeOut(el, timeout) {
	el.style.opacity = 1;
	el.style.transition = `opacity ${timeout}ms`;
	el.style.opacity = 0;

	setTimeout(() => {
		el.style.display = 'none';
	}, timeout);
}

function widthScrollBar() {
	let div = document.createElement('div');
	div.style.overflowY = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';
	document.body.append(div);
	let scrollWidth = div.offsetWidth - div.clientWidth;
	div.remove();
	return scrollWidth;
}