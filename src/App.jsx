import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useParams, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu as MenuIcon, Search, X } from 'lucide-react'
import { dishes, categories } from './data'
import { siteConfig } from './config/site.js'
import ContactActions from './components/ContactActions.jsx'
import { buildContactLinks } from './lib/contact-links.js'
import { buildWhatsAppOrderMessage } from './lib/whatsapp-order.js'
import { getCartSummary, updateCartQuantity } from './lib/cart.js'

function Header(){const [open,setOpen]=useState(false);const whatsappLink=buildContactLinks({whatsapp:siteConfig.whatsappNumber,message:siteConfig.whatsappMessage}).whatsapp;useEffect(()=>{if(!open)return;const closeOnEscape=event=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',closeOnEscape);return()=>window.removeEventListener('keydown',closeOnEscape)},[open]);return <><a className="skip-link" href="#main-content">Skip to content</a><header className="header"><Link className="brand" to="/"><span className="brand-mark">ন</span><span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span></Link><button className="mobile-toggle" type="button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="primary-navigation">{open?<X/>:<MenuIcon/>}</button><nav id="primary-navigation" aria-label="Primary navigation" className={open?'nav open':'nav'}>{[['/','Home'],['/menu','Menu'],['/about','Our Story'],['/gallery','Gallery'],['/contact','Contact']].map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} end={to==='/'}>{label}</NavLink>)}{whatsappLink?<a className="nav-cta" href={whatsappLink.href} target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>WhatsApp us <ArrowUpRight size={15}/></a>:<Link className="nav-cta" to="/contact" onClick={()=>setOpen(false)}>Contact us <ArrowUpRight size={15}/></Link>}</nav></header></>}
function Footer(){return <footer className="footer" data-reveal><div><Link className="brand footer-brand" to="/"><span className="brand-mark">ন</span><span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span></Link><p>{siteConfig.tagline}</p></div><div className="footer-right"><span>{siteConfig.locationLabel}</span><span>© {new Date().getFullYear()} {siteConfig.brandName}</span></div></footer>}
function DishCard({dish,quantity=0,onAdd,onRemove}){return <div className="dish-card"><Link to={'/menu/'+dish.id} className="dish-card-link"><div className="dish-image"><img src={dish.image} alt={dish.name} loading="lazy" decoding="async" width="1000" height="750" onError={event=>{event.currentTarget.onerror=null;event.currentTarget.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80'}}/>{dish.tag&&<span className="tag">{dish.tag}</span>}<span className="dish-arrow"><ArrowUpRight size={18}/></span></div><div className="dish-meta"><div><h3>{dish.name}</h3><p>{dish.category}</p><p className="dish-description">{dish.description}</p></div><strong>৳{dish.price}</strong></div></Link>{dish.imageCredit&&<p className="image-credit">Photo: <a href={dish.imageCredit.url} target="_blank" rel="noreferrer">{dish.imageCredit.name}</a> · <a href={dish.imageCredit.licenseUrl} target="_blank" rel="noreferrer">{dish.imageCredit.license}</a></p>}{onAdd&&<div className="dish-order-control">{quantity===0?<button type="button" className="add-to-order" onClick={()=>onAdd(dish.id)} aria-label={'Add '+dish.name+' to order'}>Add to order <span>+</span></button>:<div className="quantity-control" aria-label={dish.name+' quantity'}><button type="button" onClick={()=>onRemove(dish.id)} aria-label={'Remove one '+dish.name}>−</button><output aria-live="polite">{quantity}</output><button type="button" onClick={()=>onAdd(dish.id)} aria-label={'Add one '+dish.name}>+</button><span>৳{dish.price*quantity}</span></div>}</div>}</div>}
function Home(){return <main id="main-content"><section className="hero"><img className="hero-bg" fetchPriority="high" decoding="async" width="2000" height="1100" src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=90" alt="A thoughtfully arranged restaurant dining scene"/><div className="hero-shade"/><div className="hero-content"><span className="eyebrow light">THAI · CHINESE · INDIAN · CONTINENTAL & MORE</span><h1>A world of<br/><em>flavour.</em><br/>One welcoming table.</h1><p>Discover wok-fired favourites, comforting curries, Continental plates, fresh seafood, handcrafted mocktails and indulgent desserts.</p><div className="hero-actions"><Link className="button button-light" to="/menu">Explore the menu <ArrowRight size={16}/></Link><Link className="text-link light-link" to="/about">Discover our story <ArrowUpRight size={16}/></Link></div></div><div className="hero-note">GOOD FOOD. GOOD COMPANY. ALWAYS.</div></section><section className="intro section-wrap" data-reveal><div className="eyebrow">THE NOKSHA EXPERIENCE</div><div className="intro-grid"><h2>There is a story<br/>in every <em>flavour.</em></h2><div><p className="lead">We bring together much-loved international flavours in a setting shaped by thoughtful hospitality, good ingredients and the joy of sharing.</p><Link className="under-link" to="/about">A little about us <ArrowUpRight size={16}/></Link></div></div></section><section className="featured section-wrap" data-reveal><div className="section-heading"><div><div className="eyebrow">FROM OUR KITCHEN</div><h2>Made to be <em>remembered.</em></h2></div><Link className="under-link" to="/menu">View full menu <ArrowRight size={16}/></Link></div><div className="dish-grid">{dishes.filter(d=>['chicken-fried-rice','grilled-chicken-steak','blueberry-mojito','chocolate-crepe'].includes(d.id)).map(d=><DishCard key={d.id} dish={d}/>)}</div></section><section className="quote" data-reveal><span className="eyebrow light">OUR PHILOSOPHY</span><p>“The best meals are not just served.<br/><em>They are shared.”</em></p><span className="quote-mark">ন</span></section><section className="home-highlights section-wrap" data-reveal><div className="eyebrow">A LITTLE MORE TO DISCOVER</div><div className="home-highlight-grid"><article><span>01</span><h3>Flavours for every mood</h3><p>From Chinese wok classics and Thai favourites to Continental plates, seafood, mocktails and desserts.</p><Link className="under-link" to="/menu">Browse the menu <ArrowRight size={15}/></Link></article><article><span>02</span><h3>Made for sharing</h3><p>Easy-going dining, generous sharing plates and thoughtful details make every visit feel special.</p><Link className="under-link" to="/about">Our approach <ArrowRight size={15}/></Link></article><article><span>03</span><h3>See the experience</h3><p>Explore a curated look at signature dishes, refreshing drinks, desserts and the dining mood.</p><Link className="under-link" to="/gallery">Explore gallery <ArrowRight size={15}/></Link></article></div></section><section className="home-gallery section-wrap" data-reveal><div className="section-heading"><div><div className="eyebrow">A GLIMPSE OF THE TABLE</div><h2>Feast with your <em>eyes.</em></h2></div><Link className="under-link" to="/gallery">View the gallery <ArrowRight size={15}/></Link></div><div className="home-gallery-grid"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85" alt="Warm contemporary restaurant interior" loading="lazy" decoding="async"/><img src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85" alt="Chicken fried rice served fresh" loading="lazy" decoding="async"/><img src="https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85" alt="Blueberry mint mocktail" loading="lazy" decoding="async"/><img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85" alt="Creamy pasta served at the table" loading="lazy" decoding="async"/></div></section><section className="visit section-wrap" data-reveal><div><div className="eyebrow">YOUR TABLE IS WAITING</div><h2>Make room for<br/><em>something good.</em></h2><p>Bring your favourite people. We’ll take care of the rest.</p><Link className="button button-dark" to="/contact">Contact the restaurant <ArrowUpRight size={16}/></Link></div><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85" alt="Restaurant table setting" loading="lazy" decoding="async" width="1200" height="900"/></section></main>}
function Menu(){const [cat,setCat]=useState('All'),[q,setQ]=useState(''),[cart,setCart]=useState({});const normalizedQuery=q.trim().toLocaleLowerCase();const shown=useMemo(()=>dishes.filter(d=>(cat==='All'||d.category===cat)&&[d.name,d.category,d.description].some(value=>value.toLocaleLowerCase().includes(normalizedQuery))),[cat,normalizedQuery]);const order=getCartSummary(cart,dishes);const orderMessage=buildWhatsAppOrderMessage({restaurantName:siteConfig.brandName,items:order.items,subtotal:order.subtotal});const orderWhatsAppLink=buildContactLinks({whatsapp:siteConfig.whatsappNumber,message:orderMessage}).whatsapp;const addItem=id=>setCart(current=>updateCartQuantity(current,id,1));const removeItem=id=>setCart(current=>updateCartQuantity(current,id,-1));return <main id="main-content" className="page section-wrap menu-page"><div className="eyebrow">A THOUGHTFUL SELECTION</div><h1 className="page-title">The <em>menu.</em></h1><p className="page-intro">Browse a considered mix of Chinese, Thai, Indian and Continental favourites, plus seafood, mocktails, desserts and easy-to-share combos.</p><div className="menu-tools"><div className="filters" role="group" aria-label="Filter dishes by category">{categories.map(c=><button type="button" aria-pressed={cat===c} className={cat===c?'filter active':'filter'} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div><label className="search"><Search size={17}/><input type="search" aria-label="Search menu dishes" value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a dish"/></label></div><p className="results-count" aria-live="polite">{shown.length} {shown.length===1?'dish':'dishes'} found</p><div className="dish-grid menu-grid" key={cat+"-"+q}>{shown.map(d=><DishCard key={d.id} dish={d} quantity={cart[d.id]||0} onAdd={addItem} onRemove={removeItem}/>)}</div>{!shown.length&&<p className="empty">No dishes match your search. Try another name, description, or category.</p>}<section className="order-summary" aria-labelledby="order-summary-title"><div><div className="eyebrow">YOUR SELECTION</div><h2 id="order-summary-title">Your order <em>so far.</em></h2></div>{order.items.length===0?<p className="empty-order">Choose a dish above to see your quantity and running total here.</p>:<><ul className="order-lines">{order.items.map(item=><li key={item.id}><span>{item.name} <small>× {item.quantity}</small></span><strong>৳{item.lineTotal}</strong></li>)}</ul><div className="order-total"><span>Subtotal · {order.totalQuantity} {order.totalQuantity===1?'item':'items'}</span><strong>৳{order.subtotal}</strong></div><p className="sample-note">Your selected dishes and subtotal will be sent to the restaurant on WhatsApp. The restaurant must confirm availability, delivery or pickup details, final charges and payment directly. This website does not process online payments.</p>{orderWhatsAppLink?<a className="button button-dark whatsapp-order-button" href={orderWhatsAppLink.href} target="_blank" rel="noopener noreferrer">Send order on WhatsApp <ArrowRight size={16}/></a>:<p className="form-error">WhatsApp ordering is unavailable until a verified restaurant WhatsApp number is configured.</p>}</>}</section><p className="sample-note">Demo menu: dish names, descriptions, photos and BDT prices are illustrative, not a live restaurant offer. Confirm availability and final prices before launch.</p>{order.items.length>0&&<div className="sticky-order-bar" role="region" aria-label="Current order"><div><span>{order.totalQuantity} {order.totalQuantity===1?'item':'items'} in your order</span><strong>৳{order.subtotal}</strong></div><a className="sticky-view-order" href="#order-summary">Review</a>{orderWhatsAppLink?<a className="sticky-whatsapp" href={orderWhatsAppLink.href} target="_blank" rel="noopener noreferrer">WhatsApp order <ArrowRight size={15}/></a>:<span className="sticky-unavailable">WhatsApp unavailable</span>}</div>}</main>}
function Detail(){const {id}=useParams(),d=dishes.find(x=>x.id===id);if(!d)return <main id="main-content" className="page section-wrap"><h1>Dish not found</h1><Link to="/menu">Back to menu</Link></main>;return <main id="main-content" className="detail section-wrap"><img decoding="async" fetchPriority="high" width="1200" height="900" src={d.image} alt={d.name} onError={event=>{event.currentTarget.onerror=null;event.currentTarget.src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"}}/><div><div className="eyebrow">{d.category}</div><h1>{d.name}</h1><strong className="detail-price">৳{d.price}</strong><p>{d.description}</p><a className="button button-dark" href={buildContactLinks({whatsapp:siteConfig.whatsappNumber,message:buildWhatsAppOrderMessage({restaurantName:siteConfig.brandName,items:[{name:d.name,quantity:1,lineTotal:d.price}],subtotal:d.price})}).whatsapp?.href||"/contact"} target="_blank" rel="noopener noreferrer">Order this dish on WhatsApp <ArrowRight size={16}/></a>{d.imageCredit&&<p className="image-credit">Photo: <a href={d.imageCredit.url} target="_blank" rel="noreferrer">{d.imageCredit.name}</a> · <a href={d.imageCredit.licenseUrl} target="_blank" rel="noreferrer">{d.imageCredit.license}</a></p>}<p className="sample-note">Illustrative menu item and price.</p></div></main>}
function About(){return <main id="main-content" className="page section-wrap"><div className="eyebrow">A TABLE WITH A POINT OF VIEW</div><h1 className="page-title">Our story, in <em>layers.</em></h1><div className="story-grid"><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85" alt="Warm restaurant interior" loading="lazy" decoding="async" width="1200" height="900"/><div><h2>A little bit of everywhere, brought to one table.</h2><p>{siteConfig.brandName} is a restaurant concept built around a simple idea: food can feel both familiar and new. Replace this sample story with the client-approved business history and values before launch.</p><p>Every detail is imagined to make sharing a meal feel special — without making it feel complicated.</p></div></div></main>}
function Gallery(){
  const images=[
    {id:'photo-1517248135467-4c7edcad34c4',alt:'Warm contemporary restaurant interior'},
    {id:'photo-1414235077428-338989a2e8c0',alt:'Elegant dining table with carefully arranged place settings'},
    {id:'photo-1559339352-11d035aa65de',alt:'Restaurant dining room with ambient lighting'},
    {id:'photo-1603133872878-684f208fb84b',alt:'A colourful plate of chicken fried rice'},
    {id:'photo-1513104890138-7c749659a591',alt:'Freshly baked pizza with melted cheese'},
    {id:'photo-1473093295043-cdd812d0e601',alt:'Pasta served with a creamy sauce'},
    {id:'photo-1599487488170-d11ec9c172f0',alt:'A platter of grilled tandoori-style food'},
    {id:'photo-1559737558-2f5a35f4523b',alt:'Seafood platter prepared for sharing'},
    {id:'photo-1513558161293-cdaf765edfd4',alt:'A chilled blueberry and mint mocktail'},
    {id:'photo-1536935338788846bb9981813',alt:'A strawberry and lime mocktail'},
    {id:'photo-1488477181946-6428a0291777',alt:'A strawberry crepe dessert with cream'},
    {id:'photo-1533134242443-d4fd215305ad',alt:'A slice of classic cheesecake'},
    {id:'photo-1559847844-5315695dadae',alt:'A Thai noodle dish served fresh'},
    {id:'photo-1532550907401-a500c9a57435',alt:'Grilled chicken steak with sides'},
    {id:'photo-1527477396000-e27163b481c2',alt:'Crispy chicken wings for sharing'},
    {id:'photo-1515003197210-e0cd7184f8b5',alt:'A colourful rice and curry plate'}
  ];
  const [selected,setSelected]=useState(null);
  useEffect(()=>{
    if(!selected)return;
    const close=event=>{if(event.key==='Escape')setSelected(null)};
    window.addEventListener('keydown',close);
    return()=>window.removeEventListener('keydown',close);
  },[selected]);
  return <main id="main-content" className="page section-wrap">
    <div className="eyebrow">A FEAST FOR THE EYES</div>
    <h1 className="page-title">A seat at <em>our table.</em></h1>
    <p className="page-intro">A visual tour of the food, flavours and dining atmosphere imagined for this multi-cuisine restaurant concept. Images are illustrative and should be replaced with client-approved photography before launch.</p>
    <div className="gallery-grid">
      {images.map((image,i)=><button type="button" className="gallery-item" key={image.id} onClick={()=>setSelected(image)} aria-label={'View image: '+image.alt}>
        <img loading="lazy" decoding="async" width="1000" height="750" src={'https://images.unsplash.com/'+image.id+'?auto=format&fit=crop&w=1000&q=85'} alt={image.alt}/>
      </button>)}
    </div>
    {selected&&<div className="gallery-lightbox" onClick={()=>setSelected(null)}>
      <div className="gallery-lightbox-panel" role="dialog" aria-modal="true" aria-label={selected.alt} onClick={event=>event.stopPropagation()}>
        <button type="button" className="gallery-lightbox-close" onClick={()=>setSelected(null)} aria-label="Close image">×</button>
        <img src={'https://images.unsplash.com/'+selected.id+'?auto=format&fit=max&w=1800&q=90'} alt={selected.alt}/>
        <p>{selected.alt}</p>
      </div>
    </div>}
  </main>
}
function getLocalDateValue(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));return values.year+'-'+values.month+'-'+values.day}
function FormPage({reservation=false}){
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const reservationEnabled=import.meta.env.VITE_RESERVATIONS_ENABLED==='true'
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
    <p className="page-intro">{reservation?'Choose your preferred date and time. A request is not a confirmed booking.':'Questions about the menu, a group visit or the restaurant concept? Get in touch with the team.'}</p>
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
function Contact(){return <><FormPage/><section className="contact-details section-wrap" data-reveal><div><div className="eyebrow">PLAN YOUR VISIT</div><h2>Find your way to <em>our table.</em></h2><p className="page-intro">Plan a visit with the sample location and hours below. These details are for the NOKSHA TABLE demo concept only and must be replaced with the restaurant’s verified information before launch.</p></div><div className="contact-details-card"><ContactActions/></div></section></>}
export default function App(){const {pathname}=useLocation();useEffect(()=>{const brand=siteConfig.brandName;const siteBaseUrl=siteConfig.siteUrl.endsWith('/')?siteConfig.siteUrl.slice(0,-1):siteConfig.siteUrl;const titles={'/':brand+' | '+siteConfig.descriptor,'/menu':'Menu | '+brand,'/about':'Our Story | '+brand,'/gallery':'Gallery | '+brand,'/reservation':'Reserve a Table | '+brand,'/contact':'Contact | '+brand};const descriptions={'/':siteConfig.tagline,'/menu':'Explore the illustrative multi-cuisine menu at ' + brand + '.','/about':'Discover the multi-cuisine idea behind ' + brand + '.', '/gallery':'Explore the gallery for ' + brand + '.','/reservation':'Send a demonstration table reservation request for ' + brand + '.','/contact':'Contact ' + brand + '.'};document.title=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute('content',descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample multi-cuisine dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.'));const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.setAttribute('href',siteBaseUrl+(pathname==='/'?'/':pathname));const meta=(selector,value)=>{const node=document.querySelector(selector);if(node)node.setAttribute('content',value)};const pageTitle=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const pageDescription=descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample multi-cuisine dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.');meta('meta[property="og:title"]',pageTitle);meta('meta[property="og:description"]',pageDescription);meta('meta[property="og:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="twitter:title"]',pageTitle);meta('meta[name="twitter:description"]',pageDescription);meta('meta[name="twitter:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="robots"]',titles[pathname]||pathname.startsWith('/menu/')?'index,follow':'noindex,follow');window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduceMotion){document.querySelectorAll('[data-reveal]').forEach(node=>node.classList.add('is-visible'));return}const nodes=document.querySelectorAll('[data-reveal]');if(!('IntersectionObserver' in window)){nodes.forEach(node=>node.classList.add('is-visible'));return}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect()},[pathname]);return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/><Route path="/menu/:id" element={<Detail/>}/><Route path="/about" element={<About/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/reservation" element={<FormPage reservation/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<main id="main-content" className="page section-wrap"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/></Routes><Footer/></>}
