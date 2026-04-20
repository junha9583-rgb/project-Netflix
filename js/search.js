$(function () {
  let $aside = $('#aside'),
    $menuBtn = $aside.find('.menu-btn'),
    $tagBtn = $('.tag-wrap ul li'),
    $slideBtn = $('.slide-btn'),
    sp = 1000,
    easing = ['easeOutExpo', 'easeOutBounce', 'linear'];

  // 사이드 메뉴 관련 이벤트
  $menuBtn.on('click', function (e) {
    e.stopPropagation();
    $menuBtn.toggleClass('active');
    $aside.toggleClass('active');
  });

  $('body').on('click', function (e) {
    if (!$(e.target).hasClass('area')) {
      $aside.removeClass('active');
      $menuBtn.removeClass('active');
    }
  });

  // 탭 메뉴
  $('.tab-btn').on('click', function () {
    const target = $(this).attr('data-tab');

    // 버튼 활성화 상태 변경
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');

    // 컨텐츠 전환
    $('.tab-pane').removeClass('active');
    $('#' + target).addClass('active');
  });

  // 마우스 이벤트
  $(document).on('mouseenter', '.tag-list li a', function () {
    $(this).parent().siblings().css('filter', 'blur(2px)');
  });

  $(document).on('mouseleave', '.tag-list li a', function () {
    $(this).parent().siblings().css('filter', 'none');
  });

  // 터치 이동 방지 함수
  function preventDefault(e) {
    if ($('body').hasClass('stop-scroll')) {
      if (!$(e.target).closest('.cont-1').length) {
        e.preventDefault();
      }
    }
  }

  window.addEventListener('touchmove', preventDefault, { passive: false });

  $slideBtn.on('click', function () {
    $('.cont-1').toggleClass('on');
    const video = $('.video-wrap video')[0];

    if ($('.cont-1').hasClass('on')) {
      video.pause();
      $(this).parents('.cont-1').find('.close-btn').addClass('is-closed');
      $('body').removeClass('stop-scroll');
    } else {
      video.play();
      $(this).parents('.cont-1').find('.close-btn').removeClass('is-closed');
      $('body').addClass('stop-scroll');
    }
  });

  // 초기 로드 시 설정
  if (!$('.cont-1').hasClass('on')) {
    $('body').addClass('stop-scroll');
  }

  // X 버튼 클릭 이벤트
  $('.close-btn').on('click', function () {
    $('.cont-1').addClass('off');
  });

  // 콘텐츠 데이터 (포트폴리오용 샘플)
  const contentData = {
    "아무 생각 없이 웃고 싶은": [
      { title: "그레이맨", img: "image/theme(1).jpg", link: "#" },
      { title: "조용한 희망", img: "image/theme(2).jpg", link: "#" },
      { title: "지옥", img: "image/theme(3).jpg", link: "#" },
      { title: "라디오액티브 이머전시", img: "image/theme(4).jpg", link: "#" },
      { title: "푸른 눈의 사무라이", img: "image/theme(5).jpg", link: "#" },
      { title: "서부 전선 이상 없다.", img: "image/theme(6).jpg", link: "#" },
      { title: "사라진 탄환 3", img: "image/theme(7).jpg", link: "#" },
      { title: "쿵푸팬더 용의 기사", img: "image/theme(8).jpg", link: "#" },
      { title: "기묘한 이야기", img: "image/theme(9).jpg", link: "#" },
      { title: "걸복순", img: "image/theme(10).jpg", link: "#" }
    ]
  };

  $(function () {
    $('.tag-list li a').on('click', function (e) {
      e.preventDefault();
      const genreName = $(this).text();

      if (contentData[genreName]) {
        showModal(genreName, contentData[genreName]);
      } else {
        alert('준비 중인 장르입니다.');
      }
    });

    // 2. 모달 띄우기 함수
    function showModal(title, data) {
      const $modal = $('#result-modal');
      const $list = $('.poster-list');

      $('.category-title').text(title);

      $list.empty();
      data.forEach(item => {
        const listItem = `
        <li>
          <a href="${item.link}">
            <img src="${item.img}" alt="${item.title}">
            <h3>${item.title}</h3>
          </a>
        </li>`;
        $list.append(listItem);
      });

      $modal.fadeIn();
    }

    // 3. 닫기 버튼
    $('.modal-close').on('click', function () {
      $('#result-modal').stop().fadeOut();
    });
  });
});