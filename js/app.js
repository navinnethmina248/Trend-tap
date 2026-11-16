(function () {
  var trends = window.TRENDS;
  var state = { sort: "velocity", category: "All", language: "All", status: "All", threshold: 150 };

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(n) { return Number(n).toLocaleString("en-US"); }

  // ---------- sparkline ----------
  function spark(series, color, w, h) {
    var min = Math.min.apply(null, series), max = Math.max.apply(null, series);
    var pts = series.map(function (v, i) {
      var x = (i / (series.length - 1)) * (w - 4) + 2;
      var y = h - 2 - ((v - min) / (max - min || 1)) * (h - 4);
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Engagement over the last 48 hours">' +
      '<polyline fill="none" stroke="' + color + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" points="' + pts + '"/></svg>';
  }
  function colorFor(status) {
    return status === "Rising" ? "#3fa0bf" : status === "Peaking" ? "#ebb04b" : "#e0503c";
  }

  // ---------- helpers ----------
  function isAlert(t) { return t.status !== "Peaked" && t.growth48 >= state.threshold; }
  function peakText(t) {
    if (t.status === "Rising") return "About " + t.daysToPeak + " days before peak";
    if (t.status === "Peaking") return "Peaks within about a day";
    return "Already peaked: too late to ride";
  }
  function alertText(t) {
    return "<b>" + esc(t.title) + "</b> is up " + fmt(t.growth48) + "% in engagement over the last 48 hours among " +
      esc(t.audience) + (t.status === "Rising" ? " (about " + t.daysToPeak + " days before peak)." : " (peaking within about a day).");
  }

  // ---------- dashboard ----------
  function filtered() {
    return trends.filter(function (t) {
      return (state.category === "All" || t.category === state.category) &&
             (state.language === "All" || t.language === state.language) &&
             (state.status === "All" || t.status === state.status);
    }).sort(function (a, b) {
      return state.sort === "velocity" ? b.velocity12 - a.velocity12 : b.volume - a.volume;
    });
  }

  function renderDashboard() {
    var list = filtered();
    $("statTotal").textContent = trends.length;
    $("statRising").textContent = trends.filter(function (t) { return t.status === "Rising"; }).length;
    $("statAlerts").textContent = trends.filter(isAlert).length;
    $("statUpdated").textContent = "Updated " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    $("thresholdLabel").textContent = state.threshold;
    $("sortHint").textContent = state.sort === "velocity"
      ? "Ranked by velocity: how fast engagement is growing right now. Big, already-peaked trends sink."
      : "Ranked by volume (what most tools do): the biggest topics are the ones whose growth has already slowed. Switch back to velocity to compare.";

    if (!list.length) { $("feed").innerHTML = '<p class="empty">No trends match these filters.</p>'; return; }
    $("feed").innerHTML = list.map(function (t) {
      var cls = t.status.toLowerCase();
      return '<article class="trend ' + cls + '">' +
        "<div><h3>" + esc(t.title) + "</h3>" +
        '<div class="meta"><span class="chip ' + cls + '">' + t.status + "</span>" +
        (isAlert(t) ? '<span class="chip alert">Alert sent</span>' : "") +
        esc(t.type) + " · " + esc(t.category) + " · " + esc(t.language) + " · " + esc(t.source) + "</div>" +
        '<div class="peak">' + peakText(t) + "</div></div>" +
        '<div class="growth"><span class="big">' + (t.growth48 >= 0 ? "+" : "") + fmt(t.growth48) + '%</span><span class="small">48-hour growth</span>' +
        '<span class="small">volume (sample): ' + t.volume + "</span></div>" +
        "<div>" + spark(t.series, colorFor(t.status), 120, 44) + "</div></article>";
    }).join("");
  }

  function fillSelect(id, values, key) {
    var el = $(id);
    el.innerHTML = ["All"].concat(values).map(function (v) { return "<option>" + esc(v) + "</option>"; }).join("");
    el.addEventListener("change", function () { state[key] = el.value; renderAll(); });
  }

  // ---------- alerts ----------
  function renderAlerts() {
    var now = new Date();
    var hh = function (m) { var d = new Date(now.getTime() - m * 60000); return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };
    var top = trends.filter(function (t) { return t.status === "Rising"; })
      .sort(function (a, b) { return b.velocity12 - a.velocity12; }).slice(0, 3);
    var html = '<div class="bubble"><b>Good morning. Top rising trends today:</b><br>' +
      top.map(function (t, i) { return (i + 1) + ". " + esc(t.title) + " (+" + fmt(t.growth48) + "%)"; }).join("<br>") +
      "<time>9:00 AM · daily digest</time></div>";
    var alerts = trends.filter(isAlert).sort(function (a, b) { return b.velocity12 - a.velocity12; });
    if (!alerts.length) {
      html += '<div class="bubble">No trends are above your threshold right now. Lower it on the Dashboard to see more alerts.<time>' + hh(0) + "</time></div>";
    } else {
      html += alerts.map(function (t, i) {
        return '<div class="bubble">' + alertText(t) + "<time>" + hh(i * 17 + 3) + " · instant alert</time></div>";
      }).join("");
    }
    $("chat").innerHTML = html;
  }

  // ---------- report ----------
  function renderReport() {
    var agency = $("agencyName").value.trim() || "Your Agency";
    var client = $("clientName").value.trim() || "Client Name";
    var top = trends.filter(function (t) { return t.status !== "Peaked"; })
      .sort(function (a, b) { return b.velocity12 - a.velocity12; }).slice(0, 3);
    $("reportPreview").innerHTML =
      "<h2>" + esc(agency) + ": Trend report for " + esc(client) + "</h2>" +
      '<p class="meta" style="color:#5a6580">' + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + "</p>" +
      top.map(function (t) {
        return '<div class="rline"><div><b>' + esc(t.title) + "</b><small>" + esc(t.category) + " · " + esc(t.language) + " · " + peakText(t) +
          "</small></div><div>" + spark(t.series, "#11213f", 110, 40) + "<br><b>+" + fmt(t.growth48) + "%</b></div></div>";
      }).join("") +
      '<p class="foot">Prepared by ' + esc(agency) + ". Trend data supplied by TrendTap (sample data in this prototype).</p>";
  }

  // ---------- value calculator ----------
  function renderValue() {
    var hours = Math.max(0, parseFloat($("hours").value) || 0);
    var rate = Math.max(0, parseFloat($("rate").value) || 0);
    var plan = parseFloat($("plan").value);
    var monthly = hours * rate * 4;
    var weekly = hours * rate;
    var saving = monthly - plan;
    var weeks = weekly > 0 ? plan / weekly : 0;
    $("valueOut").innerHTML =
      '<div class="stat"><span class="num c-coral">LKR ' + fmt(Math.round(monthly)) + "</span><span>staff time spent scrolling, per manager per month</span></div>" +
      '<div class="stat"><span class="num c-teal">LKR ' + fmt(plan) + "</span><span>TrendTap plan per month</span></div>" +
      '<div class="stat"><span class="num c-amber">' + (saving >= 0 ? "LKR " + fmt(Math.round(saving)) : "–") + "</span><span>" +
      (saving >= 0 ? "net time value recovered each month" : "plan costs more than the time it saves at these numbers") + "</span></div>" +
      '<div class="stat"><span class="num small">' + (weekly > 0 ? "About " + weeks.toFixed(1) + " weeks" : "–") + "</span><span>for the plan to pay for itself</span></div>";
  }

  // ---------- wiring ----------
  function renderAll() { renderDashboard(); renderAlerts(); renderReport(); }

  function init() {
    var cats = Array.from(new Set(trends.map(function (t) { return t.category; }))).sort();
    var langs = Array.from(new Set(trends.map(function (t) { return t.language; }))).sort();
    fillSelect("filterCategory", cats, "category");
    fillSelect("filterLanguage", langs, "language");
    $("filterStatus").addEventListener("change", function (e) { state.status = e.target.value; renderAll(); });
    $("sortBy").addEventListener("change", function (e) { state.sort = e.target.value; renderAll(); });
    $("threshold").addEventListener("input", function (e) { state.threshold = parseInt(e.target.value, 10); renderAll(); });
    ["agencyName", "clientName"].forEach(function (id) { $(id).addEventListener("input", renderReport); });
    ["hours", "rate", "plan"].forEach(function (id) { $(id).addEventListener("input", renderValue); });
    $("printBtn").addEventListener("click", function () { window.print(); });

    document.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach(function (b) { b.classList.remove("active"); });
        document.querySelectorAll(".panel-tab").forEach(function (s) { s.classList.remove("active"); });
        btn.classList.add("active");
        $("tab-" + btn.dataset.tab).classList.add("active");
      });
    });
    renderAll();
    renderValue();
  }
  init();
})();
