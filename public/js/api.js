// js/api.js

// 자격 목록
export async function fetchCertificates(keyword = "") {
    const response = await fetch(`/api/cert?name=${encodeURIComponent(keyword)}`);

    const xmlText = await response.text();

    const parser = new DOMParser();
    return parser.parseFromString(xmlText, "text/xml");
}

export function getItemsFromXML(xmlDoc) {
    return Array.from(xmlDoc.getElementsByTagName("item"));
}

// 시험 일정 
export async function fetchSchedule(jmCd = "", year = "") {
    let url = `/api/schedule?jmcd=${encodeURIComponent(jmCd)}`;
    if (year) url += `&year=${encodeURIComponent(year)}`;

    const res = await fetch(url);
    const xmlText = await res.text();

    const parser = new DOMParser();
    return parser.parseFromString(xmlText, "text/xml");
}
