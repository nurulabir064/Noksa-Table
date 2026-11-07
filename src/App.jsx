import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useParams, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu as MenuIcon, X, Sparkles, Utensils, Users, MessageCircle } from 'lucide-react'
import { dishes } from './data'
import { siteConfig, isDemoContent } from './config/site.js'
import ContactActions from './components/ContactActions.jsx'
import { MenuLanding, MenuCategoryPage, categoryDetails } from './components/MenuPages.jsx'
import { buildWhatsAppOrderLink } from './lib/order-links.js'

function Header(){const [open,setOpen]=useState(false);useEffect(()=>{if(!open)return;const closeOnEscape=event=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',closeOnEscape);return()=>window.removeEventListener('keydown',closeOnEscape)},[open]);return <><a className="skip-link" href="#main-content">Skip to content</a><header className="header"><Link className="brand" to="/"><span className="brand-mark">{siteConfig.brandMark}</span><span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span></Link><button className="mobile-toggle" type="button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="primary-navigation">{open?<X/>:<MenuIcon/>}</button><nav id="primary-navigation" aria-label="Primary navigation" className={open?'nav open':'nav'}>{[['/','Home'],['/menu','Menu'],['/about','Our Story'],['/gallery','Gallery'],['/contact','Contact']].map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} end={to==='/'}>{label}</NavLink>)}</nav></header></>}
function Footer(){return <footer className="footer" data-reveal><div><Link className="brand footer-brand" to="/"><span className="brand-mark">{siteConfig.brandMark}</span><span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span></Link><p>{siteConfig.tagline}</p></div><div className="footer-right"><span>{siteConfig.locationLabel}</span><span>© {new Date().getFullYear()} {siteConfig.brandName}</span></div></footer>}
function DishCard({dish,quantity=0,onAdd,onRemove}){return <div className="dish-card"><Link to={'/menu/'+dish.id} className="dish-card-link"><div className="dish-image"><img src={dish.image} alt={dish.name} loading="lazy" decoding="async" width="1000" height="750" onError={event=>{event.currentTarget.onerror=null;event.currentTarget.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80'}}/>{dish.tag&&<span className="tag">{dish.tag}</span>}<span className="dish-arrow"><ArrowUpRight size={18}/></span></div><div className="dish-meta"><div><h3>{dish.name}</h3><p>{dish.category}</p><p className="dish-description">{dish.description}</p></div><strong>৳{dish.price}</strong></div></Link>{dish.imageCredit&&<p className="image-credit">Photo: <a href={dish.imageCredit.url} target="_blank" rel="noreferrer">{dish.imageCredit.name}</a> · <a href={dish.imageCredit.licenseUrl} target="_blank" rel="noreferrer">{dish.imageCredit.license}</a></p>}{onAdd&&<div className="dish-order-control">{quantity===0?<button type="button" className="add-to-order" onClick={()=>onAdd(dish.id)} aria-label={'Add '+dish.name+' to order'}>Add to order <span>+</span></button>:<div className="quantity-control" aria-label={dish.name+' quantity'}><button type="button" onClick={()=>onRemove(dish.id)} aria-label={'Remove one '+dish.name}>−</button><output aria-live="polite">{quantity}</output><button type="button" onClick={()=>onAdd(dish.id)} aria-label={'Add one '+dish.name}>+</button><span>৳{dish.price*quantity}</span></div>}</div>}</div>}
function Home(){
  const featuredDishes=dishes.filter(d=>['dhaka-kacchi','butter-chicken','thai-green-curry','seafood-platter','margherita-pizza','chocolate-fudge-cake'].includes(d.id))
  const atmosphere=[
    {src:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=85',alt:'Warmly lit restaurant dining room',label:'A welcoming atmosphere'},
    {src:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=85',alt:'Thoughtfully arranged restaurant table',label:'Details made for dining'},
    {src:'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1100&q=85',alt:'Contemporary restaurant interior',label:'Room to gather'},
  ]
  return <main id="main-content" className="home-premium">
    <section className="home-hero">
      <img className="home-hero-image" src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90" alt="Illustrative photograph of an inviting restaurant interior" fetchPriority="high" decoding="async"/>
      <div className="home-hero-overlay"/>
      <div className="home-hero-content">
        <span className="home-eyebrow">{siteConfig.brandName} · {siteConfig.descriptor}</span>
        <h1>Many flavours.<br/><em>One beautiful</em><br/>table.</h1>
        <p>From Bengali favourites to flavours across Asia and beyond — discover a menu made for good company and curious appetites.</p>
        <div className="home-hero-actions">
          <Link className="home-primary-button" to="/menu">Explore the menu <ArrowRight size={17}/></Link>
          <Link className="home-secondary-link" to="/about">Discover {siteConfig.brandName} <ArrowUpRight size={16}/></Link>
        </div>
      </div>
      <div className="home-hero-caption"><span>01 / A WORLD OF FLAVOUR</span><span>Illustrative restaurant photography</span></div>
    </section>

    <section className="home-intro-band">
      <div className="home-intro-heading"><span className="home-kicker">THE NOKSHA TABLE EXPERIENCE</span><h2>Good food brings<br/><em>everything together.</em></h2></div>
      <p>One table, many traditions. Explore comforting local favourites, vibrant Asian plates and familiar international classics — brought together in one thoughtfully curated restaurant concept.</p>
    </section>

    <section className="home-values" aria-label="Our dining philosophy">
      <article><span><Utensils size={21}/></span><div><strong>A menu without borders</strong><p>Ten menu chapters, from Bengali classics to global favourites.</p></div></article>
      <article><span><Users size={21}/></span><div><strong>Made for sharing</strong><p>Plates and flavours imagined for meals with your favourite people.</p></div></article>
      <article><span><Sparkles size={21}/></span><div><strong>Thoughtful details</strong><p>A warm, premium-casual dining mood with an editorial touch.</p></div></article>
    </section>

    <section className="home-category-section">
      <div className="home-section-heading"><div><span className="home-kicker">EXPLORE BY CRAVING</span><h2>A menu of <em>possibilities.</em></h2><p>Find your next favourite across ten distinct categories.</p></div><Link to="/menu" className="home-text-link">View complete menu <ArrowUpRight size={16}/></Link></div>
      <div className="home-category-grid">
        {categoryDetails.map((category,index)=><Link key={category.slug} to={'/menu/category/'+category.slug} className="home-category-tile">
          <img src={category.image} alt="" loading="lazy" decoding="async"/>
          <span className="home-category-shade"/>
          <small>{String(index+1).padStart(2,'0')}</small>
          <strong>{category.name}</strong>
          <span className="home-category-arrow"><ArrowUpRight size={17}/></span>
        </Link>)}
      </div>
    </section>

    <section className="home-featured-section">
      <div className="home-section-heading"><div><span className="home-kicker">A FEW TABLE FAVOURITES</span><h2>Worth a closer <em>look.</em></h2><p>A selection from the illustrative NOKSHA TABLE menu.</p></div><Link to="/menu" className="home-text-link">Browse all dishes <ArrowUpRight size={16}/></Link></div>
      <div className="home-featured-grid">
        {featuredDishes.map(dish=>{
          const orderUrl=siteConfig.features.whatsappOrdering?buildWhatsAppOrderLink(dish,siteConfig.whatsappNumber,1,siteConfig.brandName):null
          return <article className="home-food-card" key={dish.id}>
            <Link to={'/menu/'+dish.id} className="home-food-image"><img src={dish.image} alt={dish.name} loading="lazy" decoding="async"/><span>Explore dish <ArrowUpRight size={15}/></span></Link>
            <div className="home-food-copy"><div><small>{dish.category}</small><h3>{dish.name}</h3><p>{dish.description}</p></div><strong>৳{dish.price}</strong></div>
            {orderUrl&&<a className="home-order-link" href={orderUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/> Order enquiry on WhatsApp <ArrowUpRight size={14}/></a>}
          </article>
        })}
      </div>
      {isDemoContent&&<p className="home-sample-note">Menu items and prices are illustrative samples. Please confirm availability and current prices on WhatsApp.</p>}
    </section>

    <section className="home-atmosphere-section">
      <div className="home-atmosphere-copy"><span className="home-kicker">A PLACE TO COME TOGETHER</span><h2>Stay for the food.<br/><em>Remember the feeling.</em></h2><p>From the first welcome to the last bite, the NOKSHA TABLE concept is imagined around warmth, generous hospitality and the pleasure of sharing a table.</p><Link to="/gallery" className="home-light-link">Explore the gallery <ArrowUpRight size={16}/></Link></div>
      <div className="home-atmosphere-grid">{atmosphere.map(item=><figure key={item.src}><img src={item.src} alt={item.alt} loading="lazy" decoding="async"/><figcaption>{item.label}</figcaption></figure>)}</div>
    </section>

    <section className="home-final-cta">
      <span className="home-kicker">YOUR NEXT GOOD MEAL STARTS HERE</span>
      <h2>Bring your appetite.<br/><em>We’ll bring the inspiration.</em></h2>
      <p>Explore the menu or get in touch with NOKSHA TABLE for an order enquiry.</p>
      <div><Link to="/menu" className="home-primary-button">Explore all menus <ArrowRight size={17}/></Link><Link to="/contact" className="home-light-link">Contact us <ArrowUpRight size={16}/></Link></div>
    </section>
  </main>
}
function Menu(){return <MenuLanding/>}
function CategoryMenu(){return <MenuCategoryPage/>}
function Detail(){const {id}=useParams(),d=dishes.find(x=>x.id===id);if(!d)return <main id="main-content" className="page section-wrap"><h1>Dish not found</h1><Link to="/menu">Back to menu</Link></main>;const orderUrl=siteConfig.features.whatsappOrdering?buildWhatsAppOrderLink(d,siteConfig.whatsappNumber,1,siteConfig.brandName):null;return <main id="main-content" className="detail section-wrap"><img decoding="async" fetchPriority="high" width="1200" height="900" src={d.image} alt={d.name}/><div><div className="eyebrow">{d.category}</div><h1>{d.name}</h1><strong className="detail-price">৳{d.price}</strong><p>{d.description}</p>{orderUrl&&<a className="button button-dark" href={orderUrl} target="_blank" rel="noopener noreferrer">Order enquiry on WhatsApp <ArrowUpRight size={16}/></a>}{d.imageCredit&&<p className="image-credit">Photo: <a href={d.imageCredit.url} target="_blank" rel="noreferrer">{d.imageCredit.name}</a> · <a href={d.imageCredit.licenseUrl} target="_blank" rel="noreferrer">{d.imageCredit.license}</a></p>}{isDemoContent&&<p className="sample-note">Illustrative menu item and price. WhatsApp opens a message draft; the restaurant must confirm availability and final price.</p>}</div></main>}
function About(){return <main id="main-content" className="page section-wrap"><div className="eyebrow">A TABLE WITH A POINT OF VIEW</div><h1 className="page-title">Our story, in <em>layers.</em></h1><div className="story-grid"><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85" alt="Warm restaurant interior" loading="lazy" decoding="async" width="1200" height="900"/><div><h2>Honouring where we come from. Exploring where we can go.</h2><p>{siteConfig.brandName} is a restaurant concept built around a simple idea: food can feel both familiar and new. Replace this sample story with the client-approved business history and values before launch.</p><p>Every detail is imagined to make sharing a meal feel special — without making it feel complicated.</p></div></div></main>}
function Gallery(){const venueImages=[
  {src:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',alt:'Restaurant dining room and interior',label:'Dining room'},
  {src:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85',alt:'Elegant restaurant table setting',label:'Table setting'},
  {src:'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85',alt:'Warm restaurant ambience',label:'Restaurant ambience'},
  {src:'https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=1200&q=85',alt:'Restaurant dining experience',label:'Dining experience'},
  {src:'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85',alt:'Restaurant interior with warm lighting',label:'Interior details'},
  {src:'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85',alt:'Contemporary restaurant seating',label:'Seating'},
];return <main id="main-content" className="page section-wrap gallery-page"><div className="eyebrow">A FEAST FOR THE EYES</div><h1 className="page-title">A seat at <em>our table.</em></h1><p className="page-intro">Explore the restaurant moodboard, dining spaces and illustrative menu photography. Stock images are used as visual references, not actual restaurant photographs.</p><h2 className="gallery-section-title">The restaurant <em>& dining</em></h2><div className="gallery-grid premium-gallery-grid">{venueImages.map((item)=><figure className="gallery-item" key={item.src}><img loading="lazy" decoding="async" width="1000" height="750" src={item.src} alt={item.alt}/><figcaption>{item.label}</figcaption></figure>)}</div><h2 className="gallery-section-title">From the <em>menu</em></h2><div className="gallery-grid premium-gallery-grid">{dishes.map(d=><figure className="gallery-item" key={d.id}><img loading="lazy" decoding="async" width="1000" height="750" src={d.image} alt={d.name}/><figcaption>{d.name} · Illustrative menu photography</figcaption></figure>)}</div></main>}function getLocalDateValue(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));return values.year+'-'+values.month+'-'+values.day}
function FormPage({reservation=false}){
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const reservationEnabled=siteConfig.features.reservationRequests && import.meta.env.VITE_RESERVATIONS_ENABLED==='true'
    && Boolean(import.meta.env.VITE_PRIVACY_POLICY_URL);
  const privacyUrl=import.meta.env.VITE_PRIVACY_POLICY_URL;

  async function handleSubmit(event){
    event.preventDefault();
    const form=event.currentTarget;
    if(!form.reportValidity())return;

    if(!reservation){
      setSent(true);
      return;
    }

    if(!reservationEnabled){
      setError('Online reservation requests are not active yet. No personal details have been submitted.');
      return;
    }

    setLoading(true);
    setError('');
    try{
      const formData=new FormData(form);
      const response=await fetch('/api/reservations',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:formData.get('name'),
          email:formData.get('email'),
          phone:formData.get('phone'),
          date:formData.get('date'),
          time:formData.get('time'),
          guestCount:formData.get('guestCount'),
          message:formData.get('message'),
          website:formData.get('website'),
          consent:formData.get('consent')==='on'
        })
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'We could not submit your request.');
      setSent(true);
    }catch(err){
      setError(err instanceof Error?err.message:'A network error occurred. Please try again.');
    }finally{
      setLoading(false);
    }
  }

  return <main id="main-content" className="page section-wrap form-page">
    <div className="eyebrow">{reservation?'LET’S SAVE YOU A SEAT':'WE’D LOVE TO HEAR FROM YOU'}</div>
    <h1 className="page-title">{reservation?'Join us at the':'Say hello to'} <em>{reservation?'table.':siteConfig.brandName+'.'}</em></h1>
    <p className="page-intro">{reservation?'Choose your preferred date and time. A request is not a confirmed booking.':'Questions, ideas, or just a hello — send us a note.'}</p>
    {sent
      ? <div className="success" role="status" aria-live="polite">
          <h2>{reservation?'Request received.':'Thank you.'}</h2>
          <p>{reservation?'Your request is pending. The restaurant must contact you to confirm availability.':'This is a demonstration only. Your message was not sent or stored.'}</p>
          <button type="button" className="under-link" onClick={()=>setSent(false)}>Start again</button>
        </div>
      : <form className="contact-form" onSubmit={handleSubmit}>
          <label>Your name<input required name="name" autoComplete="name" maxLength="80" placeholder="Full name"/></label>
          <label>Email address<input required type="email" name="email" autoComplete="email" maxLength="254" placeholder="you@example.com"/></label>
          {reservation&&<>
            <label>Phone number<input required type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength="25" placeholder="+880 1XXXXXXXXX"/></label>
            <div className="form-row">
              <label>Date<input required type="date" name="date" min={getLocalDateValue()}/></label>
              <label>Preferred time<input required type="time" name="time"/></label>
            </div>
            <label>Number of guests<select name="guestCount" defaultValue="2" required><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5 guests</option><option value="6">6 guests</option></select></label>
            <label className="reservation-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex="-1" autoComplete="off"/></label>
          </>}
          <label>{reservation?'Additional notes (optional)':'Your message'}<textarea name="message" rows="4" maxLength={reservation?1000:2000} placeholder="Write your message..." required={!reservation}/></label>
          {reservation&&reservationEnabled&&<label className="consent-field"><input type="checkbox" name="consent" required/><span>I have read the <a href={privacyUrl}>privacy notice</a> and agree that my details may be used to respond to this reservation request.</span></label>}
          {reservation&&!reservationEnabled&&<p className="sample-note">Online reservations are not enabled. This form will not send or store your personal details.</p>}
          {error&&<p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark" type="submit" disabled={loading||(reservation&&!reservationEnabled)}>
            {loading?'Submitting…':reservation?(reservationEnabled?'Send reservation request':'Reservations coming soon'):'Preview message'} <ArrowRight size={16}/>
          </button>
          <p className="sample-note">{reservation?'A request remains pending until the restaurant confirms it.':'Demo only — no message is transmitted or stored.'}</p>
        </form>}
  </main>
}
function Contact(){return <main id="main-content" className="contact-page"><header className="contact-page-heading"><span className="home-kicker">WE’RE JUST A MESSAGE AWAY</span><h1>Let’s start a <em>conversation.</em></h1><p>Have a question about a dish, the menu or an order enquiry? Reach {siteConfig.brandName} directly on WhatsApp.</p></header><div className="contact-page-action"><ContactActions/></div>{isDemoContent&&<p className="contact-page-note">This is a restaurant concept website. Menu prices and availability are illustrative and must be confirmed directly.</p>}</main>}
export default function App(){const {pathname}=useLocation();useEffect(()=>{const brand=siteConfig.brandName;const siteBaseUrl=siteConfig.siteUrl.endsWith('/')?siteConfig.siteUrl.slice(0,-1):siteConfig.siteUrl;const titles={'/':brand+' | '+siteConfig.descriptor,'/menu':'Menu | '+brand,'/about':'Our Story | '+brand,'/gallery':'Gallery | '+brand,'/reservation':'Reserve a Table | '+brand,'/contact':'Contact | '+brand};const descriptions={'/':siteConfig.tagline,'/menu':'Explore the illustrative Bengali menu at ' + brand + '.','/about':'Learn about ' + brand + ' and its approach to food and hospitality.','/gallery':'Explore the gallery for ' + brand + '.','/reservation':'Send a demonstration table reservation request for ' + brand + '.','/contact':'Contact ' + brand + '.'};document.title=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute('content',descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample Bengali dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.'));const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.setAttribute('href',siteBaseUrl+(pathname==='/'?'/':pathname));const meta=(selector,value)=>{const node=document.querySelector(selector);if(node)node.setAttribute('content',value)};const pageTitle=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const pageDescription=descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample Bengali dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.');meta('meta[property="og:title"]',pageTitle);meta('meta[property="og:description"]',pageDescription);meta('meta[property="og:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="twitter:title"]',pageTitle);meta('meta[name="twitter:description"]',pageDescription);meta('meta[name="twitter:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="robots"]',titles[pathname]||pathname.startsWith('/menu/')?'index,follow':'noindex,follow');window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduceMotion){document.querySelectorAll('[data-reveal]').forEach(node=>node.classList.add('is-visible'));return}const nodes=document.querySelectorAll('[data-reveal]');if(!('IntersectionObserver' in window)){nodes.forEach(node=>node.classList.add('is-visible'));return}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect()},[pathname]);return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/><Route path="/menu/category/:slug" element={<CategoryMenu/>}/><Route path="/menu/:id" element={<Detail/>}/><Route path="/about" element={<About/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/reservation" element={<FormPage reservation/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<main id="main-content" className="page section-wrap"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/></Routes><Footer/></>}
