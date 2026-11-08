import { siteConfig } from '../config/site.js'
import { buildContactLinks } from '../lib/contact-links.js'

export default function ContactActions() {
  const links = buildContactLinks({
    phone: siteConfig.publicPhone,
    email: siteConfig.publicEmail,
  })

  return (
    <div className="contact-actions" aria-label="Restaurant contact information">
      <div className="contact-detail-row">
        <strong>Address</strong>
        <span>{siteConfig.addressLabel}</span>
      </div>
      <div className="contact-detail-row">
        <strong>Opening hours</strong>
        <span>{siteConfig.openingHoursLabel}</span>
      </div>
      {links.whatsapp && <a className="contact-whatsapp-link" href={links.whatsapp.href} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <span aria-hidden="true">↗</span></a>}
      {links.phone && <a href={links.phone.href}>Call: {links.phone.label}</a>}
      {links.email && <a href={links.email.href}>Email: {links.email.label}</a>
      {siteConfig.mapUrl?.startsWith('https://') && (
        <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer">Get directions</a>
      )}
      {siteConfig.instagramUrl?.startsWith('https://') && (
        <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
      )}
      <p className="contact-demo-note">Demo information only. Confirm the real address, business hours and contact details before publishing this site for a restaurant.</p>
    </div>
  )
}
