(function () {
  function unique(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }

  function ensureDatalist(id, values) {
    let list = document.getElementById(id);
    if (!list) {
      list = document.createElement("datalist");
      list.id = id;
      document.body.appendChild(list);
    }

    if (list.dataset.ready === "true") return;
    list.innerHTML = values.map((value) => `<option value="${String(value).replace(/"/g, "&quot;")}"></option>`).join("");
    list.dataset.ready = "true";
  }

  function attachSuggestions() {
    const spots = window.trivandrumFoodSpots || [];
    if (!spots.length) return false;

    ensureDatalist(
      "dishSuggestions",
      unique(spots.flatMap((spot) => [spot.speciality].concat(spot.dishes || [])))
    );
    ensureDatalist("spotSuggestions", unique(spots.map((spot) => spot.name)));
    ensureDatalist(
      "locationSuggestions",
      unique(spots.flatMap((spot) => [spot.area, spot.location]))
    );

    const inputs = Array.from(document.querySelectorAll("input"));
    const dish = inputs.find((input) => /Beef Fry|Puttu/i.test(input.placeholder));
    const spot = inputs.find((input) => /Rajan/i.test(input.placeholder));
    const location = inputs.find((input) => /Pattom|Chalai/i.test(input.placeholder));

    if (dish) {
      dish.setAttribute("list", "dishSuggestions");
      dish.setAttribute("autocomplete", "off");
    }
    if (spot) {
      spot.setAttribute("list", "spotSuggestions");
      spot.setAttribute("autocomplete", "off");
    }
    if (location) {
      location.setAttribute("list", "locationSuggestions");
      location.setAttribute("autocomplete", "off");
    }

    return Boolean(dish && spot && location);
  }

  if (!attachSuggestions()) {
    const observer = new MutationObserver(() => {
      if (attachSuggestions()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("load", attachSuggestions);
  }
})();
