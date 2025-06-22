document.addEventListener("DOMContentLoaded", () => {
    const header = document.createElement('div');
    header.innerHTML = '<div id="custom-header">iOS team knowledge</div>';
    document.body.insertBefore(header, document.body.firstChild);
  
    const footer = document.createElement('div');
    footer.innerHTML = '<div id="custom-footer">' + "📚 MyBook – Copyright © 2025" + '</div>';
    document.body.appendChild(footer);
  });
  