// js/app_auth_state.js
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const loginLink = document.getElementById("header-login-link");
  const mypageLink = document.getElementById("header-mypage-link");

  if (user) {
    console.log("로그인 상태:", user.uid);
    window.currentUser = user;
    window.currentUid = user.uid;
    document.body.classList.add("logged-in");

    // 🔹 헤더 버튼: 로그인 → 숨기고 마이페이지 → 보이기
    if (loginLink) loginLink.style.display = "none";
    if (mypageLink) mypageLink.style.display = "inline-flex"; // 필요하면 block으로

  } else {
    console.log("로그아웃 상태");
    window.currentUser = null;
    window.currentUid = null;
    document.body.classList.remove("logged-in");

    // 🔹 로그아웃 상태 → 로그인 링크 보이고, 마이페이지 링크 숨기기
    if (loginLink) loginLink.style.display = "inline-flex";
    if (mypageLink) mypageLink.style.display = "none";

    // 마이페이지라면 로그인 페이지로 보내기
    if (location.pathname.includes("mypage")) {
      window.location.href = "/login.html";
    }
  }
});

// 버튼 클릭 이동 처리는 따로 공통으로 넣어도 됨
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("header-login-btn");
  const mypageBtn = document.getElementById("header-mypage-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login.html";
    });
  }

  if (mypageBtn) {
    mypageBtn.addEventListener("click", () => {
      window.location.href = "/mypage.html";
    });
  }
});
