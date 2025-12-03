// js/modal.js
// 모든 페이지에서 공통으로 사용할 모달 유틸

(function () {
  // ESC 키 이벤트 핸들러를 추적하기 위한 변수
  let escHandler = null;

  function closeModal() {
    const backdrop = document.querySelector(".modal-backdrop");
    const modal = document.querySelector(".modal");

    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }

    // body 스크롤 복구
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("--scrollbar-width");

    // ESC 이벤트 제거
    if (escHandler) {
      document.removeEventListener("keydown", escHandler);
      escHandler = null;
    }
  }

  // 전역에서 사용할 showModal
  window.showModal = function (title, content) {
    // 혹시 기존 모달이 떠 있으면 먼저 제거
    closeModal();

    // 스크롤바 너비 계산 및 배경 스크롤 막기
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty("--scrollbar-width", scrollbarWidth + "px");
    document.body.classList.add("modal-open");

    // 배경
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.addEventListener("click", closeModal);

    // 모달 컨테이너
    const modal = document.createElement("div");
    modal.className = "modal";

    // 헤더
    const header = document.createElement("div");
    header.className = "modal-header";

    const h3 = document.createElement("h3");
    h3.className = "h3";
    h3.textContent = title;
    header.appendChild(h3);

    // 본문
    const body = document.createElement("div");
    body.className = "modal-body";
    if (typeof content === "string") {
      const p = document.createElement("p");
      p.textContent = content;
      body.appendChild(p);
    } else {
      body.appendChild(content);
    }

    // 푸터
    const footer = document.createElement("div");
    footer.className = "modal-footer";

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn";
    confirmBtn.textContent = "확인";
    confirmBtn.addEventListener("click", closeModal);

    footer.appendChild(confirmBtn);

    // 모달 조립
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);

    // DOM에 추가
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // ESC 키로 닫기
    escHandler = function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", escHandler);
  };
})();
