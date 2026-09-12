document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("writings-search");
  if (!input) return;

  const items = Array.from(document.querySelectorAll(".entry"));
  const groups = Array.from(document.querySelectorAll(".entry-group"));

  const apply = () => {
    const query = input.value.toLowerCase().trim();

    items.forEach((item) => {
      const haystack = item.getAttribute("data-search") || "";
      const hidden = query.length > 0 && haystack.indexOf(query) === -1;
      item.classList.toggle("unloaded", hidden);
    });

    // Hide a year heading when none of its posts are visible.
    groups.forEach((heading) => {
      let node = heading.nextElementSibling;
      let visible = false;
      while (node && node.classList.contains("entry")) {
        if (!node.classList.contains("unloaded")) visible = true;
        node = node.nextElementSibling;
      }
      heading.classList.toggle("unloaded", !visible);
    });
  };

  input.addEventListener("input", apply);
});
