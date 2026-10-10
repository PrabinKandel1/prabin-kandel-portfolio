(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-form-status');
  const submit = form.querySelector('button[type="submit"]');
  const config = window.PK_EMAILJS_CONFIG || {};
  const configured = Boolean(config.publicKey && config.serviceId && config.templateId);
  const setStatus = (message, state) => { status.textContent = message; status.dataset.state = state || 'info'; };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    if (!configured || !window.emailjs) {
      const subject = encodeURIComponent(values.subject || 'Portfolio contact');
      const body = encodeURIComponent(`Name: ${values.from_name}\nEmail: ${values.reply_to}\n\n${values.message}`);
      setStatus('Opening your email app with your message prepared. Please press Send there to finish.', 'info');
      window.location.href = `mailto:${encodeURIComponent(config.recipientEmail || 'kandelprabin09@gmail.com')}?subject=${subject}&body=${body}`;
      return;
    }
    submit.disabled = true;
    submit.dataset.originalLabel = submit.innerHTML;
    submit.innerHTML = '<span>Sending…</span><span aria-hidden="true">↗</span>';
    setStatus('Sending your message securely through EmailJS…', 'info');
    try {
      await window.emailjs.send(config.serviceId, config.templateId, {
        from_name: values.from_name.trim(),
        reply_to: values.reply_to.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        to_email: config.recipientEmail || 'kandelprabin09@gmail.com'
      }, { publicKey: config.publicKey });
      form.reset();
      setStatus('Message sent successfully. Thank you for reaching out!', 'success');
    } catch (error) {
      console.error('EmailJS send failed:', error);
      setStatus('The message could not be sent right now. Please use the email button above, or try again later.', 'error');
    } finally {
      submit.disabled = false;
      submit.innerHTML = submit.dataset.originalLabel || '<span>Send message</span><span aria-hidden="true">↗</span>';
    }
  });
})();
