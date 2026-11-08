import { siteConfig } from '../config/site.js'
import { buildContactLinks } from '../lib/contact-links.js'

export default function ContactActions() {
  const links = buildContactLinks({
    phone: siteConfig.publicPhone,
    whatsapp: siteConfig.whatsappNumber,
    email: siteConfig.publicEmail,
    message: siteConfig.whatsappMessage,
  })

  return (
    <div className="contact-actions" aria-label="Restaurant contact options">
      <div className="contact-detail-row">
        <strong>Address</strong>
        <span>{siteConfig.addressLabel}</span>
      </div>
      <div className="contact-detail-row">
        <strong>Opening hours</strong>
        <span>{siteConfig.openingHoursLabel}</span>
      </div>
      {links.phone && <a href={links.phone.href}>Call: {links.phone.label}</a>}
      {links.email && <a href={links.email.href}>Email: {links.email.label}</a>}
      {siteConfig.mapUrl?.startsWith('https://') && (
        <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer">Get directions</a>
      )}
      {siteConfig.instagramUrl?.startsWith('https://') && (
        <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
      )}
      {links.whatsapp ? (
        <a className="contact-whatsapp-button" href={links.whatsapp.href} target="_blank" rel="noopener noreferrer">
          WhatsApp the restaurant
        </a>
      ) : (
        <span className="contact-whatsapp-button is-disabled" aria-disabled="true">
          WhatsApp · business number pending verification
        </span>
      )}
      <p className="contact-demo-note">Demo information only. Confirm the real address, business hours and contact details before publishing this site for a restaurant.</p>
    </div>
  )
}
