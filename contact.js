// The ONE place for the public contact addresses (owner, 2026-11-17).
// To add or change an address: edit CONTACT below, nothing else. Every page marks a mail link or address with
// data-mail="<kind>" (for example <a data-mail="support"></a>) and this file fills in href and text.
// All addresses forward through Cloudflare Email Routing to the owner's mailbox (plans/domains.md).
//   se = mbm-group.se        ir = mbm-family.ir and mbm-computer.ir (both Iranian domains show the .ir address)
const CONTACT = {
  se: { info: 'info@mbm-group.se', support: 'support@mbm-group.se' },
  ir: { info: 'info@mbm-computer.ir', support: 'support@mbm-computer.ir' }
};

const mbmMail = (kind) => CONTACT[/\.ir$/i.test(window.location.hostname) ? 'ir' : 'se'][kind] || '';

document.querySelectorAll('[data-mail]').forEach((el) => {
  const address = mbmMail(el.dataset.mail);
  if (!address) return;
  el.textContent = address;
  if (el.tagName === 'A') el.href = `mailto:${address}`;
});
