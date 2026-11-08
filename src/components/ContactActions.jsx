import { siteConfig } from '../config/site.js'
import { buildContactLinks } from '../lib/contact-links.js'

export default function ContactActions() {
  const links = buildContactLinks({
    phone: siteConfig.publicPhone,
    whatsapp: siteConfig.whatsappNumber,
    email: siteConfig.publicEmail,
    message: siteConfig.whatsappMessage,
  })
  const hasContact = links.phone || links.whatsapp || links.email

  return (
    <div className="contact-actions" aria-label="Restaurant contact options">
      {hasContact ? (
        <>
          {links.phone && <a href={links.phone.href}>Call: {links.phone.label}</a>}
          {links.whatsapp && <a href={links.whatsapp.href} target="_blank" rel="noopener noreferrer">WhatsApp us</a>}
          {links.email && <a href={links.email.href}>Email: {links.email.label}</a>}
        </>
      ) : (
        <span>Public phone and email details will appear after verification.</span>
      )}
      <span className="contact-pending">WhatsApp · business number to be verified and activated.</span>
      {siteConfig.locationLabel && <span>{siteConfig.locationLabel}</span>}
      {siteConfig.openingHoursLabel && <span>{siteConfig.openingHoursLabel}</span>}
      {siteConfig.mapUrl?.startsWith('https://') && (
        <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer">Directions</a>
      )}
      {siteConfig.instagramUrl?.startsWith('https://') && (
        <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
      )}
    </div>
  )
}
