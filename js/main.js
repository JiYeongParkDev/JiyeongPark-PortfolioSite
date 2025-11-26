// js/main.js

document.addEventListener('DOMContentLoaded', function () {
  var HEADER_OFFSET = 140; // 헤더 높이 + 여유 (필요하면 숫자만 조절)

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = [
    { id: 'home', el: document.getElementById('home'), start: 0 },
    { id: 'about', el: document.getElementById('about'), start: 0 },
    { id: 'project', el: document.getElementById('project'), start: 0 }
  ];

  // 섹션 시작 위치 미리 계산
  function updateSectionStarts() {
    sections.forEach(function (sec) {
      var rect = sec.el.getBoundingClientRect();
      sec.start = rect.top + window.scrollY; // 문서 전체 기준 y좌표
    });

    // 시작 위치를 기준으로 정렬 (home < about < project 순서 보장)
    sections.sort(function (a, b) {
      return a.start - b.start;
    });
  }

  // 현재 섹션에 맞게 nav 색상 바꾸기
  function setActiveByScroll() {
    var current = window.scrollY + HEADER_OFFSET; // 헤더 아래 기준선 위치
    var currentId = sections[0].id; // 기본값: 첫 섹션

    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var next = sections[i + 1];

      // [sec.start, next.start) 구간이면 sec가 현재 섹션
      if (!next || (current >= sec.start && current < next.start)) {
        currentId = sec.id;
        break;
      }
    }

    navLinks.forEach(function (link) {
      var targetId = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', targetId === currentId);
    });
  }

  // 네비 클릭 시 부드러운 스크롤 + 즉시 active 처리
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var id = link.getAttribute('href').replace('#', '');
      var sec = sections.find(function (s) { return s.id === id; });
      if (!sec) return;

      // 클릭 시 바로 active 교체
      navLinks.forEach(function (l) {
        var tid = l.getAttribute('href').replace('#', '');
        l.classList.toggle('active', tid === id);
      });

      var y = sec.el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // 초기 설정
  updateSectionStarts();
  setActiveByScroll();

  window.addEventListener('scroll', setActiveByScroll, { passive: true });
  window.addEventListener('resize', function () {
    updateSectionStarts();
    setActiveByScroll();
  });


  // =========================
  // 프로젝트 모달 열기 / 닫기
  // =========================

  // 1) 아이콘(트리거) 찾기
  const triggers = document.querySelectorAll('.project-trigger');

  // 2) 각 아이콘에 클릭 이벤트 달기
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const targetId = trigger.getAttribute('data-target'); // 예: "modal-pomodo"
      const modal = document.getElementById(targetId);
      if (!modal) return;

      // 모달 열기
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden'; // 배경 스크롤 막기

      const scrollBody = modal.querySelector('.modal-scroll-body');
      if (scrollBody) {
        scrollBody.scrollTop = 0;
      }

      initModalScrollSpy(modal);
    });
  });

  // 3) 닫기 버튼 & 배경 클릭 시 모달 닫기
  document.addEventListener('click', function (e) {
    // X 버튼 눌렀는지
    const closeBtn = e.target.closest('.project-modal-close');
    // 회색 배경 눌렀는지
    const backdrop = e.target.closest('.project-modal-backdrop');

    if (!closeBtn && !backdrop) return; // 둘 다 아니면 무시

    // 지금 열린 모달 찾기
    const openModal = document.querySelector('.project-modal.is-open');
    if (!openModal) return;

    openModal.classList.remove('is-open');
    document.body.style.overflow = ''; // 스크롤 원복
  });


});


// ===========================
// 모달 내부 인덱스 스크롤 이동
// ===========================

// ===========================
// 모달 내부 인덱스 스크롤 이동 (수정 버전)
// ===========================

// ===========================
// 모달 내부 인덱스 스크롤 이동 (단순 버전)
// ===========================

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.index-btn');
  if (!btn) return;

  const selector = btn.getAttribute('data-target');
  const target = document.querySelector(selector);
  if (!target) return;

  // active 스타일 변경
  document.querySelectorAll('.index-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');



  // 모달 카드 & 스크롤 박스
  const modalCard = btn.closest('.modal-inner-card');
  if (!modalCard) return;

  const scrollBox = modalCard.querySelector('.modal-scroll-body');
  if (!scrollBox) return;

  // ★ 클릭으로 이동하는 동안 scroll spy 잠깐 꺼두기
  scrollBox.dataset.manualScroll = "true";


  // 🔹 프로젝트 개요는 그냥 맨 위로 보내기
  if (selector === '#section-overview' || selector === '#toilet-overview' || selector === '#booklog-overview') {
    scrollBox.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // ★ 스크롤 애니메이션 끝났다고 보고 다시 켜기
    setTimeout(() => { scrollBox.dataset.manualScroll = ""; }, 300);

    return;
  }

  // scrollBox 기준으로 target의 상대 위치 계산
  const scrollBoxTop = scrollBox.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;

  // 여백(조금 띄우고 싶으면 양수/음수 조절)
  const EXTRA_MARGIN = 3;  // 여기 숫자만 조절하면 됨

  const offset = scrollBox.scrollTop + (targetTop - scrollBoxTop) - EXTRA_MARGIN;

  scrollBox.scrollTo({
    top: offset,
    behavior: 'smooth'
  });
  // ★ 일반 섹션도 마찬가지로 300ms 뒤에 다시 켜기
  setTimeout(() => { scrollBox.dataset.manualScroll = ""; }, 300);
});

// ===========================
// 프로젝트 모달 내부 scroll spy (스크롤 시 인덱스 자동 활성화)
// ===========================
// ===========================
// 프로젝트 모달 내부 scroll spy (스크롤 시 인덱스 자동 활성화 - 수정 버전)
// ===========================
function initModalScrollSpy(modal) {
  const scrollBox = modal.querySelector('.modal-scroll-body');
  const buttons = modal.querySelectorAll('.index-btn');

  if (!scrollBox || !buttons.length) return;

  // 이미 한 번 설정했다면 또 안 달기
  if (scrollBox.dataset.scrollSpy === 'on') return;
  scrollBox.dataset.scrollSpy = 'on';

  // 버튼 ↔ 섹션 매핑
  const pairs = Array.from(buttons)
    .map(btn => {
      const selector = btn.getAttribute('data-target');   // 예: "#section-role"
      const sec = modal.querySelector(selector);
      return sec ? { btn, sec } : null;
    })
    .filter(Boolean);

  function updateActiveByScroll() {
    // ★ 클릭으로 스크롤 중이면 active 건드리지 않기
    if (scrollBox.dataset.manualScroll === "true") return;

    const boxRect = scrollBox.getBoundingClientRect();

    let bestPair = pairs[0];
    let bestDist = Infinity;

    pairs.forEach(pair => {
      const secRect = pair.sec.getBoundingClientRect();

      // 섹션의 "윗부분"이 scrollBox 안에서 어느 정도 위치에 있는지
      const dist = Math.abs(secRect.top - boxRect.top - 16); // 16px 정도 위 여유

      if (dist < bestDist) {
        bestDist = dist;
        bestPair = pair;
      }
    });

    // active 교체
    buttons.forEach(b => b.classList.remove('active'));
    if (bestPair) {
      bestPair.btn.classList.add('active');
    }
  }

  // 스크롤할 때마다 업데이트
  scrollBox.addEventListener('scroll', updateActiveByScroll, { passive: true });

  // 처음 열렸을 때도 한 번 맞춰주기
  updateActiveByScroll();
}
