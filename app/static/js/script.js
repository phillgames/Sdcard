document.addEventListener("DOMContentLoaded", function () {
  const duplicateBtn = document.getElementById("duplicate-btn");
  const original = document.getElementById("dupe");
  const container = document.getElementById("main");

  // Load saved data from localStorage
  const savedData = JSON.parse(localStorage.getItem("duplicates") || "[]");
  savedData.forEach((fields) => {
    const clone = createClone(fields);
    container.appendChild(clone);
  });

  // Add new clone
  duplicateBtn.addEventListener("click", function () {
    const clone = createClone();
    container.appendChild(clone);
    saveDuplicates();
  });

  // Create clone and restore data
  function createClone(fields = {}) {
    const clone = original.cloneNode(true);
    clone.style.display = "flex"; // show the clone
    clone.id = ""; // remove duplicate ID

    const inputs = clone.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      const key = input.name || input.className || "";

      if (fields[key] !== undefined) {
        if (input.type === "checkbox") {
          input.checked = fields[key];
        } else {
          input.value = fields[key];
        }
      }

      // Save whenever user edits or changes
      input.addEventListener("input", saveDuplicates);
      input.addEventListener("change", saveDuplicates);
    });

    // Remove checkbox functionality
    const removeCheck = clone.querySelector(".remove-check");
    if (removeCheck) {
      removeCheck.addEventListener("change", function () {
        clone.remove();
        saveDuplicates();
      });
    }

    return clone;
  }

  // Save all clones to localStorage
  function saveDuplicates() {
    const clones = Array.from(container.children).filter((el) => el !== original && el.id !== "duplicate-btn");
    const data = clones.map((clone) => {
      const fields = {};
      const inputs = clone.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        const key = input.name || input.className || "";
        if (input.type === "checkbox") {
          fields[key] = input.checked;
        } else {
          fields[key] = input.value;
        }
      });
      return fields;
    });
    localStorage.setItem("duplicates", JSON.stringify(data));
  }
});