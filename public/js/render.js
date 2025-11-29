// js/render.js

// ⭐ detail.js에서 상세정보 가져오기 함수 가져옴
import { loadDetailInfo } from "./detail.js";

// 자격증 목록 렌더링 + 자세히 버튼 포함
export function renderListItem(item, container) {
    const jmfldnm = item.getElementsByTagName('jmfldnm')[0]?.textContent || '없음';
    const qualgbnm = item.getElementsByTagName('qualgbnm')[0]?.textContent || '없음';
    const seriesnm = item.getElementsByTagName('seriesnm')[0]?.textContent || '없음';
    const obligfldnm = item.getElementsByTagName('obligfldnm')[0]?.textContent || '없음';
    const mdobligfldnm = item.getElementsByTagName('mdobligfldnm')[0]?.textContent || '없음';
    const jmcd = item.getElementsByTagName('jmcd')[0]?.textContent || ''; // ⭐ 상세조회 API에 필요

    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <div style="font-size:18px; font-weight:600;">${jmfldnm}</div>
                <div style="margin-top:4px; color:#555;">
                    <span>#${qualgbnm}</span>
                    <span>#${seriesnm}</span>
                    <span>#${obligfldnm}/${mdobligfldnm}</span>
                </div>
            </div>
            <button class="detail-btn" data-jmcd="${jmcd}" 
                style="padding:6px 12px; border-radius:6px; cursor:pointer;">
                자세히
            </button>
        </div>
        <hr>
    `;

    container.appendChild(div);
    div.querySelector(".detail-btn").addEventListener("click", () => loadDetailInfo(jmcd));


    // ⭐ 버튼 이벤트 등록 → 모달 열림
    const btn = div.querySelector(".detail-btn");
    btn.addEventListener("click", () => loadDetailInfo(jmcd));
}


// 📅 시험 일정 출력 함수
export function renderScheduleList(items, container) {
    container.innerHTML = ""; // 기존 내용 삭제

    if (!items.length) {
        container.innerHTML += "<p>등록된 시험 일정이 없습니다.</p>";
        return;
    }

    items.forEach(item => {
        const implYy = item.getElementsByTagName("implYy")[0]?.textContent || "";
        const implSeq = item.getElementsByTagName("implSeq")[0]?.textContent || "";
        const description = item.getElementsByTagName("description")[0]?.textContent || "설명 없음";

        const docRegStartDt = item.getElementsByTagName("docRegStartDt")[0]?.textContent || "-";
        const docRegEndDt = item.getElementsByTagName("docRegEndDt")[0]?.textContent || "-";
        const docExamStartDt = item.getElementsByTagName("docExamStartDt")[0]?.textContent || "-";
        const docExamEndDt = item.getElementsByTagName("docExamEndDt")[0]?.textContent || "-";
        const docPassDt = item.getElementsByTagName("docPassDt")[0]?.textContent || "-";

        const div = document.createElement("div");
        div.className = "schedule-card";
        div.style = `
            border:1px solid #eee; 
            padding:12px; 
            border-radius:8px; 
            margin-bottom:10px;
        `;

        div.innerHTML = `
            <h3 style="font-size:18px; margin-bottom:6px;">${description}</h3>
            <p>📌 회차: ${implYy}년 ${implSeq}회</p>
            <p>📝 원서접수: ${docRegStartDt} ~ ${docRegEndDt}</p>
            <p>✏️ 필기시험: ${docExamStartDt} ~ ${docExamEndDt}</p>
            <p>📢 발표일: ${docPassDt}</p>
        `;

        container.appendChild(div);
    });
}
