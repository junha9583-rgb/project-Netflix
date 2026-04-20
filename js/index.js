$(function () {
  let $aside = $('#aside'),
    $btn = $aside.find('.menu-btn'),
    sp = 1000,
    easing = ['easeOutExpo', 'easeOutBounce', 'linear'];

  const $section = $('.cont-2'),
    $container = $section.find('.content'),
    $items = $container.find('li'),
    $indicator = $section.find('.indicator'),
    $prevBtn = $section.find('.prev'),
    $nextBtn = $section.find('.next');

  let totalSteps = 1;

  let currentIndex = 0,
    indicatorHTML = '',
    timer;

  let isDragging = false,
    startX = 0,
    moveX = 0;

  // 사이드 메뉴 버튼 이벤트
  $btn.on('click', function (e) {
    e.stopPropagation();
    $btn.toggleClass('active');
    $aside.toggleClass('active');
  });

  // 사이드 메뉴 body 이벤트
  $('body').on('click', function (e) {
    if (!$(e.target).hasClass('area')) {
      $aside.removeClass('active');
      $btn.removeClass('active');
    };
  });

  // cont-1 스택 카드형 디자인
  const $cont1 = $('.cont-1'),
    $recentList = $cont1.find('.recent-list'),
    $recentItems = $recentList.find('li'),
    $progressBar = $cont1.find('.bar'),
    totalRecent = $recentItems.length;

  let recentCurrentIndex = 0;

  if (!$recentItems.hasClass('empty-msg')) {

    function updateRecentStack() {
      $recentItems.each(function (i) {
        let order = (i - recentCurrentIndex + totalRecent) % totalRecent;

        if (order === 0) {
          $(this).css({
            'z-index': totalRecent,
            'transform': 'translateX(0) scale(1.1)',
            'opacity': '1',
            'filter': 'brightness(1)',
            'visibility': 'visible'
          });
        } else {
          let dir = order > totalRecent / 2 ? order - totalRecent : order;
          let absDist = Math.abs(dir);

          $(this).css({
            'z-index': totalRecent - absDist,
            'transform': 'translateX(' + (dir * 150) + 'px) scale(' + (1 - absDist * 0.1) + ')',
            'opacity': absDist > 2 ? '0' : (1 - absDist * 0.3),
            'filter': 'brightness(' + (1 - absDist * 0.2) + ') blur(' + (absDist * 2) + 'px)',
            'visibility': absDist > 2 ? 'hidden' : 'visible'
          });
        }
      });

      let progressRatio = (recentCurrentIndex + 1) / totalRecent;
      let progressWidth = Math.min(progressRatio * 100, 100);

      $progressBar.stop(true, false).animate({
        'width': progressWidth + '%'
      }, 400, 'linear');
    }

    $recentItems.on('click', function (e) {
      e.preventDefault();
      if ($recentItems.is(':animated')) return;
      recentCurrentIndex = $(this).index();
      updateRecentStack();
    });

    updateRecentStack();
  }

  // cont-1 스크롤 이벤트
  $(window).on('scroll', function () {
    const $cont1 = $('.cont-1');
    const $recentList = $cont1.find('.recent-list');
    const $recentItems = $recentList.find('li');

    let scrollPos = $(window).scrollTop();
    let windowHeight = $(window).height();
    let sectionPos = $cont1.offset().top;

    if (scrollPos > sectionPos - windowHeight + 300) {
      if (!$recentList.hasClass('on')) {
        $recentList.addClass('on');

        $recentItems.each(function (i) {
          $(this).css('transition-delay', (i * 0.1) + 's');
        });
        updateRecentStack();
      }
    } else {
      $recentList.removeClass('on');
      $recentItems.css({ 'opacity': 0, 'transform': 'translateY(50px)' });
    }
  });

  // cont-2 스크롤 이벤트
  $(window).on('scroll', function () {
    const $section = $('.cont-2');
    const $content = $('.content');
    const $items = $section.find('li');

    let scrollPos = $(window).scrollTop();
    let sectionPos = $section.offset().top;

    const showThreshold = sectionPos - 600;
    const hideThreshold = sectionPos - 800;

    if (scrollPos > showThreshold) {
      $content.addClass('on');
      if (currentIndex !== 0) $prevBtn.show(sp);
      $nextBtn.show(sp);
      $items.each(function (i) {
        $(this).css('transition-delay', (i * 0.1) + 's');
      });
    } else if (scrollPos < hideThreshold) {
      $content.removeClass('on');
      $prevBtn.hide(sp);
      $nextBtn.hide(sp);
    }
  });

  function setResponsive() {

    const windowWidth = $(window).width();

    $('.active').remove();
    $('.cont-3 li').removeClass('placehold hate love');
    $('#cube-modal').removeClass('on');
    $('.cont-3 .content').css({
      'visibility': 'visible',
      'opacity': 1
    });

    if (windowWidth >= 780) {
      $('#cube-modal').find('.modal-img-area').empty();
      $('#cube-modal').find('.m-title').empty();
      $('#cube-modal').find('.m-meta').empty();
      $('#cube-modal').find('.m-desc').empty();
      $('#cube-modal').find('.m-details').empty();
      $cube.css({
        'transition': 'none',
        'transform': 'translateY(0) rotateX(0deg) rotateY(0deg)',
        'animation': 'roll 25s infinite alternate ease-in-out'
      });
    }

    const itemLength = $items.length;
    let itemsPerView = 5;

    if (windowWidth <= 779) {
      itemsPerView = 2;
    } else if (windowWidth <= 1280) {
      itemsPerView = 3;
    }

    totalSteps = Math.ceil(itemLength / itemsPerView);

    let html = '';
    for (let i = 0; i < totalSteps; i++) {
      html += '<a href="#"></a>';
    }
    $indicator.html(html);

    if (currentIndex >= totalSteps) currentIndex = totalSteps - 1;

    slide(currentIndex);

    $(window).trigger('scroll');
  }

  // 슬라이드 함수
  function slide(i) {
    if (i < 0 || i >= totalSteps) return;

    const viewWidth = $('.cont-2-inner').width();
    const totalWidth = $container[0].scrollWidth;
    const maxMove = totalWidth - viewWidth;

    let leftMove = totalSteps > 1 ? -(maxMove / (totalSteps - 1)) * i : 0;

    $container.stop().animate({
      left: leftMove
    }, sp, easing[0]);

    currentIndex = i;
    upDate();
  }

  // 리사이즈 이벤트 연결
  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setResponsive();
    }, 200);
  }).trigger('resize');

  // 인디케이터 업데이트 함수
  function upDate() {
    $indicator.children().removeClass().eq(currentIndex).addClass('on');

    if (currentIndex == 0) {
      $prevBtn.stop().hide();
    } else {
      $prevBtn.stop().show();
    };

    if (currentIndex == totalSteps - 1) {
      $nextBtn.stop().hide();
    } else {
      $nextBtn.stop().show();
    };
  };

  // 자동 슬라이드 함수
  function startTimer() {
    timer = setInterval(function () {
      let nextIndex = (currentIndex + 1) % totalSteps;
      slide(nextIndex);
    }, sp * 6, easing[0]);
  };

  // 자동 슬라이드 정지 함수
  function stopTimer() {
    clearInterval(timer);
  };

  // 인디케이터 이벤트
  $indicator.on('click', 'a', function (e) {
    e.preventDefault();
    let idx = $(this).index();
    if (!$(this).hasClass('on')) {
      slide(idx);
    };
  });

  // 마우스 이벤트
  $section.on({
    mouseenter: stopTimer,
    mouseleave: startTimer
  });

  // 버튼 이벤트
  $prevBtn.on('click', function () {
    slide(currentIndex - 1);
  });

  $nextBtn.on('click', function () {
    slide(currentIndex + 1);
  });

  // 자동 슬라이드 함수, 인디케이터 업데이트 함수 실행
  currentIndex = 0;
  upDate();
  slide(currentIndex);
  startTimer();

  // cont-2 li 클릭
  $('.cont-2').on('click', 'li', function (e) {
    e.preventDefault();
  });

  // cont-3
  const $cont3 = $('.cont-3');
  const $cont3Content = $cont3.find('.content');
  const $cont3Items = $cont3Content.find('li');

  function closeActiveItem() {
    $('.active').remove();
    $cont3Items.removeClass('placehold');
  }

  $cont3Items.on('click', function (e) {
    e.preventDefault();
    const windowWidth = $(window).width();
    const $this = $(this);

    if ($this.hasClass('placehold')) return;

    e.stopPropagation();

    if (windowWidth >= 780) {
      closeActiveItem();

      $this.addClass('placehold');

      const $placeholder = $this.clone()
        .addClass('active')
        .removeClass('placehold');

      if (windowWidth < 1280) {
        $placeholder.addClass('hate').removeClass('love');
      }

      requestAnimationFrame(() => {
        $cont3Content.append($placeholder);
      });
    }
  });

  $cont3Content.on('click', '.active', function (e) {
    e.preventDefault();
    e.stopPropagation();

    closeActiveItem();
  });

  $('body').on('click', function () {
    closeActiveItem();
  });

  // body 클릭시 닫히게
  $(document).on('click', function (e) {
    const windowWidth = $(window).width();
    const $target = $(e.target);
    const $clickedLi = $target.closest('.cont-3 li');

    if ($clickedLi.length) {
      e.preventDefault();
    }

    if (!$clickedLi.length || $clickedLi.hasClass('active') || $clickedLi.hasClass('hate') || $clickedLi.hasClass('love')) {
      if (windowWidth >= 1280) {
        $('.active').remove();
        $cont3Items.removeClass('placehold');
      } else {
        $cont3Items.removeClass('hate love');
      }
    }
  });

  // 큐브 이벤트
  const $cube = $('.cont-3 .content');
  const $cubeItems = $cube.find('li');
  const $cubeBtn = $('.cont-3 .cube-btn');
  const $modal = $('#cube-modal');
  const faceAngles = [
    { x: 0, y: 0 },      // front (index 0)
    { x: 0, y: 180 },    // back (index 1)
    { x: 0, y: -90 },    // right (index 2)
    { x: 0, y: 90 },     // left (index 3)
    { x: -90, y: 0 },    // top (index 4)
    { x: 90, y: 0 }      // bottom (index 5)
  ];

  $cubeBtn.on('click', function () {
    if ($(window).width() > 779) return;

    const randIdx = Math.floor(Math.random() * 6);
    const target = faceAngles[randIdx];

    $cube.css({
      'animation': 'none',
      'transition': 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)'
    });

    setTimeout(() => {
      $cube.css({
        'transform': `translateY(50px) rotateX(${720 + target.x}deg) rotateY(${720 + target.y}deg)`
      });
    }, 50);

    const $targetLi = $cubeItems.eq(randIdx);

    $modal.find('.modal-img-area').html($targetLi.find('.img-wrapper img').clone());
    $modal.find('.m-title').text($targetLi.find('h4').text());
    $modal.find('.m-meta').html($targetLi.find('.meta-tags').html());
    $modal.find('.m-desc').text($targetLi.find('.desc').text());
    $modal.find('.m-details').html($targetLi.find('.details').html());

    setTimeout(() => {
      $modal.addClass('on');
      $('.cont-3 .content').css('visibility', 'hidden');
    }, 2100);
  });

  $modal.find('.modal-close').on('click', function () {
    $modal.removeClass('on');
    $modal.find('.modal-img-area').empty();
    $modal.find('.m-title').empty();
    $modal.find('.m-meta').empty();
    $modal.find('.m-desc').empty();
    $modal.find('.m-details').empty();

    $('.cont-3 .content').css('visibility', 'visible');

    setTimeout(() => {
      $cube.css({
        'transition': 'transform 1s ease',
        'transform': 'translateY(0) rotateX(0deg) rotateY(0deg)',
        'animation': 'roll 25s infinite alternate ease-in-out'
      });
    }, 500);
  });

  // cont-3 스크롤 이벤트
  // $(window).on('scroll', function () {
  //   let scrollPos = $(window).scrollTop();
  //   let windowHeight = $(window).height();
  //   const $cont3 = $('.cont-3');
  //   const $cont3Content = $cont3.find('.content');
  //   const $cont3Items = $cont3Content.find('li');
  //   let cont3Pos = $cont3.offset().top;

  //   $cont3Items.each(function (i) {
  //     $(this).css('transition-delay', (i * 0.1) + 's');
  //   });

  //   if (scrollPos > cont3Pos - windowHeight + 200) {
  //     $cont3Content.addClass('on');
  //   } else {
  //     $cont3Content.removeClass('on');
  //   }
  // });
});