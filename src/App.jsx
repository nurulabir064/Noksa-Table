import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useParams, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu as MenuIcon, Search, X } from 'lucide-react'
import { dishes, categories } from './data'
import { siteConfig } from './config/site.js'
import ContactActions from './components/ContactActions.jsx'

function Header(){const [open,setOpen]=useState(false);useEffect(()=>{if(!open)return;const closeOnEscape=event=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',closeOnEscape);return()=>window.removeEventListener('keydown',closeOnEscape)},[open]);return <><a className="skip-link" href="#main-content">Skip to content</a><header className="header"><Link className="brand" to="/"><span className="brand-mark">ন</span><span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span></Link><button className="mobile-toggle" type="button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="primary-navigation">{open?<X/>:<MenuIcon/>}</button><nav id="primary-navigation" aria-label="Primary navigation" className={open?'nav open':'nav'}>{[['/','Home'],['/menu','Menu'],['/about','Our Story'],['/gallery','Gallery'],['/contact','Contact']].map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} end={to==='/'}>{label}</NavLink>)}<Link className="nav-cta" to="/reservation" onClick={()=>setOpen(false)}>Reserve a table <ArrowUpRight size={15}/></Link></nav></header></>}
function Footer(){return <footer className="footer" data-reveal><div><Link className="brand footer-brand" to="/"><span className="brand-mark">ন</span><span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span></Link><p>{siteConfig.tagline}</p></div><div className="footer-right"><span>{siteConfig.locationLabel}</span><span>© {new Date().getFullYear()} {siteConfig.brandName}</span></div></footer>}
function DishCard({dish}){return <Link to={'/menu/'+dish.id} className="dish-card"><div className="dish-image"><img src={dish.image} alt={dish.name} loading="lazy" decoding="async" width="1000" height="750"/>{dish.tag&&<span className="tag">{dish.tag}</span>}<span className="dish-arrow"><ArrowUpRight size={18}/></span></div><div className="dish-meta"><div><h3>{dish.name}</h3><p>{dish.category}</p></div><strong>৳{dish.price}</strong></div></Link>}
function Home(){return <main id="main-content"><section className="hero"><img className="hero-bg" fetchPriority="high" decoding="async" width="2000" height="1100" src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=90" alt="A thoughtfully arranged Bengali dining table"/><div className="hero-shade"/><div className="hero-content"><span className="eyebrow light">A NEW EXPRESSION OF BENGALI CUISINE</span><h1>Rooted in<br/><em>tradition.</em><br/>Made for today.</h1><p>Familiar flavours, thoughtful details, and a table that always welcomes you.</p><div className="hero-actions"><Link className="button button-light" to="/menu">Explore the menu <ArrowRight size={16}/></Link><Link className="text-link light-link" to="/about">Discover our story <ArrowUpRight size={16}/></Link></div></div><div className="hero-note">GOOD FOOD. GOOD COMPANY. ALWAYS.</div></section><section className="intro section-wrap" data-reveal><div className="eyebrow">THE NOKSHA EXPERIENCE</div><div className="intro-grid"><h2>There is a story<br/>in every <em>flavour.</em></h2><div><p className="lead">We bring the warmth of Bengali food into a setting shaped by care, craft, and a little curiosity.</p><Link className="under-link" to="/about">A little about us <ArrowUpRight size={16}/></Link></div></div></section><section className="featured section-wrap" data-reveal><div className="section-heading"><div><div className="eyebrow">FROM OUR KITCHEN</div><h2>Made to be <em>remembered.</em></h2></div><Link className="under-link" to="/menu">View full menu <ArrowRight size={16}/></Link></div><div className="dish-grid">{dishes.slice(0,3).map(d=><DishCard key={d.id} dish={d}/>)}</div></section><section className="quote" data-reveal><span className="eyebrow light">OUR PHILOSOPHY</span><p>“The best meals are not just served.<br/><em>They are shared.”</em></p><span className="quote-mark">ন</span></section><section className="visit section-wrap" data-reveal><div><div className="eyebrow">YOUR TABLE IS WAITING</div><h2>Make room for<br/><em>something good.</em></h2><p>Bring your favourite people. We’ll take care of the rest.</p><Link className="button button-dark" to="/reservation">Plan your visit <ArrowUpRight size={16}/></Link></div><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85" alt="Restaurant table setting" loading="lazy" decoding="async" width="1200" height="900"/></section></main>}
function Menu(){const [cat,setCat]=useState('All'),[q,setQ]=useState('');const normalizedQuery=q.trim().toLocaleLowerCase();const shown=useMemo(()=>dishes.filter(d=>(cat==='All'||d.category===cat)&&[d.name,d.category,d.description].some(value=>value.toLocaleLowerCase().includes(normalizedQuery))),[cat,normalizedQuery]);return <main id="main-content" className="page section-wrap menu-page"><div className="eyebrow">A THOUGHTFUL SELECTION</div><h1 className="page-title">The <em>menu.</em></h1><p className="page-intro">A little something for every appetite. Explore familiar favourites and house signatures.</p><div className="menu-tools"><div className="filters" role="group" aria-label="Filter dishes by category">{categories.map(c=><button type="button" aria-pressed={cat===c} className={cat===c?'filter active':'filter'} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div><label className="search"><Search size={17}/><input type="search" aria-label="Search menu dishes" value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a dish"/></label></div><p className="results-count" aria-live="polite">{shown.length} {shown.length===1?'dish':'dishes'} found</p><div className="dish-grid menu-grid" key={cat+"-"+q}>{shown.map(d=><DishCard key={d.id} dish={d}/>)}</div>{!shown.length&&<p className="empty">No dishes match your search. Try another name, description, or category.</p>}<p className="sample-note">Menu and prices are illustrative sample content for this concept website.</p></main>}
function Detail(){const {id}=useParams(),d=dishes.find(x=>x.id===id);if(!d)return <main id="main-content" className="page section-wrap"><h1>Dish not found</h1><Link to="/menu">Back to menu</Link></main>;return <main id="main-content" className="detail section-wrap"><img decoding="async" fetchPriority="high" width="1200" height="900" src={d.image} alt={d.name}/><div><div className="eyebrow">{d.category}</div><h1>{d.name}</h1><strong className="detail-price">৳{d.price}</strong><p>{d.description}</p><Link className="button button-dark" to="/reservation">Reserve a table <ArrowRight size={16}/></Link><p className="sample-note">Illustrative menu item and price.</p></div></main>}
function About(){return <main id="main-content" className="page section-wrap"><div className="eyebrow">A TABLE WITH A POINT OF VIEW</div><h1 className="page-title">Our story, in <em>layers.</em></h1><div className="story-grid" data-reveal><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85" alt="Warm restaurant interior" loading="lazy" decoding="async" width="1200" height="900"/><div><h2>Honouring where we come from. Exploring where we can go.</h2><p>' + brand + ' is a fictional Bengali dining house concept built around a simple idea: food can feel both familiar and new. We take inspiration from the ingredients, rituals, and generosity of Bengali dining, then bring them together with a contemporary point of view.</p><p>Every detail is imagined to make sharing a meal feel special — without making it feel complicated.</p></div></div></main>}
function Gallery(){const imgs=['photo-1517248135467-4c7edcad34c4','photo-1414235077428-338989a2e8c0','photo-1559339352-11d035aa65de','photo-1547592180-85f173990554','photo-1547592166-23ac45744acd','photo-1515003197210-e0cd7184f8b5'];return <main id="main-content" className="page section-wrap"><div className="eyebrow">A FEAST FOR THE EYES</div><h1 className="page-title">A seat at <em>our table.</em></h1><p className="page-intro">A visual moodboard for the ' + brand + ' experience. Images are illustrative, not photographs of a real venue.</p><div className="gallery-grid">{imgs.map((id,i)=><div className="gallery-item" key={id}><img loading="lazy" decoding="async" width="1000" height="750" src={'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=1000&q=85'} alt={'Dining inspiration '+(i+1)}/></div>)}</div></main>}
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
    <h1 className="page-title">{reservation?'Join us at the':'Say hello to'} <em>{reservation?'table.':'Noksha.'}</em></h1>
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
function Contact(){return <><FormPage/><div className="contact-strip" data-reveal><ContactActions/></div></>}
export default function App(){const {pathname}=useLocation();useEffect(()=>{const brand=siteConfig.brandName;const titles={'/':brand+' | '+siteConfig.descriptor,'/menu':'Menu | '+brand,'/about':'Our Story | '+brand,'/gallery':'Gallery | '+brand,'/reservation':'Reserve a Table | '+brand,'/contact':'Contact | '+brand};const descriptions={'/':'Discover a Bengali dining house concept with thoughtfully reimagined dishes.','/menu':'Explore the illustrative Bengali menu at ' + brand + '.','/about':'Learn about the fictional Bengali dining house concept, ' + brand + '.','/gallery':'Explore the visual moodboard for the ' + brand + ' dining experience.','/reservation':'Send a demonstration table reservation request for ' + brand + '.','/contact':'Contact the ' + brand + ' concept restaurant.'};document.title=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute('content',descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample Bengali dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.'));const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.setAttribute('href',siteConfig.siteUrl.replace(/\\/$/,'')+(pathname==='/'?'/':pathname));const meta=(selector,value)=>{const node=document.querySelector(selector);if(node)node.setAttribute('content',value)};const pageTitle=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const pageDescription=descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample Bengali dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.');meta('meta[property="og:title"]',pageTitle);meta('meta[property="og:description"]',pageDescription);meta('meta[property="og:url"]',siteConfig.siteUrl.replace(/\\/$/,'')+(pathname==='/'?'/':pathname));meta('meta[name="twitter:title"]',pageTitle);meta('meta[name="twitter:description"]',pageDescription);meta('meta[name="twitter:url"]',siteConfig.siteUrl.replace(/\\/$/,'')+(pathname==='/'?'/':pathname));meta('meta[name="robots"]',titles[pathname]||pathname.startsWith('/menu/')?'index,follow':'noindex,follow');window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduceMotion){document.querySelectorAll('[data-reveal]').forEach(node=>node.classList.add('is-visible'));return}const nodes=document.querySelectorAll('[data-reveal]');if(!('IntersectionObserver' in window)){nodes.forEach(node=>node.classList.add('is-visible'));return}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect()},[pathname]);return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/><Route path="/menu/:id" element={<Detail/>}/><Route path="/about" element={<About/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/reservation" element={<FormPage reservation/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<main id="main-content" className="page section-wrap"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/></Routes><Footer/></>}
