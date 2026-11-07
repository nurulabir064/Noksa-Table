import { siteConfig } from '../config/site.js'
import { buildContactLinks } from '../lib/contact-links.js'
import { MessageCircle, ArrowUpRight } from 'lucide-react'

export default function ContactActions() {
  if (!siteConfig.features.whatsappContact) return null

  const link = buildContactLinks({
    whatsapp: siteConfig.whatsappNumber,
    message: siteConfig.whatsappMessage,
  }).whatsapp

  if (!link) return <p className="contact-number-fallback">WhatsApp contact is not configured yet.</p>

  return (
    <section className="contact-whatsapp-card" aria-label="WhatsApp contact">
      <div className="contact-whatsapp-icon"><MessageCircle size={25}/></div>
      <div className="contact-whatsapp-copy">
        <span className="premium-kicker">WHATSAPP CONTACT</span>
        <h2>Speak with our team.</h2>
        <p>For menu questions and order enquiries, reach {siteConfig.brandName} directly.</p>
      </div>
      <a className="contact-whatsapp-button" href={link.href} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={17}/> {siteConfig.whatsappNumber} <ArrowUpRight size={16}/>
      </a>
    </section>
  )
}
