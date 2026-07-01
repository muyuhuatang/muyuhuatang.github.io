// mobile nav toggle
(function () {
  var btn = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();
