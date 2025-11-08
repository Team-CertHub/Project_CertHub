document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  renderTodo("todo-week");
  renderPaths("paths-reco");
  renderCertList("certlist-reco", "관심 기반 추천", DATA.certsReco);
  // mypage.js — replace the community render line
  const interestKeywords = (DATA.userKeywords || []).length ? DATA.userKeywords : ["it", "데이터", "회계"];
  renderCommunityByKeywords("community-latest-2", interestKeywords, "관심 키워드 커뮤니티");
  renderCalendar("calendar-2");
  renderBookmarks("bookmark-2");
});