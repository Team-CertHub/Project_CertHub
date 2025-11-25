// functions/index.js
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // node-fetch@2

const app = express();

// CORS 허용 (브라우저에서 호출할 거라서)
app.use(cors());

// 자격증 조회 프록시 API
app.get("/api/cert", async (req, res) => {
  const certName = req.query.name || "";
  const serviceKey =
    "d969c53a49d2b0f858f6a0298c6c52f20a398a12a952185694f67b019f0aa72e";

  // Q-Net 공공데이터 API 원본 URL
  const baseUrl =
    "http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList";

  const query =
    `?serviceKey=${serviceKey}` +
    `&jmNm=${encodeURIComponent(certName)}` +
    `&pageNo=1&numOfRows=100`;

  const url = baseUrl + query;

  try {
    const response = await fetch(url);
    const xmlText = await response.text();

    // 브라우저에 XML 그대로 전달
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xmlText);
  } catch (error) {
    console.error("Q-Net 호출 중 오류:", error);
    res.status(500).send("서버 오류: " + error.message);
  }
});

// ✅ 이 한 줄이 app.listen 대신 하는 역할
exports.api = functions.https.onRequest(app);
