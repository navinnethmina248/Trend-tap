// SAMPLE DATA for demonstration only. In the real product this comes from
// official APIs (X, Google Trends, Meta) and agency submissions.
// Each trend has a 24-point engagement series (one point every 2 hours = 48 hours).
(function () {
  var N = 24;

  function makeSeries(status, g, base) {
    var out = [];
    for (var i = 0; i < N; i++) {
      var m;
      if (status === "Rising") {
        m = g * Math.pow(i / (N - 1), 2);
      } else if (status === "Peaking") {
        m = g / (1 + Math.exp(-(i - 13) / 2.2));
      } else {
        var peak = 12;
        m = i <= peak ? g * (i / peak) : g * (1 - (0.8 * (i - peak)) / (N - 1 - peak));
      }
      out.push(Math.round(base * (1 + m) * 10) / 10);
    }
    return out;
  }

  var raw = [
    { title: "Sinhala remix dance audio", type: "Audio", source: "Agency submitted", category: "Music", language: "Sinhala", status: "Rising", g: 4.0, volume: 38, daysToPeak: 3, audience: "18 to 25 year-olds in Colombo" },
    { title: "Tamil comedy dub audio", type: "Audio", source: "Agency submitted", category: "Entertainment", language: "Tamil", status: "Rising", g: 3.4, volume: 29, daysToPeak: 3, audience: "18 to 24 year-olds in Jaffna and Colombo" },
    { title: "Street food taste-test format", type: "Video format", source: "Meta public engagement", category: "Food", language: "English", status: "Rising", g: 2.8, volume: 54, daysToPeak: 4, audience: "20 to 30 year-olds in Colombo" },
    { title: "#WeekendKottu", type: "Hashtag", source: "X Sri Lanka", category: "Food", language: "Sinhala", status: "Rising", g: 2.1, volume: 61, daysToPeak: 5, audience: "18 to 34 year-olds island-wide" },
    { title: "Budget travel tips", type: "Search topic", source: "Google Trends (Sri Lanka)", category: "Travel", language: "English", status: "Rising", g: 1.9, volume: 47, daysToPeak: 6, audience: "22 to 34 year-olds in Colombo and Kandy" },
    { title: "Rainy-day playlist challenge", type: "Challenge", source: "X Sri Lanka", category: "Music", language: "English", status: "Rising", g: 1.5, volume: 33, daysToPeak: 5, audience: "18 to 24 year-olds in Colombo" },
    { title: "POV: the cricket commute meme", type: "Meme format", source: "Meta public engagement", category: "Sports", language: "English", status: "Peaking", g: 3.2, volume: 76, daysToPeak: 1, audience: "18 to 30 year-olds island-wide" },
    { title: "Back-to-school haul", type: "Topic", source: "Meta public engagement", category: "Fashion", language: "English", status: "Peaking", g: 2.4, volume: 72, daysToPeak: 1, audience: "25 to 40 year-old parents in Colombo" },
    { title: "Phone-cover unboxing", type: "Video format", source: "Meta public engagement", category: "Tech", language: "English", status: "Peaked", g: 6.0, volume: 88, daysToPeak: 0, audience: "18 to 28 year-olds in Colombo" },
    { title: "#CricketFever", type: "Hashtag", source: "X Sri Lanka", category: "Sports", language: "Sinhala", status: "Peaked", g: 5.0, volume: 95, daysToPeak: 0, audience: "18 to 34 year-olds island-wide" }
  ];

  function pct(a, b) { return Math.round((a / b - 1) * 100); }

  window.TRENDS = raw.map(function (t, i) {
    var s = makeSeries(t.status, t.g, 20 + i * 3);
    t.id = i + 1;
    t.series = s;
    t.growth48 = pct(s[N - 1], s[0]);        // growth over the whole 48 hours
    t.velocity12 = pct(s[N - 1], s[N - 7]);  // growth over the last 12 hours (used for ranking)
    return t;
  });
})();
