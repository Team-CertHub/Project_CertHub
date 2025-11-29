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

export async function loadDetailInfo(jmcd) {
    const modal = document.getElementById("detailModal");
    const modalBody = document.getElementById("modalBody");

    modal.style.display = "flex";
    modalBody.innerHTML = "불러오는 중...";

    const response = await fetch(`/api/cert/detail?jmcd=${jmcd}`);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = Array.from(xmlDoc.getElementsByTagName("item"));
    if (items.length === 0) {
        modalBody.innerHTML = "<p>상세정보 없음</p>";
        return;
    }

    // 오직 취득방법만 저장
    let acquireInfo = "";

    items.forEach(item => {
        const type = item.getElementsByTagName("infogb")[0]?.textContent.trim();
        const content = item.getElementsByTagName("contents")[0]?.textContent.trim();
        if (!type || !content) return;

        if (type === "취득방법") {
            acquireInfo = cleanQnetContent(content);
        }
    });

    modalBody.innerHTML = `
        <h2>📘 자격 상세정보</h2>

        <h3>📘 취득방법</h3>
        ${acquireInfo || "<p>정보 없음</p>"}
    `;
}

export function closeModal() {
    document.getElementById("detailModal").style.display = "none";
}
