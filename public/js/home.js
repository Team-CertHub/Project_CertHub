document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  renderSearchBar("searchbar-1");
  renderTrendTags("trend-tags");
  renderCalendar("calendar-1");
  renderCertList("certlist-trending", "지금 뜨는 자격증", DATA.certsTrending);
  renderCommunityPanel("community-latest-1");
  renderFields("fields-browse");
  setupCertDetailCardClicks(); // 이 줄을 추가합니다.
});