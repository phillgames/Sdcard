function testoutput() {
    console.log("Hello Word!")
}

document.addEventListener('DOMContentLoaded', function() {
  const duplicateBtn = document.getElementById('duplicate-btn');
  const original = document.getElementById('dupe');
  const container = document.getElementById('main');

  duplicateBtn.addEventListener('click', function() {
    // Clone the div
    const clone = original.cloneNode(true);
    // Remove id to avoid duplicates
    clone.id = '';
    // Append to container
    const checkbox = clone.querySelector('.remove-check');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            clone.remove();
        });
    }

    container.appendChild(clone);
  });
});
