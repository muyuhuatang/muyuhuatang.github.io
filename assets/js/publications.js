// Publications: search + topic/method/platform/year filters + sort
(function () {
  var listEl = document.getElementById("pub-list");
  if (!listEl) return;
  var items = Array.prototype.slice.call(document.querySelectorAll(".pub-item"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-group]"));
  var searchEl = document.getElementById("pub-search");
  var sortEl = document.getElementById("pub-sort");
  var clearEl = document.getElementById("pub-clear");
  var countEl = document.getElementById("pub-count");
  var emptyEl = document.getElementById("pub-empty");

  function listOf(it, attr) {
    return (it.dataset[attr] || "").split(/\s+/).filter(Boolean);
  }
  items.forEach(function (it) {
    it._topics = listOf(it, "topics");
    it._methods = listOf(it, "methods");
    it._platforms = listOf(it, "platforms");
    it._year = it.dataset.year || "";
    it._order = parseInt(it.dataset.order || "0", 10);
    it._search = (it.textContent || "").toLowerCase().replace(/\s+/g, " ").trim();
  });

  var active = { topic: {}, method: {}, platform: {}, year: {} };
  var query = "";

  function propFor(group, it) {
    if (group === "topic") return it._topics;
    if (group === "method") return it._methods;
    if (group === "platform") return it._platforms;
    return [it._year];
  }
  function hasKey(it, group, key) {
    return propFor(group, it).indexOf(key) !== -1;
  }
  function anyActive(group) {
    return Object.keys(active[group]).length > 0;
  }
  function matchesGroup(it, group) {
    if (!anyActive(group)) return true;
    var keys = Object.keys(active[group]);
    for (var i = 0; i < keys.length; i++) if (hasKey(it, group, keys[i])) return true;
    return false;
  }
  function visible(it) {
    if (query && it._search.indexOf(query) === -1) return false;
    return matchesGroup(it, "topic") && matchesGroup(it, "method") &&
           matchesGroup(it, "platform") && matchesGroup(it, "year");
  }

  // static counts per chip (total items having that key)
  chips.forEach(function (chip) {
    var g = chip.dataset.group, k = chip.dataset.key;
    var n = items.filter(function (it) { return hasKey(it, g, k); }).length;
    var c = chip.querySelector(".cnt");
    if (c) c.textContent = n;
  });

  function sortItems() {
    var dir = sortEl ? sortEl.value : "new";
    var all = items.slice();
    all.sort(function (a, b) {
      var ya = parseInt(a._year, 10), yb = parseInt(b._year, 10);
      if (dir === "old") return (ya - yb) || (a._order - b._order);
      return (yb - ya) || (a._order - b._order);
    });
    all.forEach(function (it) { listEl.appendChild(it); });
  }

  function apply() {
    var n = 0;
    items.forEach(function (it) {
      var v = visible(it);
      it.hidden = !v;
      if (v) n++;
    });
    if (countEl) countEl.textContent = n + (n === 1 ? " match" : " matches");
    if (emptyEl) emptyEl.hidden = n > 0;
    sortItems();
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var g = chip.dataset.group, k = chip.dataset.key;
      if (active[g][k]) { delete active[g][k]; chip.classList.remove("active"); }
      else { active[g][k] = true; chip.classList.add("active"); }
      apply();
    });
  });
  if (searchEl) searchEl.addEventListener("input", function () {
    query = searchEl.value.toLowerCase().trim();
    apply();
  });
  if (sortEl) sortEl.addEventListener("change", apply);
  if (clearEl) clearEl.addEventListener("click", function () {
    active = { topic: {}, method: {}, platform: {}, year: {} };
    query = "";
    if (searchEl) searchEl.value = "";
    if (sortEl) sortEl.value = "new";
    chips.forEach(function (c) { c.classList.remove("active"); });
    apply();
  });

  apply();
})();
