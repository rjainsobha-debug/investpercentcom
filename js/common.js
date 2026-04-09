function openAdvisor(source = "page") {
  if (typeof gtag === "function") {
    gtag('event', 'whatsapp_click', {
      event_category: 'conversion',
      event_label: source
    });
  }

  window.open(
    'https://wa.me/919311354795?text=Hi, I came from ' + source + ' and need help',
    '_blank'
  );
}
