const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const SERVICE_KEY = "6392230c571116074d2e799a1309a9e8ac656fc32deebd7be9f12b12328518fd";
const ENC_KEY = encodeURIComponent(SERVICE_KEY);

// ===========================================================
// ① 자격증 목록 API
// ===========================================================
app.get("/api/cert", async (req, res) => {
  const keyword = req.query.name || "";

  const url =
    `http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList` +
    `?serviceKey=${ENC_KEY}` +
    `&jmNm=${encodeURIComponent(keyword)}` +
    `&pageNo=1&numOfRows=200`;

  try {
    const response = await fetch(url);
    const xml = await response.text();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err) {
    console.error("목록 API 오류:", err);
    res.status(500).send("서버 오류: " + err.message);
  }
});

// ===========================================================
// ② 자격 상세 API
// ===========================================================
app.get("/api/cert/detail", async (req, res) => {
  const jmCd = req.query.jmcd;
  if (!jmCd) return res.status(400).send("jmcd is required.");

  const url =
    `http://openapi.q-net.or.kr/api/service/rest/InquiryInformationTradeNTQSVC/getList` +
    `?serviceKey=${ENC_KEY}` +
    `&jmCd=${encodeURIComponent(jmCd)}`;

  try {
    const response = await fetch(url);
    const xml = await response.text();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err) {
    console.error("상세 API 오류:", err);
    res.status(500).send("서버 오류: " + err.message);
  }
});

// ===========================================================
// ③ 시험 일정 API
// ===========================================================
app.get("/api/schedule", async (req, res) => {
  const jmCd = req.query.jmcd;
  const year = req.query.year;

  if (!jmCd) return res.status(400).send("jmcd is required.");

  const url =
    `http://apis.data.go.kr/B490007/qualExamSchd/getQualExamSchdList` +
    `?serviceKey=${ENC_KEY}` +
    `&dataFormat=xml` +
    `&jmCd=${encodeURIComponent(jmCd)}` +
    (year ? `&implYy=${encodeURIComponent(year)}` : "");

  try {
    const response = await fetch(url);
    const xml = await response.text();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err) {
    console.error("시험 일정 API 오류:", err);
    res.status(500).send("서버 오류: " + err.message);
  }
});

exports.api = functions.https.onRequest(app);
