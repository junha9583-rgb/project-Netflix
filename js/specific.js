$(function () {
  const colorThief = new ColorThief();

  // 1. 공통 닫기 함수 (중복 제거)
  function closeActiveContent() {
    $('.active').remove();
    $('[class^="cont-"] .content li').removeClass('placehold');

    document.body.style.setProperty('--bg-theme', '#000');
    document.body.style.setProperty('--bg-image', 'none');
    document.body.classList.remove('active-theme');
  }

  // 2. 리스트 아이템 클릭 이벤트
  $(document).on('click', '[class^="cont-"] .content li:not(.active)', function (e) {
    e.stopPropagation();
    e.preventDefault();

    const $this = $(this);
    const $parentContent = $this.closest('.content');
    const $allItems = $('[class^="cont-"] .content li');
    const $img = $this.find('img')[0];

    if ($img && $img.complete) {
      const rgb = colorThief.getColor($img);
      document.body.style.setProperty('--bg-theme', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      document.body.style.setProperty('--bg-image', `url(${$img.src})`);
      document.body.classList.add('active-theme');
    }

    $('.active').remove();
    $allItems.removeClass('placehold');
    $this.addClass('placehold');

    const $placeholder = $this.clone()
      .addClass('active')
      .removeClass('placehold');

    requestAnimationFrame(() => {
      $parentContent.append($placeholder);
    });
  });

  // 3. 바탕(body) 클릭 시 닫기
  $(document).on('click', function (e) {
    if (!$(e.target).closest('li').length && $('.active').length > 0) {
      closeActiveContent();
    }
  });

  // 4. 활성화된 카드(.active) 클릭 시 닫기
  $(document).on('click', '.active', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeActiveContent();
  });

  // 5. 스크롤 이벤트
  $(window).on('scroll', function () {
    let scrollPos = $(window).scrollTop();
    let windowHeight = $(window).height();

    $('[class^="cont-"]').each(function () {
      let $section = $(this);
      let $content = $section.find('.content');
      let $items = $content.find('li');
      let sectionPos = $section.offset().top;

      $items.each(function (i) {
        $(this).css('transition-delay', (i * 0.1) + 's');
      });

      if (scrollPos > sectionPos - windowHeight + 200) {
        $content.addClass('on');
      } else {
        $content.removeClass('on');
      }
    });
  });

  $(window).trigger('scroll');

  // 6. aside 메뉴
  let $aside = $('#aside'),
    $btn = $aside.find('.menu-btn');

  $btn.on('click', function (e) {
    e.stopPropagation();
    $btn.toggleClass('active');
    $aside.toggleClass('active');
  });

  $('body').on('click', function (e) {
    if (!$(e.target).hasClass('area')) {
      $aside.removeClass('active');
      $btn.removeClass('active');
    };
  });
});