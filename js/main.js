(function () {
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Cookie consent
  var banner = document.getElementById('cookieBanner');
  var consent = localStorage.getItem('cookieConsent');
  if (!consent) setTimeout(function () { banner.classList.add('show'); }, 600);
  document.getElementById('cookieAccept').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('show');
  });
  document.getElementById('cookieDecline').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'declined');
    banner.classList.remove('show');
  });
  document.querySelectorAll('.js-cookie-settings').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      banner.classList.add('show');
    });
  });

  // Scroll-triggered reveal animations
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Hero ambience play/pause toggle
  var scene = document.getElementById('heroScene');
  var playBtn = document.getElementById('heroPlayBtn');
  var iconPause = document.getElementById('iconPause');
  var iconPlay = document.getElementById('iconPlay');
  var heroVideo = scene ? scene.querySelector('video') : null;
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      var paused = scene.classList.toggle('paused');
      playBtn.setAttribute('aria-pressed', String(!paused));
      iconPause.hidden = paused;
      iconPlay.hidden = !paused;
      if (heroVideo) {
        if (paused) {
          heroVideo.pause();
        } else {
          heroVideo.play().catch(function () {});
        }
      }
    });
  }
  if (heroVideo) {
    heroVideo.play().catch(function () {});
  }

  // Events horizontal scroller
  var track = document.getElementById('eventsTrack');
  var eventsPrev = document.getElementById('eventsPrev');
  var eventsNext = document.getElementById('eventsNext');
  if (track && eventsPrev && eventsNext) {
    var scrollAmount = function () {
      var card = track.querySelector('.event-card');
      return card ? card.getBoundingClientRect().width + 24 : 320;
    };
    eventsPrev.addEventListener('click', function () { track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); });
    eventsNext.addEventListener('click', function () { track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); });
  }

  // Testimonial carousel
  var testimonials = [
    {
      quote: 'Café Mira has become my go-to spot for my daily coffee fix. The espresso is consistently rich and flavorful, and the baristas are true artists.',
      name: 'Sarah M.',
      role: 'A Coffee Lover’s Paradise'
    },
    {
      quote: 'The kind of café where twenty minutes turns into three hours. Great light, better pastries.',
      name: 'Jonas P.',
      role: 'Regular Since 2021'
    },
    {
      quote: 'Quiet enough to work, warm enough to linger. My laptop and I are grateful.',
      name: 'Marie L.',
      role: 'Freelance Designer'
    }
  ];
  var tIndex = 0;
  var quoteEl = document.getElementById('testimonialQuote');
  var nameEl = document.getElementById('testimonialName');
  var roleEl = document.getElementById('testimonialRole');

  function renderTestimonial() {
    var t = testimonials[tIndex];
    quoteEl.style.opacity = 0;
    nameEl.style.opacity = 0;
    setTimeout(function () {
      quoteEl.textContent = '“' + t.quote + '”';
      nameEl.textContent = '— ' + t.name;
      roleEl.textContent = t.role;
      quoteEl.style.opacity = 1;
      nameEl.style.opacity = 1;
    }, 200);
  }

  var tPrev = document.getElementById('testimonialPrev');
  var tNext = document.getElementById('testimonialNext');
  if (tPrev && tNext) {
    tPrev.addEventListener('click', function () {
      tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial();
    });
    tNext.addEventListener('click', function () {
      tIndex = (tIndex + 1) % testimonials.length;
      renderTestimonial();
    });
  }

  // Reservation form (placeholder — wire up to a real backend/email service before launch)
  var form = document.getElementById('reserveForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = 'Thank you! We’ll confirm your reservation within 24 hours.';
    form.reset();
  });

  // Newsletter form (placeholder — wire up to a real backend/email service before launch)
  var nl = document.getElementById('newsletterForm');
  nl.addEventListener('submit', function (e) {
    e.preventDefault();
    nl.querySelector('input').value = '';
    if (!nl.querySelector('.form-note')) {
      var note = document.createElement('p');
      note.className = 'form-note';
      note.style.cssText = 'width:100%;margin-top:.75rem;font-size:.85rem;';
      note.textContent = 'Thanks for signing up!';
      nl.appendChild(note);
    }
  });

  // Stats counter animation
  var counters = document.querySelectorAll('.stats__counter');
  if ('IntersectionObserver' in window && counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.getAttribute('data-target'), 10);
          var element = entry.target;
          var current = 0;
          var duration = 1200;
          var startTime = performance.now();
          
          function animate(now) {
            var elapsed = now - startTime;
            var progress = Math.min(elapsed / duration, 1);
            current = Math.floor(progress * target);
            element.textContent = current;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              element.textContent = target;
            }
          }
          
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (counter) { counterObserver.observe(counter); });
  }
})();
