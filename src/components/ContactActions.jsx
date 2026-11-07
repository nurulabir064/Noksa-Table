import { siteConfig } from '../config/site.js'
import { buildContactLinks } from '../lib/contact-links.js'
import { MessageCircle, ArrowUpRight } from 'lucide-react'

export default function ContactActions() {
  const link = buildContactLinks({
    whatsapp: siteConfig.whatsappNumber,
    message: 'Hello NOKSHA TABLE, I would like to ask about your menu.',
  }).whatsapp

  if (!link) return <p className="contact-number-fallback">WhatsApp contact is not available.</p>

  return (
    <section className="contact-whatsapp-card" aria-label="WhatsApp contact">
      <div className="contact-whatsapp-icon"><MessageCircle size={25}/></div>
      <div className="contact-whatsapp-copy">
        <span className="premium-kicker">LET’S TALK</span>
        <h2>One message away.</h2>
        <p>For menu questions and order enquiries, reach NOKSHA TABLE on WhatsApp.</p>
        <a className="contact-whatsapp-number" href={link.href} target="_blank" rel="noopener noreferrer">
          +880 1304-302201 <ArrowUpRight size={16}/>
        </a>
      </div>
      <a className="contact-whatsapp-button" href={link.href} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={17}/> Chat on WhatsApp
      </a>
    </section>
  )
}
