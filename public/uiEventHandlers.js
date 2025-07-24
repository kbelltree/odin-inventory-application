// Event handlers for client-side user interactions (e.g., select change, delete confirmation)
function submitSizeOptionOnChange(e) {
  e.target.form.submit();
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('#itemSize')
    .addEventListener('change', submitSizeOptionOnChange);
});
