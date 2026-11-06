for (const group of document.querySelectorAll("[data-interface-tabs]")) {
  const tablist = group.querySelector("[data-tablist]");
  const tabs = [...group.querySelectorAll("[data-tablist] button")];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  if (!(tablist instanceof HTMLElement) || tabs.length === 0 ||
      !tabs.every((tab) => tab instanceof HTMLButtonElement) ||
      !panels.every((panel) => panel instanceof HTMLElement)) {
    throw new Error("Moguri interface navigation has missing buttons or panels.");
  }

  const activate = (index, moveFocus = false) => {
    tabs.forEach((tab, current) => {
      const selected = current === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[current].hidden = !selected;
    });
    if (moveFocus) tabs[index].focus();
  };

  tablist.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    panels[index].setAttribute("role", "tabpanel");
    panels[index].setAttribute("aria-labelledby", tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener("click", () => activate(index));
    tab.addEventListener("keydown", (event) => {
      let next;
      switch (event.key) {
        case "ArrowRight": next = (index + 1) % tabs.length; break;
        case "ArrowLeft": next = (index + tabs.length - 1) % tabs.length; break;
        case "Home": next = 0; break;
        case "End": next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      activate(next, true);
    });
  });

  group.classList.add("tabs-ready");
  activate(0);
  tablist.hidden = false;
}
