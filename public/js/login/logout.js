// public/js/mypage/logout.js
import { auth } from "../firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logout-test");

  if (!logoutLink) return;

  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault(); // a태그 기본 이동 막기

    try {
      await signOut(auth);              // ✅ 실제 로그아웃
      alert("로그아웃 되었습니다.");
      window.location.href = "/index.html"; // 로그아웃 후 이동할 페이지
    } catch (err) {
      console.error("로그아웃 에러:", err);
      alert("로그아웃 실패: " + err.message);
    }
  });
});
