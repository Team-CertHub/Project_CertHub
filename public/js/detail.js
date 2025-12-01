// HTML 엔티티(&lt; &gt;) 제거용 함수
function decodeHtmlEntities(str) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
}

// QNet 콘텐츠 정리 함수
function cleanQnetContent(text) {
    if (!text) return "";

    text = decodeHtmlEntities(text);

    // CSS 제거
    text = text.replace(/BODY\s*\{[^}]*\}/gi, "");
    text = text.replace(/P\s*\{[^}]*\}/gi, "");
    text = text.replace(/LI\s*\{[^}]*\}/gi, "");

    text = text.trim();

    // 줄바꿈 유도
    text = text
        .replace(/□/g, "\n□ ")
        .replace(/○|●/g, "\n- ")
        .replace(/o\s/g, "\n- ")
        .replace(/※/g, "\n※ ")
        .replace(/[0-9]+\.\s/g, match => "\n" + match);

    const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

    let html = "";
    let ulOpen = false;

    lines.forEach(line => {
        if (line.startsWith("- ")) {
            if (!ulOpen) {
                html += "<ul>";
                ulOpen = true;
            }
            html += `<li>${line.substring(2)}</li>`;
        } else {
            if (ulOpen) {
                html += "</ul>";
                ulOpen = false;
            }
            html += `<p>${line}</p>`;
        }
    });

    if (ulOpen) html += "</ul>";

    return html;
}

// 모달 닫기 함수
export function closeModal() {
    document.getElementById("detailModal").style.display = "none";
}

export async function loadDetailInfo(jmcd) {
    const modal = document.getElementById("detailModal");
    const modalBody = document.getElementById("modalBody");

    modal.style.display = "flex";
    modalBody.innerHTML = "불러오는 중...";

    try {
        // 자격증 상세 정보를 가져오기 위한 API 호출
        const response = await fetch(`/api/cert/detail?jmcd=${jmcd}`);
        const xmlText = await response.text();

        // API 응답 확인 - 자격증 상세 정보 응답 출력
        console.log("자격증 상세 정보 응답:", xmlText);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const items = Array.from(xmlDoc.getElementsByTagName("item"));
        if (items.length === 0) {
            modalBody.innerHTML = "<p>상세정보 없음</p>";
            return;
        }

        // 취득방법만 처리
        let acquireInfo = "";
        items.forEach(item => {
            const type = item.getElementsByTagName("infogb")[0]?.textContent.trim();
            const content = item.getElementsByTagName("contents")[0]?.textContent.trim();
            if (!type || !content) return;

            if (type === "취득방법") {
                acquireInfo = cleanQnetContent(content); // cleanQnetContent: 이전에 제공한 HTML 정리 함수
            }
        });

        // 관련 자격증 정보 가져오기 (추천 자격증 2개)
        const relatedCertResponse = await fetch(`/api/attendqual?jmcd=${jmcd}`);
        const relatedCertXmlText = await relatedCertResponse.text();

        // API 응답 확인 - 추천 자격증 응답 출력
        console.log("추천 자격증 응답:", relatedCertXmlText);

        const relatedCertXmlDoc = new DOMParser().parseFromString(relatedCertXmlText, "text/xml");

        const relatedCertItems = Array.from(relatedCertXmlDoc.getElementsByTagName("item"));
        console.log("추천 자격증 목록:", relatedCertItems);  // 추천 자격증 리스트 확인

        // 추천 자격증 2개 추출
        const recomJmNm1 = relatedCertItems.length > 0 ? relatedCertItems[0].getElementsByTagName("recomJmNm1")[0]?.textContent || "추천자격명 없음" : "추천자격명 없음";
        const recomJmNm2 = relatedCertItems.length > 1 ? relatedCertItems[1].getElementsByTagName("recomJmNm2")[0]?.textContent || "추천자격명 없음" : "추천자격명 없음";

        // 모달 내용 업데이트
        modalBody.innerHTML = `
            <h2>📘 자격 상세정보</h2>
            <h3>📘 취득방법</h3>
            ${acquireInfo || "<p>정보 없음</p>"}

            <h3>📘 추천 자격증</h3>
            <ul>
                <li>${recomJmNm1}</li>
                <li>${recomJmNm2}</li>
            </ul>
        `;
    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
        modalBody.innerHTML = "<p>정보를 불러오는 데 오류가 발생했습니다.</p>";
    }
}
