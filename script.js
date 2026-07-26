/* ===========================================
   捷视源官网 交互脚本
   =========================================== */
(function () {
  'use strict';

  /* ----- Header 滚动效果 ----- */
  const header = document.getElementById('header');
  const backTop = document.getElementById('backTop');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    backTop.classList.toggle('show', y > 600);
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- 移动端菜单 ----- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // 点击菜单项后关闭移动菜单
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  /* ----- 导航当前 section 高亮 ----- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const updateActiveNav = () => {
    let current = 'home';
    const pos = window.scrollY + 120;
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  };

  /* ----- 案例筛选 ----- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      caseCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.cat === filter;
        if (match) {
          card.classList.remove('hidden');
          // 简单的重新进入动画
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ----- 滚动揭示动画 ----- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .about-text, .about-cards, .about-card, ' +
    '.product-card, .app-card, .adv-card, .case-card, ' +
    '.partner-card, .coop-card, .contact-info, .contact-cta'
  );

  revealTargets.forEach((el) => el.classList.add('fade-up'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // 同组元素错开延迟，营造依次出现的效果
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = (Math.min(idx, 4) * 80) + 'ms';
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  revealTargets.forEach((el) => io.observe(el));

  /* ----- 平滑滚动（兼容性增强） ----- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 70; // 头部高度
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ----- Hero 数字滚动效果 ----- */
  const animateNum = (el, target, decimals = 0, suffix = '') => {
    const duration = 1600;
    const start = performance.now();
    const startVal = 0;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = startVal + (target - startVal) * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ----- 设置当前年份 ----- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ----- 初始触发 ----- */
  onScroll();
})();
