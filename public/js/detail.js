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
        // ---------------------------------------------
        // 1) 상세조회 API 요청
        // ---------------------------------------------
        const detailResponse = await fetch(`/api/cert/detail?jmcd=${jmcd}`);
        const detailXmlText = await detailResponse.text();
        console.log("자격증 상세 정보 응답:", detailXmlText);

        const detailXml = new DOMParser().parseFromString(detailXmlText, "text/xml");
        const detailItems = Array.from(detailXml.getElementsByTagName("item"));

        // 취득방법 추출
        let acquireInfo = "";
        if (detailItems.length > 0) {
            detailItems.forEach(item => {
                const type = item.getElementsByTagName("infogb")[0]?.textContent.trim();
                const content = item.getElementsByTagName("contents")[0]?.textContent.trim();
                
                if (type === "취득방법" && content) {
                    acquireInfo = cleanQnetContent(content);
                }
            });
        }

        // ---------------------------------------------
        // 2) 추천 자격증 API 요청
        // ---------------------------------------------
        const relatedResponse = await fetch(`/api/attendqual?jmcd=${jmcd}`);
        const relatedXmlText = await relatedResponse.text();
        console.log("추천 자격증 응답:", relatedXmlText);

        const relatedXml = new DOMParser().parseFromString(relatedXmlText, "text/xml");
        const relatedItems = Array.from(relatedXml.getElementsByTagName("item"));

        let recomJmNm1 = "추천자격명 없음";
        let recomJmNm2 = "추천자격명 없음";

        if (relatedItems.length > 0) {
            const first = relatedItems[0];
            recomJmNm1 = first.getElementsByTagName("recomJmNm1")[0]?.textContent || "추천자격명 없음";
            recomJmNm2 = first.getElementsByTagName("recomJmNm2")[0]?.textContent || "추천자격명 없음";
        }

        // ---------------------------------------------
        // 3) 두 API 결과가 모두 준비된 후 한 번만 렌더링
        // ---------------------------------------------
        modalBody.innerHTML = `
            <h2>📘 자격 상세정보</h2>

            <h3>📘 취득방법</h3>
            ${acquireInfo || "<p>취득방법 정보가 없습니다.</p>"}

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
